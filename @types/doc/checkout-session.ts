import type { SessionDocument } from '@/models/sessions';
import type { CheckoutSessionProps } from '@/modules/checkout/dtos/checkout-session';


export type CheckoutSessionResponse = SessionDocument<CheckoutSessionProps>;
