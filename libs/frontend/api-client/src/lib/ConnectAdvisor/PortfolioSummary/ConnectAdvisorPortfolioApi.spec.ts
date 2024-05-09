import ConnectAdvisorPortfolioSummaryApi from './PortfolioSummary';

describe('ConnectAdvisorPortfolioSummaryApi', () => {
  const connectAdvisorPortfolioSummaryApi =
    new ConnectAdvisorPortfolioSummaryApi();
  describe('getPortfolios()', () => {
    it('should return a valid response', async () => {
      const res = await connectAdvisorPortfolioSummaryApi.getPortfolios();

      expect(res.data).toMatchSnapshot();
    });
  });
});
