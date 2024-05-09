import TransactAdvisorModelPortfolioApi from './ModelPortfolio';

describe('ModelPortfolio', () => {
  const modalPortfolioApi = new TransactAdvisorModelPortfolioApi();

  describe('getModelPortfolioById', () => {
    it('should return a valid response', async () => {
      const res = await modalPortfolioApi.getModelPortfolioById('1');
      expect(res.status).toEqual(200);
      expect(res.data).toBeDefined();
    });
  });
});
