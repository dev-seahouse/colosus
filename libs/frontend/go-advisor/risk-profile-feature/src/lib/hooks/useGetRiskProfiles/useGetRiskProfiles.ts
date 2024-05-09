import { useQuery } from '@tanstack/react-query';
import { ConnectAdvisorRiskProfilingApi } from '@bambu/api-client';
import type { ConnectAdvisorGetRiskProfilesResponseDto } from '@bambu/api-client';
import type { QueryClient } from '@tanstack/react-query';

export type GetRiskProfilesData = ConnectAdvisorGetRiskProfilesResponseDto;

export const getRiskProfilesQuery = () => ({
  queryKey: ['getRiskProfiles'],
  queryFn: async () => {
    const connectAdvisorRiskProfilingApi = new ConnectAdvisorRiskProfilingApi();
    const res = await connectAdvisorRiskProfilingApi.getRiskProfiles();

    return res.data;
  },
});

export const getRiskProfilesLoader =
  (queryClient: QueryClient) => async (): Promise<GetRiskProfilesData> => {
    const query = getRiskProfilesQuery();

    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export interface UseGetRiskProfilesOptions {
  initialData?: Partial<GetRiskProfilesData>;
}

export function useGetRiskProfiles({
  initialData,
}: UseGetRiskProfilesOptions = {}) {
  return useQuery({
    ...getRiskProfilesQuery(),
    initialData,
  });
}

export default useGetRiskProfiles;
