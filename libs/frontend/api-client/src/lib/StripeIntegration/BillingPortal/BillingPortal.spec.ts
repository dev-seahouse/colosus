import StripeIntegrationBillingPortalApi from './BillingPortal';

describe('StripeIntegrationBillingPortalApi', () => {
  const stripeIntegrationBillingPortalApi =
    new StripeIntegrationBillingPortalApi();

  describe('createBillingPortalSession()', () => {
    it('should return a valid response', async () => {
      const res =
        await stripeIntegrationBillingPortalApi.createBillingPortalSession();

      expect(res.data).toMatchSnapshot();
    });
  });
});
