import { List } from 'typesdk/list';
import { deepCompare } from 'cryptx-sdk';
import { type DateTimeString, parseTimeString } from 'typesdk/datetime';
import { optionalDefined, unwrap, jsonSafeStringify, jsonSafeParser } from 'ndforge';
import PreconditionFailedError from 'typesdk/errors/http/extended/PreconditionFailedError';

import { connect } from '@/lib/database';
import Entity from '@/core/domain/entity';
import { aesEncrypt, aesDecrypt, sign } from '@/lib/crypto';


export type SessionKind = 'checkout' | 'identity';

export type SessionDocument<T> = {
  readonly sessionId: string;
  readonly identity?: string;
  readonly kind: SessionKind;
  readonly payload: T;
  readonly signature: string;
  readonly expiresAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};

type SessionProps<T> = {
  kind: SessionKind;
  identity?: string;
  payload: T;
  signature?: string;
  expires?: DateTimeString | Omit<string, DateTimeString>;
  createdAt?: string;
  updatedAt?: string;
};


export class Session<T> extends Entity<SessionProps<T>> {
  public get sessionId(): string {
    return this._id;
  }

  public get identity(): string | null {
    return this.props.identity || null;
  }

  public get kind(): SessionKind {
    return this.props.kind;
  }

  public get payload(): T {
    return this.props.payload;
  }

  public get signature(): Buffer {
    return Buffer.from(this.props.signature!, 'base64');
  }

  public get expiresAt(): Date | null {
    return this.props.expires ? new Date(this.props.expires as string) : null;
  }

  public get createdAt(): Date {
    return new Date(this.props.createdAt!);
  }

  public get updatedAt(): Date {
    return new Date(this.props.updatedAt!);
  }

  private constructor(props: SessionProps<T>, id?: string) {
    super(props, id);
  }

  public doc(): SessionDocument<T> {
    return Object.freeze<SessionDocument<T>>({
      createdAt: this.props.createdAt!,
      identity: this.props.identity,
      kind: this.props.kind,
      payload: this.props.payload,
      sessionId: this._id,
      signature: this.props.signature!,
      updatedAt: this.props.updatedAt!,
      expiresAt: this.props.expires as string | undefined,
    });
  }

  public static async create<T>(props: SessionProps<T>): Promise<Session<T>> {
    const database = await connect();

    try {
      const query = `INSERT INTO sessions (
      session_id,
      identity,
      kind,
      payload,
      signature,
      expires_at,
      created_at,
      updated_at) VALUES ($1, $2, $3,
      $4, $5, $6, $7, $8) RETURNING *`;

      const expiresAt = props.expires ? parseTimeString(props.expires as DateTimeString).toISOString() : null;
      const payload = aesEncrypt(
        unwrap( optionalDefined( jsonSafeStringify(props.payload) ) ),
        'base64' // eslint-disable-line comma-dangle
      );

      const signature = sign(unwrap( optionalDefined( jsonSafeStringify(props.payload) ) ), 'base64');

      const result = await database.query(query, {
        values: [
          Entity.generateId('uuid-without-dashes'),
          props.identity || null,
          props.kind,
          payload,
          signature,
          expiresAt,
          new Date().toISOString(),
          new Date().toISOString(),
        ],
      });

      return new Session<T>({
        kind: result.rows[0].kind,
        payload: props.payload,
        signature,
        createdAt: Entity._normalizeDateToString(result.rows[0].created_at),
        expires: Entity._normalizeDateToString(result.rows[0].expires_at),
        updatedAt: Entity._normalizeDateToString(result.rows[0].updated_at),
      }, result.rows[0].session_id);
    } finally {
      await database.close();
    }
  }

  public static async findById<T>(sessionId: string): Promise<Session<T> | null> {
    const database = await connect();

    try {
      const result = await database.query('SELECT * FROM sessions WHERE session_id = $1::TEXT', {
        values: [sessionId],
      });

      if(result.rows.length !== 1) return null;

      const topLevelPayload = aesDecrypt(Buffer.from(result.rows[0].payload, 'base64'), 'utf8');
      const calculatedSignature = sign(topLevelPayload);

      const isSignatureValid = await deepCompare(calculatedSignature, Buffer.from(result.rows[0].signature, 'base64'));

      if(!isSignatureValid) {
        throw new PreconditionFailedError(`Cannot validate the integrity of session '${sessionId}'`);
      }
      
      const parsed = jsonSafeParser<T>(topLevelPayload);

      if(parsed.isLeft()) {
        throw parsed.value;
      }

      return new Session<T>({
        kind: result.rows[0].kind,
        payload: parsed.value,
        signature: result.rows[0].signature,
        createdAt: Entity._normalizeDateToString(result.rows[0].created_at),
        expires: Entity._normalizeDateToString(result.rows[0].expires_at),
        updatedAt: Entity._normalizeDateToString(result.rows[0].updated_at),
      }, result.rows[0].session_id);
    } finally {
      await database.close();
    }
  }

  public static async findByIdentity<T = any>(identity: string, options?: { onError?: 'ignore' | 'throw' }): Promise<List<Session<T>>> {
    const shouldIgnoreErrors = options?.onError ? options.onError === 'ignore' : true;
    const database = await connect();

    try {
      const results = await database.query('SELECT * FROM sessions WHERE identity = $1::TEXT', {
        values: [identity],
      });

      const sessions = new List<Session<T>>();

      await Promise.all(
        results.rows.map(async row => {
          const topLevelPayload = aesDecrypt(Buffer.from(row.payload, 'base64'), 'utf8');
          const calculatedSignature = sign(topLevelPayload);

          const isSignatureValid = await deepCompare(calculatedSignature, Buffer.from(row.signature, 'base64'));

          if(!isSignatureValid) {
            if(shouldIgnoreErrors) return;
            throw new PreconditionFailedError(`Cannot validate the integrity of session '${row.session_id}'`);
          }
      
          const parsed = jsonSafeParser<T>(topLevelPayload);

          if(parsed.isLeft()) {
            if(shouldIgnoreErrors) return;
            throw parsed.value;
          }

          sessions.push(new Session<T>({
            kind: row.kind,
            payload: parsed.value,
            signature: row.signature,
            createdAt: Entity._normalizeDateToString(row.created_at),
            expires: Entity._normalizeDateToString(row.expires_at),
            updatedAt: Entity._normalizeDateToString(row.updated_at),
          }, row.session_id));
        })// eslint-disable-line comma-dangle
      );

      return sessions;
    } finally {
      await database.close();
    }
  }

  public static async clearIdentity(identity: string): Promise<number> {
    const database = await connect();

    try {
      const result = await database.query('DELETE FROM sessions WHERE identity = $1::TEXT', { values: [identity] });
      return result.rowCount || 0;
    } finally {
      await database.close();
    }
  }
}

export default Session;
