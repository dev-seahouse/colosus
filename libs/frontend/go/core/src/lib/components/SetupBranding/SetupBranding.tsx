import {
  ThemeProvider,
  CssBaseline,
  NavigatorOnlineProvider,
} from '@bambu/react-ui';
import type { ThemeOptions } from '@bambu/react-ui';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import useGetBranding from '../../hooks/useGetBranding/useGetBranding';
import type { GetBrandingData } from '../../hooks/useGetBranding/useGetBranding';
import useGetAdvisorProfile from '../../hooks/useGetAdvisorProfile/useGetAdvisorProfile';
import type { GetAdvisorProfileData } from '../../hooks/useGetAdvisorProfile/useGetAdvisorProfile';
import useGetDocuments from '../../hooks/useGetDocuments/useGetDocuments';
import type { GetDocumentsData } from '../../hooks/useGetDocuments/useGetDocuments';
import createGoTheme from '../../utils/createGoTheme/createGoTheme';

export interface SetupBrandingProps {
  children?: ReactNode;
  initialData?: {
    branding: GetBrandingData;
    advisorProfile: GetAdvisorProfileData;
    documents: GetDocumentsData;
  };
  /**
   * extend the theme object, e.g for MobilePreview
   */
  theme?: ThemeOptions;
}

/**
 * TODO: rename this to reflect something more common
 */
export function SetupBranding({
  children = <Outlet />,
  initialData,
  theme = {},
}: SetupBrandingProps) {
  const { data, isInitialLoading } = useGetBranding({
    ...(initialData?.branding && { initialData: initialData.branding }),
  });

  const { isInitialLoading: isLoadingAdvisorProfile } = useGetAdvisorProfile({
    ...(initialData?.advisorProfile && {
      initialData: initialData?.advisorProfile,
    }),
  });
  const { isInitialLoading: isLoadingDocuments } = useGetDocuments({
    ...(initialData?.documents && {
      initialData: initialData?.documents,
    }),
  });

  if (isInitialLoading || isLoadingAdvisorProfile || isLoadingDocuments) {
    return null;
  }

  return (
    <ThemeProvider theme={createGoTheme(data, theme)}>
      <NavigatorOnlineProvider>{children}</NavigatorOnlineProvider>
      <CssBaseline />
    </ThemeProvider>
  );
}

export default SetupBranding;
