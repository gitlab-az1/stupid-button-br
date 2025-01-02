import type { NextApiHandler } from 'next';
import { uuidWithoutDashes } from 'ndforge';

import * as inet from '@/core/inet';
import { encryptedBody } from './encrypted-body';
import type { RequestHandler, ApiRequest, Writable, ApiResponse } from '@/@types';


export function initRequest<T extends RequestHandler | NextApiHandler>(callback: T): T {
  return (async (request: ApiRequest, response: ApiResponse) => {
    (<Writable<ApiRequest>>request).requestId = uuidWithoutDashes();

    (<Writable<ApiRequest>>request).inet = {
      geo: inet.extractGeoFromRequest(request),
      ip: inet.extractIPFromRequest(request),
      isp: inet.extractISPFromRequest(request),
    };

    (<Writable<ApiRequest>>request).context ??= {};

    await encryptedBody(callback)(request, response);
  }) as T;
}

export default initRequest;
