import ConnectAdvisorBrandAndSubdomainApi from './BrandAndSubdomain';
import { describe } from 'vitest';

describe('BrandAndSubdomain', () => {
  const connectAdvisorBrandAndSubdomainApi =
    new ConnectAdvisorBrandAndSubdomainApi();

  describe('getSubdomain', () => {
    it('should return the correct response', async () => {
      const res = await connectAdvisorBrandAndSubdomainApi.getSubdomain();

      expect(res.data).toMatchSnapshot();
    });
  });

  describe('updateTradeNameAndSubdomain', () => {
    it('should return 204 status response', async () => {
      const res =
        await connectAdvisorBrandAndSubdomainApi.updateBrandAndSubdomain({
          subdomain: 'foo',
          tradeName: 'bar',
        });

      expect(res.status).toBe(204);
    });
  });
});
