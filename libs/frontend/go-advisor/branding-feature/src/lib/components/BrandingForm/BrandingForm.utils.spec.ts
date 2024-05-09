import {
  getBrandingDefaultValues,
  hasLogoChanged,
  isNewLogo,
} from './BrandingForm.utils';

describe('BrandingForm.utils', () => {
  describe('getBrandingDefaultValues', () => {
    it('should return branding default values', () => {
      expect(
        getBrandingDefaultValues({
          logoUrl: null,
          brandColor: '#000000',
          headerBgColor: '#000000',
          tradeName: 'Wealth Avenue',
        })
      ).toMatchSnapshot();
    });
  });

  describe('hasLogoChanged', () => {
    it('should return true if oldLogo is null', () => {
      expect(hasLogoChanged(null, { url: 'https://www.google.com' })).toEqual(
        true
      );
    });

    it('should return true if newLogo is null', () => {
      expect(hasLogoChanged({ url: 'https://www.google.com' }, null)).toEqual(
        true
      );
    });

    it('should return false if both logos are null', () => {
      expect(hasLogoChanged(null, null)).toEqual(false);
    });

    it('should return true if logo urls do not match', () => {
      expect(
        hasLogoChanged(
          { url: 'https://www.google.com' },
          { url: 'https://www.bing.com' }
        )
      ).toEqual(true);
    });

    it('should return false if logo urls match', () => {
      expect(
        hasLogoChanged(
          { url: 'https://www.google.com' },
          { url: 'https://www.google.com' }
        )
      ).toEqual(false);
    });
  });

  describe('isNewLogo', () => {
    it('should return true if oldLogo is null and newLogo has value', () => {
      expect(isNewLogo(null, { url: 'https://www.google.com' })).toEqual(true);
    });

    it('should return true if oldLogo url and newLogo url do not match', () => {
      expect(
        isNewLogo(
          { url: 'https://www.google.com' },
          { url: 'https://www.bing.com' }
        )
      ).toEqual(true);
    });

    it('should return false if oldLogo url exists and newLogo url does not exist', () => {
      expect(isNewLogo({ url: 'https://www.google.com' }, null)).toEqual(false);
    });
  });
});
