import TenantBrandingApi from './Branding';

describe('TenantBrandingApi', () => {
  const tenantBrandingApi = new TenantBrandingApi();

  describe('getProfile()', () => {
    it('should return a 204 response', async () => {
      const res = await tenantBrandingApi.updateTenantBranding({
        headerBgColor: '#000000',
        brandColor: '#000000',
        tradeName: 'Bambu',
      });

      expect(res.status).toEqual(204);
    });
  });

  describe('uploadLogo()', () => {
    it('should return a valid response', async () => {
      const res = await tenantBrandingApi.uploadLogo(new FormData());

      expect(res.status).toEqual(204);
    });
  });

  describe('deleteLogo()', () => {
    it('should return a valid response', async () => {
      const res = await tenantBrandingApi.deleteLogo();

      expect(res.status).toEqual(204);
    });
  });

  describe('getTenantBranding', () => {
    it('should return a valid response', async () => {
      const res = await tenantBrandingApi.getTenantBranding();

      expect(res.status).toEqual(201);
      expect(res.data).toEqual({
        logoUrl: null,
        brandColor: '#00876A',
        headerBgColor: '#fff',
        tradeName: 'Wealth Avenue',
      });
    });
  });
});
