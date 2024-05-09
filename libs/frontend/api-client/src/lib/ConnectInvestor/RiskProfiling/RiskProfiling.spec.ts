import ConnectInvesorRiskProfilingApi from './RiskProfiling';
import { r as computeRiskProfileScoreReuqest } from './mocks/computeRiskProfileScoreRequest';

describe('RiskProfiling', () => {
  const connectInvesorRiskProfilingApi = new ConnectInvesorRiskProfilingApi();

  describe('getRiskProfileQuesetionnaire', () => {
    it('should return correct response', async () => {
      const res =
        await connectInvesorRiskProfilingApi.getInvestorRiskQuestionnaire();
      expect(res.data).toMatchSnapshot();
    });
  });

  describe('computeRiskProfileScore', () => {
    it('should return correct response', async () => {
      const res = await connectInvesorRiskProfilingApi.computeRiskProfileScore(
        computeRiskProfileScoreReuqest
      );
      expect(res.data).toMatchSnapshot();
    });
  });

  describe('getInvestorRiskProfiles', () => {
    it('should return correct response', async () => {
      const res =
        await connectInvesorRiskProfilingApi.getInvestorRiskProfiles();
      expect(res.data).toMatchSnapshot();
    });
  });
});
