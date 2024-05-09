import type { BrandingFormState } from './BrandingForm';
import type { GetTenantBrandingData } from '@bambu/go-advisor-core';
import type { ImageFile } from '@bambu/react-ui';

export const getBrandingDefaultValues = (
  branding?: GetTenantBrandingData
): BrandingFormState => {
  if (!branding) {
    return {
      logo: null,
      brandColor: '#00876A',
      headerBgColor: '#fff',
      tradeName: '',
    };
  }

  return {
    tradeName: branding.tradeName,
    headerBgColor: branding.headerBgColor,
    brandColor: branding.brandColor,
    logo: !branding.logoUrl ? null : ({ url: branding.logoUrl } as ImageFile),
  };
};

export const hasLogoChanged = (
  oldLogo: BrandingFormState['logo'],
  newLogo: BrandingFormState['logo']
) => {
  // if old and new logo are not null, compare its url
  if (oldLogo !== null && newLogo !== null) {
    return oldLogo.url !== newLogo.url;
  }

  // else check if one of them is null
  return oldLogo !== newLogo;
};

export const isNewLogo = (
  oldLogo: BrandingFormState['logo'],
  newLogo: BrandingFormState['logo']
) => {
  if (!oldLogo && newLogo) {
    return true;
  } else if (oldLogo && !newLogo) {
    return false;
  }

  return oldLogo?.url !== newLogo?.url;
};
