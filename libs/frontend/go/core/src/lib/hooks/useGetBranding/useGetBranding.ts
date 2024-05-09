import { QueryClient, useQuery } from '@tanstack/react-query';
import { TenantBrandingApi } from '@bambu/api-client';
import type { TenantGetTenantBrandingResponseDto } from '@bambu/api-client';

export type GetBrandingData = TenantGetTenantBrandingResponseDto;

export const getBrandingQuery = () => ({
  queryKey: ['getBranding'],
  queryFn: async () => {
    const tenantBrandingApi = new TenantBrandingApi();
    const res = await tenantBrandingApi.getTenantBranding();

    return res.data;
  },
});

export const getBrandingLoader =
  (queryClient: QueryClient) => async (): Promise<GetBrandingData> => {
    const query = getBrandingQuery();

    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export interface UseGetBrandingOptions {
  initialData?: GetBrandingData;
}

/**
 * hook to get tenant branding data
 */
export const useGetBranding = ({ initialData }: UseGetBrandingOptions = {}) => {
  return useQuery({ ...getBrandingQuery(), initialData, staleTime: Infinity });
};

export default useGetBranding;
