import { useMutation } from '@tanstack/react-query';
import { TenantBrandingApi } from '@bambu/api-client';

export const uploadLogoQuery = () => ({
  mutationKey: ['uploadLogo'],
  mutationFn: async (req: FormData) => {
    const tenantBrandingApi = new TenantBrandingApi();
    const res = await tenantBrandingApi.uploadLogo(req);

    return res.data;
  },
});

export interface UseUploadLogoOptions {
  onSuccess?: () => void;
}

/**
 * query hook to upload tenant logo
 */
export function useUploadLogo({ onSuccess }: UseUploadLogoOptions = {}) {
  return useMutation(
    uploadLogoQuery().mutationKey,
    uploadLogoQuery().mutationFn,
    { onSuccess }
  );
}

export default useUploadLogo;
