import NotImplementedError from 'typesdk/errors/http/extended/NotImplementedError';

import Service from '@/core/Service';
import { handleRouteError } from '@/errors/except';
import type { ApiRequest, ApiResponse } from '@/@types';


export class HandleWebhookRequestService implements Service<unknown, unknown> {
  public async execute(request: unknown): Promise<unknown> {
    // 
  }

  public static async handle(request: ApiRequest, response: ApiResponse): Promise<void> {
    try {
      throw new NotImplementedError('This service is not available yet');
    } catch (err: any) {
      await handleRouteError(err, request, response);
    }
  }
}

export default HandleWebhookRequestService;
