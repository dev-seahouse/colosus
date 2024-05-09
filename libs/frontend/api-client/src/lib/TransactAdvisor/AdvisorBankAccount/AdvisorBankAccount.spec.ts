import TransactAdvisorBankAccountApi from './AdvisorBankAccount';

describe('TransactAdvisorBankAccountApi', () => {
  const transactAdvisorBankAccountApi = new TransactAdvisorBankAccountApi();

  test('saveAdvisorBankAccount', () => {
    it('should return a valid response', async () => {
      const res = await transactAdvisorBankAccountApi.saveAdvisorBankAccount({
        accountName: 'Wealth Avenue LLC',
        accountNumber: '12345678',
        sortCode: '123456',
        annualManagementFee: '5',
      });
      expect(res.status).toEqual(201);
    });
  });

  test('updateAdvisorBankAccount', () => {
    it('should return a valid response', async () => {
      const res = await transactAdvisorBankAccountApi.updateAdvisorBankAccount({
        accountName: 'Wealth Avenue LLC',
        accountNumber: '12345678',
        sortCode: '123456',
        annualManagementFee: '6',
      });
      expect(res.status).toEqual(201);
    });
  });

  test('getAdvisorBankAccount', () => {
    it('should return a valid response', async () => {
      const res = await transactAdvisorBankAccountApi.getAdvisorBankAccount();
      expect(res.status).toEqual(200);
      expect(res.data).toBeDefined();
    });
  });
});
