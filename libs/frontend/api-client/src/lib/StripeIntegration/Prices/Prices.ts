import type { Stripe } from 'stripe';

import StripeIntegrationBasePrivateApi from '../_Base/Base';

export interface StripeIntegrationGetPricesResponseDto {
  data: Stripe.Price[];
}

export class StripeIntegrationPricesApi extends StripeIntegrationBasePrivateApi {
  constructor(private readonly apiPath = '/prices') {
    super();
  }

  /**
   * Returns a list of your prices.
   * - {@link http://localhost:9000/openapi#/Stripe%20Integration/StripeIntegrationController_ListPrices}.
   */
  public async getPrices() {
    return this.axios.get<StripeIntegrationGetPricesResponseDto>(this.apiPath);
  }
}

export default StripeIntegrationPricesApi;
