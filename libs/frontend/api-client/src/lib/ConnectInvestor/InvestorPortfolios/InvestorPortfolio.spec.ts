import { describe } from 'vitest';
import { ConnectInvestorPortfolioDetailsApi } from './InvestorPortfolio';

describe('InvestorPortfolio', () => {
  const connectInvestorPortfolioApi = new ConnectInvestorPortfolioDetailsApi();

  describe('getModelPortfoliosSummary', () => {
    it('should return correct response', async () => {
      const res = await connectInvestorPortfolioApi.getInvestorPortfolio({
        id: 'id',
      });
      expect(res.data).toMatchSnapshot();
    });
  });
});
