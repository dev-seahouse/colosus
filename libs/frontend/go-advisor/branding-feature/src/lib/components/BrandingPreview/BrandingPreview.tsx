import { useSelectUpdateBrandingQuery } from '@bambu/go-core';
import { IntroductionPage } from '@bambu/go-onboarding-feature';
import { GoAppPreviewCard } from '@bambu/go-advisor-core';
import { useFormContext } from 'react-hook-form';
import { useEffect, useCallback } from 'react';

import type { BrandingFormState } from '../BrandingForm/BrandingForm';

export function BrandingPreview() {
  const { watch } = useFormContext<BrandingFormState>();
  const tradeName = watch('tradeName');
  const headerBgColor = watch('headerBgColor');
  const brandColor = watch('brandColor');
  const logo = watch('logo');
  const updateBranding = useSelectUpdateBrandingQuery();
  const handleUpdateBranding = useCallback(updateBranding, [updateBranding]);

  useEffect(() => {
    handleUpdateBranding({
      tradeName,
      headerBgColor,
      brandColor,
      logoUrl: logo?.url ?? null,
    });
  }, [tradeName, headerBgColor, brandColor, logo, handleUpdateBranding]);

  return (
    <GoAppPreviewCard>
      <IntroductionPage isPreview />
    </GoAppPreviewCard>
  );
}

export default BrandingPreview;
