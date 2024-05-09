import { useMutation } from '@tanstack/react-query';
import { TenantBrandingApi } from '@bambu/api-client';

export const deleteLogoQuery = () => ({
  mutationKey: ['deleteLogo'],
  mutationFn: async () => {
    const tenantBrandingApi = new TenantBrandingApi();
    const res = await tenantBrandingApi.deleteLogo();

    return res.data;
  },
});

export interface UseDeleteLogoOptions {
  onSuccess?: () => void;
}

/**
 * query hook to delete tenant logo
 */
export function useDeleteLogo({ onSuccess }: UseDeleteLogoOptions = {}) {
  return useMutation(
    deleteLogoQuery().mutationKey,
    deleteLogoQuery().mutationFn,
    { onSuccess }
  );
}

export default useDeleteLogo;
