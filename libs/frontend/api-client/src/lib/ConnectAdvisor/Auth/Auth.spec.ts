import ConnectAdvisorAuthApi from './Auth';

describe('ConnectAdvisorAuthApi', () => {
  const connectAdvisorAuthApi = new ConnectAdvisorAuthApi();

  describe('login', () => {
    it('should return a valid response', async () => {
      const res = await connectAdvisorAuthApi.login({
        username: 'matius@bambu.co',
        password: 'Bambu@123',
      });

      expect(res.data).toMatchSnapshot();
    });
  });

  describe('createAccount', () => {
    it('should return a valid response', async () => {
      const res = await connectAdvisorAuthApi.createAccount({
        username: 'matius@bambu.co',
        password: 'Bambu@123',
      });

      expect(res.data).toMatchSnapshot();
    });
  });

  describe('verifyEmailInitial', () => {
    it('should return a token object from refreshToken API', async () => {
      const res = await connectAdvisorAuthApi.verifyEmailInitial({
        username: 'matius@bambu.co',
        otp: '123456',
      });

      expect(res.status).toEqual(205);
    });
  });

  describe('sendResetPasswordEmail', () => {
    it('should return the correct response code', async () => {
      const res = await connectAdvisorAuthApi.sendResetPasswordEmail({
        email: 'matius@bambu.co',
      });

      expect(res.status).toEqual(204);
    });
  });

  describe('changePassword', () => {
    it('should return the correct response code', async () => {
      const res = await connectAdvisorAuthApi.changePassword({
        username: 'matius@bambu.co',
        otp: '12345',
        newPassword: '@Bambu123',
      });

      expect(res.status).toEqual(204);
    });
  });
});
