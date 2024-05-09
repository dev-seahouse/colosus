import type { Stripe } from 'stripe';
import type { StripeIntegrationDto } from '@bambu/shared';
import StripeIntegrationBasePrivateApi from '../_Base/Base';
import { AxiosRequestConfig } from 'axios';
export interface StripeIntegrationCreateCheckoutSessionRequestDto {
  priceId: Stripe.Price['id'];
}

export type StripeIntegrationCreateCheckoutSessionResponseDto =
  Stripe.Checkout.Session;

export type StripeIntegrationGetSubscriptionsResponseDto =
  StripeIntegrationDto.IRequestAdvisorSubscriptionListResponseDto;

export interface IGetSubscriptionUpgradeDetailsResponseDto {
  cost: number;
  startDate: string;
}

export class StripeIntegrationAdvisorSubscriptionsApi extends StripeIntegrationBasePrivateApi {
  constructor(private readonly apiPath = '/advisor-subscriptions') {
    super();
  }

  /**
   * Generate session for Stripe Checkout.
   * - {@link http://localhost:9000/openapi#/Stripe%20Integration/StripeIntegrationController_CreateSession}.
   */
  public async createCheckoutSession({
    priceId,
  }: StripeIntegrationCreateCheckoutSessionRequestDto) {
    return this.axios.post<StripeIntegrationCreateCheckoutSessionResponseDto>(
      `${this.apiPath}/checkout/session`,
      {
        billingAddressCollection: 'required',
        lineItems: [
          {
            priceId,
            quantity: 1,
          },
        ],
      }
    );
  }

  /**
   * Gets all subscriptions belonging to advisor tenant.
   * - {@link http://localhost:9000/openapi#/Stripe%20Integration/StripeIntegrationController_GetAllSubscriptions}.
   */
  public async getSubscriptions() {
    return this.axios.get<StripeIntegrationGetSubscriptionsResponseDto>(
      this.apiPath
    );
  }

  /**
   * Retrieve subscription upgrade details
   * - {@link http://localhost:9000/openapi#/Stripe%20Integration/StripeIntegrationController_GetSubscriptionUpgradeCost}.
   */
  public async getSubscriptionUpgradeDetails(requestId: string) {
    return this.axios.get<IGetSubscriptionUpgradeDetailsResponseDto>(
      `/advisor-subscription-upgrade-details`,
      { requestId } as AxiosRequestConfig
    );
  }

  /**
   * Upgrade subscription from connect to transact
   * - {@link http://localhost:9000/openapi#/Stripe%20Integration/StripeIntegrationController_UpdateSubscription}.
   */
  public async upgradeSubscription() {
    return this.axios.patch(`/advisor-subscription-upgrade`);
  }
}
export default StripeIntegrationAdvisorSubscriptionsApi;
