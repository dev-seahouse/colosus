import { TransactInvestorModelPortfoliosApi } from './ModelPortfolio';

describe('InvestorModelPortfoliosApi', () => {
  test('getModelPortfolioById', async () => {
    const goalApi = new TransactInvestorModelPortfoliosApi();
    const res = await goalApi.getModelPortfolioById('34343');
    expect(res.data).toBeDefined();
  });
});
