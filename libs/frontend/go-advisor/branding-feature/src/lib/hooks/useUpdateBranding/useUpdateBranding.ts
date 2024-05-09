import { useMutation } from '@tanstack/react-query';
import { TenantBrandingApi } from '@bambu/api-client';
import type { TenantUpdateTenantBrandingRequestDto } from '@bambu/api-client';

export const updateBrandingQuery = () => ({
  mutationKey: ['updateBranding'],
  mutationFn: async (req: TenantUpdateTenantBrandingRequestDto) => {
    const tenantBrandingApi = new TenantBrandingApi();
    const res = await tenantBrandingApi.updateTenantBranding(req);

    return res.data;
  },
});

export interface UseupdateBrandingOptions {
  onSuccess?: () => void;
}

/**
 * query hook to update tenant branding
 */
export function useUpdateBranding({
  onSuccess,
}: UseupdateBrandingOptions = {}) {
  return useMutation(
    updateBrandingQuery().mutationKey,
    updateBrandingQuery().mutationFn,
    { onSuccess }
  );
}

export default useUpdateBranding;
