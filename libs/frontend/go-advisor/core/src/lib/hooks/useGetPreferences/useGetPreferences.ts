import type { ConnectAdvisorGetPreferencesResponseDto } from '@bambu/api-client';
import { ConnectAdvisorPreferencesApi } from '@bambu/api-client';
import type { QueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

// get leads filter settings
export function getPreferencesQuery() {
  return {
    queryKey: ['getPreferences'],
    queryFn: fetchPreferences,
  };
}
async function fetchPreferences() {
  const connectAdvisorPreferencesApi = new ConnectAdvisorPreferencesApi();
  const res = await connectAdvisorPreferencesApi.getPreferences();
  return res.data;
}
export function useGetPreferences<
  TQueryReturnData = ConnectAdvisorGetPreferencesResponseDto
>(
  options?: Omit<
    UseQueryOptions<
      ConnectAdvisorGetPreferencesResponseDto,
      unknown,
      TQueryReturnData
    >,
    'queryFn'
  >
) {
  return useQuery({
    ...getPreferencesQuery(),
    ...options,
  });
}

export function getPreferencesLoader(queryClient: QueryClient) {
  const query = getPreferencesQuery();
  return async () => {
    return (
      // return data or fetch it
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };
}

export default useGetPreferences;
