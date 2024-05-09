import TransactInvestorAuthenticatedProfileApi from './Profile';

describe('TransactAuthenticatedProfileApi', () => {
  const transactAuthenticatedProfileApi =
    new TransactInvestorAuthenticatedProfileApi();
  test('getInvestorPlatformUserProfile', () => {
    it('should return a valid response', async () => {
      const res =
        await transactAuthenticatedProfileApi.getInvestorPlatformUserProfile();
      expect(res.data).toBeDefined();
    });
  });
});
