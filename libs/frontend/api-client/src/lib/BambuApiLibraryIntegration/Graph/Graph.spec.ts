import BambuApiLibraryIntegrationGraphApi, {
  GetProjectionsCompoundingEnums,
} from './Graph';

describe('GraphApi', () => {
  const bambuApiLibraryIntegrationGraphApi =
    new BambuApiLibraryIntegrationGraphApi();

  describe('getProjections', () => {
    it('should return a valid response', async () => {
      const res = await bambuApiLibraryIntegrationGraphApi.getProjections({
        availablePortfolios: [
          {
            modelPortfolioId: '4',
            discreteExpectedMean: 0.03,
            discreteExpectedStandardDeviation: 0.05,
          },
          {
            modelPortfolioId: '11',
            discreteExpectedMean: 0.05,
            discreteExpectedStandardDeviation: 0.06,
          },
          {
            modelPortfolioId: '12',
            discreteExpectedMean: 0.06,
            discreteExpectedStandardDeviation: 0.07,
          },
          {
            modelPortfolioId: '13',
            discreteExpectedMean: 0.08,
            discreteExpectedStandardDeviation: 0.1,
          },
          {
            modelPortfolioId: '14',
            discreteExpectedMean: 0.12,
            discreteExpectedStandardDeviation: 0.16,
          },
        ],
        inputs: {
          startDate: '2010-01-02',
          endDate: '2020-01-01',
          compounding: GetProjectionsCompoundingEnums.MONTHLY,
          confidenceInterval: 0.67,
          grossInitialInvestment: 8,
          currentWealth: 11190,
          frontEndFees: 0.01,
          backEndFees: 0.01,
          managementFees: [0],
          grossGoalAmount: 110000,
          modelPortfolioIdList: [13],
          infusions: [10],
          targetProbability: 0.5,
        },
        recommendationSelection: {
          shortfallRecommendation: {
            initialInvestment: true,
            constantInfusion: true,
            dynamicIncreasingInfusion: true,
            dynamicDecreasingInfusion: true,
            goalAmount: true,
            goalYear: true,
          },
          surplusRecommendation: {
            glidePath: {
              glidePath: true,
              portfolioDerisking: false,
              deriskStartDate: '2015-01-02',
              deriskEndDate: '2019-01-03',
            },
          },
        },
      });

      expect(res.data).toMatchSnapshot();
    });
  });
});
