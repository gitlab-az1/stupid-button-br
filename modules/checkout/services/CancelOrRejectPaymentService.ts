import UnprocessableEntityError from 'typesdk/errors/http/extended/UnprocessableEntityError';

import Service from '@/core/Service';
import Session from '@/models/sessions';
import { handleRouteError } from '@/errors/except';
import type { ApiRequest, ApiResponse } from '@/@types';


export class CancelOrRejectPaymentService implements Service<string, void> {
  public async execute(sessionId: string): Promise<void> {
    const someSession = await Session.findById(sessionId);

    if(!someSession) {
      throw new UnprocessableEntityError('Checkout session was not found');
    }

    if(someSession.identity) {
      await Session.clearIdentity(someSession.identity);
    }
  }

  public static async handle(request: ApiRequest, response: ApiResponse): Promise<void> {
    try {
      if(!request.cookies['_SBR.SID']) {
        throw new UnprocessableEntityError('Could not found your session id');
      }

      await (new CancelOrRejectPaymentService()).execute(request.cookies['_SBR.SID']);
      return void response.status(301).redirect('/').end();
    } catch (err: any) {
      await handleRouteError(err, request, response);
    }
  }
}

export default CancelOrRejectPaymentService;
