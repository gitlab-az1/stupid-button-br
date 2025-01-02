import type { NextApiRequest, NextApiResponse } from 'next';

import * as inet from '@/core/inet';


export interface RequestInet {
  readonly ip: inet.IPv4 | inet.IPv6;
  readonly isp?: inet.ISP;
  readonly geo: inet.Geo;
}

export interface RequestContext {
  [key: string]: any;

}

export interface ApiRequest extends NextApiRequest {
  readonly requestId: string;
  readonly inet: RequestInet;
  readonly context?: RequestContext;
  readonly decryptedBody?: Record<string | number, any> & {
    readonly __$payload?: any;
  };
}

export interface ApiResponse extends NextApiResponse {}


export type RequestHandler = (_request: ApiRequest, _response: ApiResponse) => Promise<void>;
