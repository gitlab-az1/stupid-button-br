import { jsonSafeStringify } from 'typesdk/safe-json';
import { Either, left, right } from 'ndforge/@internals/either';
import { ExtendedSerializableError } from 'typesdk/errors/http/extended';

import type { ApiRequest, ApiResponse } from '@/@types';

// import inet from '@shared/core/inet';
// import writeLog from '@shared/core/log';


interface DomainError {
  readonly message: string;
  statusCode?: number;
  location?: string;
}

export async function handleRouteError(context: DomainError, request: ApiRequest, response: ApiResponse): Promise<void>;
export async function handleRouteError(context: { [key: string]: any }, request: ApiRequest, response: ApiResponse): Promise<void>;
export async function handleRouteError(context: object, request: ApiRequest, response: ApiResponse): Promise<void>;
export async function handleRouteError(context: null, request: ApiRequest, response: ApiResponse): Promise<void>;
export async function handleRouteError(context: undefined, request: ApiRequest, response: ApiResponse): Promise<void>;
export async function handleRouteError(
  context: any,
  _: ApiRequest,
  response: ApiResponse // eslint-disable-line comma-dangle
): Promise<void> {
  if(!context) {
    console.error('handleRouteError was called with an undefined context');
  }

  if(!context) return void response.writeHead(500).end();
  response.setHeader('Content-Type', 'application/json');

  const s = context.statusCode ?? 500;
  response.status(s);

  if(s >= 500) {
    // await writeLog('stderr', `${context.message} [from=${inet.extractIPFromApiRequest(request).address} contextual-session-id=${request.context.session ? request.context.session.sessionId : 'undefined'} contextual-user-id=${request.context.user ? request.context.user.userId : 'undefined'}] at ${context.stack}`);
    console.error(context);
  } else {
    // console.warn(context);
  }

  if(context instanceof ExtendedSerializableError) {
    response.send(jsonSafeStringify(context.serialize()));
    return void response.end();
  } else {
    response.send(jsonSafeStringify({
      action: context.action ?? 'Check the server logs for more information.',
      context: context.context ?? {},
      message: context.message,
      _raw: context,
    }));

    return void response.end();
  }
}


export async function catchException<T, E extends new (...params: any[]) => Error>(
  promise: Promise<T>,
  errorsToCatch?: E[],
  finallyCallback?: (() => void) // eslint-disable-line comma-dangle
): Promise<Either<InstanceType<E>, T>> {
  try {
    return right(await promise);
  } catch (err: any) {
    if(!errorsToCatch || !Array.isArray(errorsToCatch)) return left(err);
    if(errorsToCatch.some(e => err instanceof e)) return left(err);

    throw err;
  } finally {
    finallyCallback?.();
  }
}
