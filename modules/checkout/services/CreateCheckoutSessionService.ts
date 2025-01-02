import ForbiddenError from 'typesdk/errors/http/extended/ForbiddenError';
import BadRequestError from 'typesdk/errors/http/extended/BadRequestError';
import NotAcceptableError from 'typesdk/errors/http/extended/NotAcceptableError';

import stripe from '@/lib/stripe';
import Service from '@/core/Service';
import { isProduction } from '@/utils';
import Session from '@/models/sessions';
import { transporter } from '@/lib/http';
import { handleRouteError } from '@/errors/except';
import type { ApiRequest, ApiResponse } from '@/@types';
import { type CheckoutSessionProps } from '@/modules/checkout/dtos/checkout-session';
import { CreateCheckoutSessionRequestDTO } from '@/modules/checkout/dtos/CreateCheckoutSessionRequestDTO';


export class CreateCheckoutSessionService implements Service<CreateCheckoutSessionRequestDTO, Session<CheckoutSessionProps>> {
  public async execute(request: CreateCheckoutSessionRequestDTO): Promise<Session<CheckoutSessionProps>> {
    const identitySession = (await Session.findByIdentity(request.clientIdentity)).toArray();
    const alreadyDone = identitySession.filter(item => item.kind === 'checkout').length > 0;

    if(alreadyDone) {
      throw new ForbiddenError('User already checked out a stupid button');
    }

    const stripeSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      payment_method_types: ['card'],
      success_url: new URL('/reward', process.env.NEXT_PUBLIC_APP_URL).toString(),
      cancel_url: new URL('/api/v1/checkout/reject', process.env.NEXT_PUBLIC_APP_URL).toString(),
    });

    return Session.create<CheckoutSessionProps>({
      kind: 'checkout',
      identity: request.clientIdentity,
      payload: { stripeSessionId: stripeSession.id, status: 'pending' },
      expires: '15m',
    });
  }

  public static async handle(request: ApiRequest, response: ApiResponse): Promise<void> {
    try {
      if(!request.decryptedBody?.clientIdentity) {
        throw new BadRequestError('The client identity is missing in request body');
      }

      if(request.decryptedBody.content !== 'stupid_button') {
        throw new NotAcceptableError('We can only checkout stupid\'s buttons');
      }

      const session = await (new CreateCheckoutSessionService()).execute({
        clientIdentity: request.decryptedBody.clientIdentity,
        content: 'stupid_button',
      });

      const body = await transporter.encryptBuffer(session.doc());
      const idexp = new Date();
      idexp.setHours(idexp.getHours() + 24);

      response.setHeader('Set-Cookie', [
        `_SBR.SID=${session.sessionId}; Expires=${idexp.toUTCString()}; Path=/; HttpOnly; SameSite=Strict;${isProduction() ? ' Secure;' : ''}`,
      ]);

      response.status(201).send(body);
      return void response.end();
    } catch (err: any) {
      await handleRouteError(err, request, response);
    }
  }
}

export default CreateCheckoutSessionService;
