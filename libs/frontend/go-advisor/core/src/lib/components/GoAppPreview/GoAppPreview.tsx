import { GoPreviewBackground, SetupBranding } from '@bambu/go-core';
import {
  DEFAULT_MOBILE_PREVIEW_THEME,
  MobilePreview,
  styled,
} from '@bambu/react-ui';
import { useSelectTenantBrandingQuery } from '../../hooks/useGetTenantBranding/useGetTenantBranding.selectors';
import { useSelectInitialAdvisorProfileForInvestorAppQuery } from '../../hooks/useProfileDetails/useProfileDetails.selectors';
import useGetUploadedDocuments from '../../hooks/useGetUploadedDocuments/useGetUploadedDocuments';

import type { ReactNode } from 'react';
export interface GoAppPreviewProps {
  children?: ReactNode;
}

const OverlayWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  justifyContent: 'flex-end',
  position: 'relative',
}));

const Overlay = styled('div')(({ theme }) => ({
  position: 'absolute',
  background: '#000',
  width: '100%',
  height: '100%',
  opacity: 0.5,
  zIndex: 9,
}));

export interface GoAppPreviewOverlayProps {
  children?: ReactNode;
}

export const GoAppPreviewOverlay = ({ children }: GoAppPreviewOverlayProps) => {
  return (
    <OverlayWrapper>
      <Overlay />
      {children}
    </OverlayWrapper>
  );
};

/**
 * wrapper component for the preview of the app
 */
export function GoAppPreview({ children }: GoAppPreviewProps) {
  const { data: branding } = useSelectTenantBrandingQuery();
  const { data: advisorProfile } =
    useSelectInitialAdvisorProfileForInvestorAppQuery();
  const { data: documents } = useGetUploadedDocuments();

  if (!branding || !advisorProfile) {
    return null;
  }

  return (
    <MobilePreview>
      <SetupBranding
        initialData={{
          branding: {
            tradeName: branding.tradeName,
            headerBgColor: branding.headerBgColor,
            brandColor: branding.brandColor,
            logoUrl: branding.logoUrl,
          },
          advisorProfile,
          documents: {
            privacyPolicyUrl: documents?.privacyPolicyUrl ?? null,
            termsAndConditionsUrl: documents?.termsAndConditionsUrl ?? null,
          },
        }}
        theme={DEFAULT_MOBILE_PREVIEW_THEME}
      >
        <GoPreviewBackground>{children}</GoPreviewBackground>
      </SetupBranding>
    </MobilePreview>
  );
}

export default GoAppPreview;
