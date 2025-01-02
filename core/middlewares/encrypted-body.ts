import type { NextApiHandler } from 'next';
import { isPlainObject } from '@ts-overflow/node-framework';

import { transporter } from '@/lib/http';
import type { ApiRequest, ApiResponse, RequestHandler, Writable } from '@/@types';


export function encryptedBody<T extends RequestHandler | NextApiHandler>(handler: T): T {
  return (async (request: ApiRequest, response: ApiResponse) => {
    if(request.method === 'GET' ||
    !request.body || 
    Object.keys(request.body).length < 1) return void await handler(request, response);
    
    // if(!request.headers['content-type']?.startsWith('application/json')) return void await handler(request, response);

    try {
      const payload = await _parse(request.body);
      (request as Writable<typeof request>).decryptedBody = typeof payload === 'object' && !Array.isArray(payload) ? payload : { __$payload: payload };

      await handler(request, response);
    } catch (err: any) {
      console.warn(err);
      (request as Writable<typeof request>).decryptedBody = {};

      await handler(request, response);
    }
  }) as T;
}

function _parse(input: unknown): Promise<any> {
  if(typeof input === 'string') {
    input = Buffer.from(input, 'base64');
  }

  if(input instanceof Uint8Array) return transporter.decryptBuffer(input);
  if(typeof input !== 'object' || !isPlainObject(input)) return Promise.resolve(input);

  return transporter.parseToken(input as any);
}
