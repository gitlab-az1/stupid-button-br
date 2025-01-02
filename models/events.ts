import { jsonSafeStringify, optionalDefined, unwrap } from 'ndforge';

import { connect } from '@/lib/database';
import Entity from '@/core/domain/entity';
import { aesEncrypt } from '@/lib/crypto';
import type { DeepReadonly } from '@/@types';


export type EventType = '';

export type ReadonlyPayload<T> = T extends object ? DeepReadonly<T> : T;

export type EventDocument<T> = {
  readonly eventId: string;
  readonly type: EventType;
  readonly sequence: number;
  readonly originator: string;
  readonly payload: ReadonlyPayload<T>;
  readonly dispatchedAt: string;
};

type EventProps<T> = {
  type: EventType;
  sequence?: number;
  originator: string;
  payload: T;
  dispatchedAt?: string;
};


export class Event<T> extends Entity<EventProps<T>> {
  public get eventId(): string {
    return this._id;
  }

  public get eventType(): EventType {
    return this.props.type;
  }

  public get sequence(): number {
    return this.props.sequence!;
  }

  public get originator(): string {
    return this.props.originator;
  }

  public get payload(): ReadonlyPayload<T> {
    return (
      typeof this.props.payload === 'object' ?
        Object.freeze(this.props.payload) :
        this.props.payload
    ) as ReadonlyPayload<T>;
  }

  public get dispatchedAt(): Date {
    return new Date(this.props.dispatchedAt!);
  }

  private constructor(props: EventProps<T>, id?: string) {
    super(props, id);
  }

  public static async create<T>(props: EventProps<T>): Promise<Event<T>> {
    const database = await connect();

    try {
      const query = `INSERT INTO events (
      event_id,
      event_type,
      originator,
      payload,
      dispatched_at) VALUES ($1, $2,
      $3, $4, $5) RETURNING *`;

      const payload = aesEncrypt(unwrap(optionalDefined(jsonSafeStringify(props.payload))), 'base64');

      const result = await database.query(query, {
        values: [
          Entity.generateId('uuid-without-dashes'),
          props.type,
          props.originator,
          payload,
          new Date().toISOString(),
        ],
      });

      return new Event<T>({
        originator: result.rows[0].originator,
        payload: props.payload,
        type: result.rows[0].event_type,
        dispatchedAt: Entity._normalizeDateToString(result.rows[0].dispatched_at),
        sequence: result.rows[0].sequence,
      }, result.rows[0].event_id);
    } finally {
      await database.close();
    }
  }
}

export default Event;
