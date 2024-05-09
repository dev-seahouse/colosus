import Stripe from 'stripe';
import {
  StripeProductTypeEnum,
  StripeBillingAddressCollectionEnum,
  StripeRecurringIntervalEnum,
  StripePriceTypeEnum,
  StripeRecurringUsageTypeEnum,
} from './stripe-integration-domain.enum';
export interface IRequestAdvisorSubscriptionListResponseDto {
  subscriptions: Stripe.Subscription[];
}
export interface IRequestAdvisorSubscriptionListRequestDto {
  requestId: string;
  userId: string;
}

export interface ICheckSubscriptionEligibilityRequestDto {
  priceId: string;
  userId: string;
  requestId: string;
}

export interface IStripeGenerateBillingPortalSessionDomainRequestDto {
  userId: string;
  origin: string;
  requestId: string;
  returnUrl?: string;
}

export interface IStripeListProductsRequestDto {
  active?: boolean;
  created?: IStripeCreatedListPricesDto | number;

  /**
   * Only for backend calls, front-end will not have access to this.
   */
  expand?: Array<string>;
  ids?: Array<string>;
  shippable?: boolean;
  type?: StripeProductTypeEnum;
  url?: string;
  ending_before?: string;
  limit?: number;
  starting_after?: string;
}

export interface IListProductsDomainRequestDto {
  requestId: string;
  parameters: IStripeListProductsRequestDto;
}

export interface ICheckoutSubscriptionSessionRequestLineItemsDto {
  priceId: string;
  quantity: number;
}

export interface ICheckoutSubscriptionSessionRequestDto {
  billingAddressCollection: StripeBillingAddressCollectionEnum;
  lineItems: ICheckoutSubscriptionSessionRequestLineItemsDto[];
}

export interface IStripeSearchPricesRequestDto {
  query: string;
  limit?: number;
  page?: string;
  /**
   * This is meant for server side requests only.
   * Do not use in front end calls.
   */
  requestId?: string;
}

interface IStripeRecurringPaymentConfigurationDto {
  interval: StripeRecurringIntervalEnum;
  usage_type: StripeRecurringUsageTypeEnum;
}

export interface IStripeCreatedListPricesDto {
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
}

export interface ISubscriptionUpgradeRequestDto {
  subscriptionId: string;
  priceId: string;
}

export interface IStripeListPricesRequestDto {
  active?: boolean;
  currency?: string;
  product?: string;
  type?: StripePriceTypeEnum;
  created?: IStripeCreatedListPricesDto;
  ending_before?: string;
  limit?: number;
  lookup_keys?: string[];
  recurring?: IStripeRecurringPaymentConfigurationDto;
  starting_after?: string;

  /**
   * Not exposed in API function.
   * Currently only for internal server function calls.
   */
  expand?: string[];

  /**
   * Only here for request tracing.
   */
  requestId: string;
}

export interface ICheckoutSubscriptionSessionDomainRequestDto
  extends ICheckoutSubscriptionSessionRequestDto {
  originUrl: string;
  email: string;
  userId: string;
  requestId: string;
  realm: string;
  realmId: string;
  allowPromotionCodes?: boolean;
}

export interface IStripeWebhookHandlerValidationResultDto {
  isValid: boolean;
  parsedEventPayload: Stripe.Event;
}

export interface IGetSubscriptionUpgradeDetailsResponseDto {
  cost: number;
  startDate: string;
}

export function isStripeWebhookHandlerValidationResultDto(
  input: unknown
): input is IStripeWebhookHandlerValidationResultDto {
  if (!input) {
    return false;
  }

  const coercedInput = input as IStripeWebhookHandlerValidationResultDto;

  const isValidCheck = typeof coercedInput.isValid === 'boolean';

  const eventTypeInPlace =
    coercedInput?.parsedEventPayload?.type !== undefined &&
    coercedInput?.parsedEventPayload?.type !== null;

  return isValidCheck && eventTypeInPlace;
}

export abstract class StripeIntegrationDomainServiceBase {
  public abstract ListPrices(input: IStripeListPricesRequestDto): Promise<
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

  public abstract SearchPrices(input: IStripeSearchPricesRequestDto): Promise<
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

  public abstract GenerateCheckoutSession(
    input: ICheckoutSubscriptionSessionDomainRequestDto
  ): Promise<
    Stripe.Checkout.Session & {
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

  public abstract ListProducts(input: IListProductsDomainRequestDto): Promise<
    Stripe.ApiList<Stripe.Product> & {
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

  public abstract GenerateBillingPortalSession(
    input: IStripeGenerateBillingPortalSessionDomainRequestDto
  ): Promise<
    Stripe.BillingPortal.Session & {
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

  public abstract CheckIfUserIsEligibleForSubscription(
    input: ICheckSubscriptionEligibilityRequestDto
  ): Promise<boolean>;

  public abstract GetSubscriptionsForTenantByUserId(
    input: IRequestAdvisorSubscriptionListRequestDto
  ): Promise<IRequestAdvisorSubscriptionListResponseDto>;

  public abstract GetPriceDataById(
    requestId: string,
    priceId: string
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

  public abstract GetProductById(
    requestId: string,
    productId: string
  ): Promise<
    Stripe.Product & {
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

  public abstract GetSubscriptionsForTenantByTenantId({
    requestId,
    tenantId,
  }: {
    requestId: string;
    tenantId: string;
  }): Promise<IRequestAdvisorSubscriptionListResponseDto>;

  public abstract GetStripeCustomersByTenantId({
    requestId,
    tenantId,
  }: {
    requestId: string;
    tenantId: string;
  }): Promise<
    | null
    | Awaited<
        | (Stripe.Customer & {
            lastResponse: {
              headers: { [p: string]: string };
              requestId: string;
              statusCode: number;
              apiVersion?: string;
              idempotencyKey?: string;
              stripeAccount?: string;
            };
          })
        | (Stripe.DeletedCustomer & {
            lastResponse: {
              headers: { [p: string]: string };
              requestId: string;
              statusCode: number;
              apiVersion?: string;
              idempotencyKey?: string;
              stripeAccount?: string;
            };
          })
      >[]
  >;

  public abstract UpdateSubscriptionById({
    requestId,
    userId,
  }: {
    requestId: string;
    userId: string;
  }): Promise<void>;

  public abstract GetUpgradeSubscriptionDetails({
    requestId,
    userId,
  }: {
    requestId: string;
    userId: string;
  }): Promise<IGetSubscriptionUpgradeDetailsResponseDto>;
}
