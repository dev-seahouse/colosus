import { describe } from 'vitest';
import { ConnectInvestorGoalTypesApi } from './GoalTypes';

describe('ConnectInvestorGoalTypesApi', () => {
  const connectInvestorGoalTypesApi = new ConnectInvestorGoalTypesApi();

  describe('getInvestorGoalTypes', () => {
    it('should return correct response', async () => {
      const res = await connectInvestorGoalTypesApi.getInvestorGoalTypes();
      expect(res.data).toMatchSnapshot();
    });
  });
});
