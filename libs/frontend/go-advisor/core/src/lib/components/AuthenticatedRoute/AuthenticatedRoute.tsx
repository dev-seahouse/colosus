import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import useProfileDetails from '../../hooks/useProfileDetails/useProfileDetails';
import { useGetTenantBranding } from '../../hooks/useGetTenantBranding/useGetTenantBranding';
import { useSelectIsUserLoggedIn } from '../../store/useCoreStore.selectors';
import useGetUploadedDocuments from '../../hooks/useGetUploadedDocuments/useGetUploadedDocuments';
import type { GetProfileDetailsData } from '../../hooks/useProfileDetails/useProfileDetails';
import type { GetTenantBrandingData } from '../../hooks/useGetTenantBranding/useGetTenantBranding';
import type { GetUploadedDocumentsData } from '../../hooks/useGetUploadedDocuments/useGetUploadedDocuments';

interface AuthenticatedRouteInitialData {
  profileDetails: GetProfileDetailsData;
  branding: GetTenantBrandingData;
  uploadedDocuments: GetUploadedDocumentsData;
}

export interface AuthenticatedRouteProps {
  initialData?: AuthenticatedRouteInitialData;
}

export function AuthenticatedRoute({ initialData }: AuthenticatedRouteProps) {
  const isUserLoggedIn = useSelectIsUserLoggedIn();
  const navigate = useNavigate();
  const handleNavigateToLogin = useCallback(
    () => navigate('/', { replace: true }),
    [navigate]
  );
  const { isInitialLoading: isLoadingProfileDetails } = useProfileDetails({
    initialData: initialData?.profileDetails,
  });
  const { isInitialLoading: isLoadingTenantBranding } = useGetTenantBranding({
    initialData: initialData?.branding,
  });
  const { isInitialLoading: isLoadingUploadedDocuments } =
    useGetUploadedDocuments({
      ...(initialData?.uploadedDocuments && {
        initialData: initialData.uploadedDocuments,
      }),
    });

  useEffect(() => {
    if (!isUserLoggedIn) {
      handleNavigateToLogin();
    }
  }, [isUserLoggedIn, handleNavigateToLogin]);

  return isLoadingProfileDetails ||
    isLoadingTenantBranding ||
    isLoadingUploadedDocuments ? null : (
    <Outlet />
  );
}

export default AuthenticatedRoute;
