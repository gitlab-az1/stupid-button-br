import type { NextApiHandler } from 'next';

import { handleRouteError } from '@/errors/except';
import { StatusCode } from '@ts-overflow/node-framework';
import type { HttpMethod } from '@ts-overflow/node-framework/types';
import type { ApiRequest, ApiResponse, RequestHandler } from '@/@types';


export function requestMethod<T extends NextApiHandler | RequestHandler>(
  method: HttpMethod | HttpMethod[],
  handler: T // eslint-disable-line comma-dangle
): T {
  return (async (request: ApiRequest, response: ApiResponse) => {
    try {
      const allowed = (Array.isArray(method) ? method : [method]).map(item => item.toLowerCase().trim());
      const fetchMethod = request.method?.toLowerCase().trim() || '';

      if(!allowed.includes(fetchMethod)) {
        throw {
          message: `Method ${fetchMethod.toUpperCase()} is not allowed.`,
          status: StatusCode.MethodNotAllowed,
          statusCode: StatusCode.MethodNotAllowed,
          action: 'Try again with a different method.',
          errorCode: 'ERR_METHOD_NOT_ALLOWED',
        };
      }

      await handler(request, response);
    } catch (err: any) {
      await handleRouteError(err, request, response);
    }
  }) as T;
}

export default requestMethod;
