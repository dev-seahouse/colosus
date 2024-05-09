import ConnectInvestorLeadsApi from './Leads';

describe('ConnectInvestorLeadsApi', () => {
  const connectInvestorLeadsApi = new ConnectInvestorLeadsApi();

  describe('saveLead', () => {
    it('should return correct response', async () => {
      const res = await connectInvestorLeadsApi.saveLead({
        name: 'string',
        email: 'string',
        phoneNumber: 'string',
        zipCode: 'string',
        age: 0,
        incomePerAnnum: 0,
        currentSavings: 0,
        isRetired: true,
        goalDescription: 'Retire comfortably',
        goalName: 'Retirement',
        goalValue: 0,
        goalTimeframe: 0,
        riskAppetite: 'd287ada9-5025-41f3-a6de-4ce529afee6b',
        notes: 'foo bar',
      });
      expect(res.status).toEqual(200);
    });
  });
});
