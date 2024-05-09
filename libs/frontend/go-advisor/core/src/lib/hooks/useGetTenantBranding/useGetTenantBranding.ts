import { useQuery } from '@tanstack/react-query';
import { ConnectAdvisorBrandingApi } from '@bambu/api-client';
import type { ConnectAdvisorGetBrandingResponseDto } from '@bambu/api-client';
import type { QueryClient } from '@tanstack/react-query';

export type GetTenantBrandingData =
  Awaited<ConnectAdvisorGetBrandingResponseDto>;

export const getTenantBrandingQuery = () => ({
  queryKey: ['getTenantBranding'],
  queryFn: async () => {
    const connectAdvisorBrandingApi = new ConnectAdvisorBrandingApi();

    const res = await connectAdvisorBrandingApi.getTenantBranding();

    return res.data;
  },
});

export const getTenantBrandingLoader =
  (queryClient: QueryClient) => async (): Promise<GetTenantBrandingData> => {
    const query = getTenantBrandingQuery();

    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export interface UseGetTenantBrandingOptions {
  initialData?: Partial<GetTenantBrandingData>;
}
export function useGetTenantBranding({
  initialData,
}: UseGetTenantBrandingOptions = {}) {
  return useQuery({
    ...getTenantBrandingQuery(),
    initialData,
  });
}

export default useGetTenantBranding;
