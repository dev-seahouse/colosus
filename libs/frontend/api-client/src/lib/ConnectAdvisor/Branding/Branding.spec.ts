import ConnectAdvisorBrandingApi from './Branding';

describe('Branding', () => {
  const connectAdvisorBrandingApi = new ConnectAdvisorBrandingApi();

  describe('getTenantBranding()', () => {
    it('should return a valid response', async () => {
      const res = await connectAdvisorBrandingApi.getTenantBranding();

      expect(res.data).toMatchSnapshot();
    });
  });
});
