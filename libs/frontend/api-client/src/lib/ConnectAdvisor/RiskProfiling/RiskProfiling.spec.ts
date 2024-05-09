import ConnectAdvisorRiskProfilingApi from './RiskProfiling';

describe('Risk Profiling', () => {
  const connectAdvisorRiskProfilingApi = new ConnectAdvisorRiskProfilingApi();

  describe('getRiskProfiles()', () => {
    it('should return a valid response', async () => {
      const res = await connectAdvisorRiskProfilingApi.getRiskProfiles();

      expect(res.data).toMatchSnapshot();
    });
  });

  describe('getRiskQuestionnaire()', () => {
    it('should return a valid response', async () => {
      const res = await connectAdvisorRiskProfilingApi.getRiskQuestionnaire();

      expect(res.data).toMatchSnapshot();
    });
  });
});
