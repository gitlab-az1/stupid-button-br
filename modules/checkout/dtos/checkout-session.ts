export type CheckoutSessionProps = {
  readonly stripeSessionId: string;
  readonly status: 'pending' | 'successful' | 'rejected';
};
