import StripeIntegrationPricesApi from './Prices';

describe('StripeIntegrationPricesApi', () => {
  const stripeIntegrationPricesApi = new StripeIntegrationPricesApi();
  describe('getPrices()', () => {
    it('should return a valid response', async () => {
      const res = await stripeIntegrationPricesApi.getPrices();

      expect(res.data).toMatchSnapshot();
    });
  });
});
