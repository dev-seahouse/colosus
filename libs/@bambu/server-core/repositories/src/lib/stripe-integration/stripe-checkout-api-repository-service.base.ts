import { BaseStripeRepositoryService } from './base-stripe-repository.service';
import Stripe from 'stripe';

export abstract class StripeCheckoutApiRepositoryServiceBase extends BaseStripeRepositoryService {
  public abstract CreateSession(
    requestId: string,
    params: Stripe.Checkout.SessionCreateParams,
    options?: Stripe.RequestOptions
  ): Promise<Stripe.Response<Stripe.Checkout.Session>>;
}
