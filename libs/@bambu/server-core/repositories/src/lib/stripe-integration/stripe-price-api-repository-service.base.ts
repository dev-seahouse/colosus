import { BaseStripeRepositoryService } from './base-stripe-repository.service';
import Stripe from 'stripe';

export abstract class StripePriceApiRepositoryServiceBase extends BaseStripeRepositoryService {
  public abstract List(
    requestId: string,
    params?: Stripe.PriceListParams,
    options?: Stripe.RequestOptions
  ): Promise<
    Stripe.ApiList<Stripe.Price> & {
      lastResponse: {
        headers: { [p: string]: string };
        requestId: string;
        statusCode: number;
        apiVersion?: string;
        idempotencyKey?: string;
        stripeAccount?: string;
      };
    }
  >;

  public abstract Search(
    requestId: string,
    params: Stripe.PriceSearchParams,
    options?: Stripe.RequestOptions
  ): Promise<
    Stripe.ApiSearchResult<Stripe.Price> & {
      lastResponse: {
        headers: { [p: string]: string };
        requestId: string;
        statusCode: number;
        apiVersion?: string;
        idempotencyKey?: string;
        stripeAccount?: string;
      };
    }
  >;

  public abstract GetById(
    id: string,
    requestId: string,
    params?: Stripe.PriceRetrieveParams,
    options?: Stripe.RequestOptions
  ): Promise<
    Stripe.Price & {
      lastResponse: {
        headers: { [p: string]: string };
        requestId: string;
        statusCode: number;
        apiVersion?: string;
        idempotencyKey?: string;
        stripeAccount?: string;
      };
    }
  >;
}
