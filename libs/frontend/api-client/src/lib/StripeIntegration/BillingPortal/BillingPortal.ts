import type { Stripe } from 'stripe';
import StripeIntegrationBasePrivateApi from '../_Base/Base';

export type StripeIntegrationCreateBillingPortalSessionResponseDto =
  Stripe.BillingPortal.Session;

export class StripeIntegrationBillingPortalApi extends StripeIntegrationBasePrivateApi {
  constructor(private readonly apiPath = '/billing-portal') {
    super();
  }

  /**
   * Create a portal session.
   * - {@link http://localhost:9000/openapi#/Stripe%20Integration/StripeIntegrationController_GeneratePortalSession}.
   */
  public async createBillingPortalSession() {
    return this.axios.post<StripeIntegrationCreateBillingPortalSessionResponseDto>(
      `${this.apiPath}/sessions`
    );
  }
}
export default StripeIntegrationBillingPortalApi;
