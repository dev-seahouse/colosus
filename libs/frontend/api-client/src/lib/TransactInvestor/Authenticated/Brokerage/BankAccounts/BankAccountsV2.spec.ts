import { TransactInvestorAuthenticatedBrokerageBankAccountsV2Api } from './BankAccountsV2';

describe('TransactInvestorAuthenticatedBrokerageBankAccountsV2Api', () => {
  const brokerageBankAccountsV2Api =
    new TransactInvestorAuthenticatedBrokerageBankAccountsV2Api();
  test('getBankAccountsPaged', () => {
    it('should return a valid response', async () => {
      const res = await brokerageBankAccountsV2Api.getBankAccountsPaged({
        limit: 10,
      });
      expect(res.data).toBeDefined();
    });
  });
});
