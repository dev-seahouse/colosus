import createBambuAxiosInstance from '../../utils/createBambuAxiosInstance/createBambuAxiosInstance';

/**
 * - Base API class for Stripe Integration private API related classes
 * - This class is responsible for creating an axios instance with the extended Stripe Integration URL
 */
export class StripeIntegrationBasePrivateApi {
  constructor(
    protected readonly axios = createBambuAxiosInstance({
      extendedURL: '/api/v1/stripe-integration',
      withRequestInterceptors: true,
    })
  ) {}
}

export default StripeIntegrationBasePrivateApi;
