import { describe } from 'vitest';
import { ConnectInvestorAdvisorModelPortfoliosApi } from './ModelPortfolios';

describe('AdvisorProfile', () => {
  const connectInvestorAdvisorProfileApi =
    new ConnectInvestorAdvisorModelPortfoliosApi();

  describe('getModelPortfoliosSummary', () => {
    it('should return correct response', async () => {
      const res =
        await connectInvestorAdvisorProfileApi.getModelPortfoliosSummary();
      expect(res.data).toMatchSnapshot();
    });
  });
});
