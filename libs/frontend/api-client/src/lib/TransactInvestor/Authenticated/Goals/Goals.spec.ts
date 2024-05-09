import { TransactInvestorAuthenticatedGoalsApi } from './Goals';

describe('TransactAuthenticatedGoalsApi', () => {
  const goalsApi = new TransactInvestorAuthenticatedGoalsApi();
  test('getInvestorGoalDetails', () => {
    it('should return a valid response', async () => {
      const res = await goalsApi.getInvestorGoalDetails({
        goalId: '34343',
      });
      expect(res.data).toBeDefined();
    });
  });

  test('getInvestorGoalTransactions', () => {
    it('should return a valid response', async () => {
      const res = await goalsApi.getTransactionsForGoal({
        goalId: '34343',
        limit: 90,
      });
      expect(res.data).toBeDefined();
    });
  });

  test('getInvestorGoalsForTenantInvestor', () => {
    it('should return a valid response', async () => {
      const res = await goalsApi.getGoalsForTenantInvestor({
        pageSize: 0,
        pageIndex: 1,
      });
      expect(res.data).toBeDefined();
    });
  });
});
