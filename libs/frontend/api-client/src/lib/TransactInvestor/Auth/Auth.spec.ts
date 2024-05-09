import TransactInvestorAuthApi from './Auth';

describe('TransactInvestorAuthApi', () => {
  const transactInvestorAuthApi = new TransactInvestorAuthApi();

  describe('login', () => {
    it('should return a valid response', async () => {
      const res = await transactInvestorAuthApi.login({
        username: 'matius@bambu.co',
        password: 'Bambu@123',
      });

      expect(res.data).toMatchSnapshot();
    });
  });

  describe('createAccount', () => {
    it('should return a valid response', async () => {
      const res = await transactInvestorAuthApi.createAccount({
        email: 'matius@bambu.co',
        password: 'Bambu@123',
      });

      expect(res.data).toMatchSnapshot();
    });
  });

  describe('verifyInvestorAccount', () => {
    it('should verify account with email otp', async () => {
      const res = await transactInvestorAuthApi.verifyAccount({
        username: 'matius@bambu.co',
        otp: '123456',
      });

      expect(res.status).toEqual(205);
    });
  });
});
