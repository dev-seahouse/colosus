import StripeIntegrationAdvisorSubscriptionsApi from './AdvisorSubscriptions';

describe('StripeIntegrationAdvisorSubscriptionsApi', () => {
  const stripeIntegrationAdvisorSubscriptionsApi =
    new StripeIntegrationAdvisorSubscriptionsApi();

  describe('createCheckoutSession()', () => {
    it('should return a valid response', async () => {
      const res =
        await stripeIntegrationAdvisorSubscriptionsApi.createCheckoutSession({
          priceId: 'price_1J9Z1pJZ7ZQZQZQZQZQZQZQZ',
        });

      expect(res.data).toMatchSnapshot();
    });
  });

  describe('getSubscriptions()', () => {
    it('should return a valid response', async () => {
      const res =
        await stripeIntegrationAdvisorSubscriptionsApi.getSubscriptions();

      expect(res.data).toMatchSnapshot();
    });
  });
});
