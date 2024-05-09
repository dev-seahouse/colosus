import { describe } from 'vitest';
import { ConnectInvestorAdvisorProfileApi } from './AdvisorProfile';

describe('AdvisorProfile', () => {
  const connectInvestorAdvisorProfileApi =
    new ConnectInvestorAdvisorProfileApi();

  describe('connectInvestorAdvisorProfileApi', () => {
    it('should return correct response', async () => {
      const res = await connectInvestorAdvisorProfileApi.getAdvisorProfile();
      expect(res.data).toMatchSnapshot();
    });
  });
});
