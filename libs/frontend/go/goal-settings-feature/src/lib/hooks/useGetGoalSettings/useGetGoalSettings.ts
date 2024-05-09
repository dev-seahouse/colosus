import type { UseQueryOptions, QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { ConnectInvestorGetGoalTypesResponseDto } from '@bambu/api-client';
import { ConnectInvestorGoalTypesApi } from '@bambu/api-client';

export type GetGoalSettingsData = ConnectInvestorGetGoalTypesResponseDto;

// fetch investor goal settings, returns enabled goals
export function useGetGoalSettings<T = GetGoalSettingsData>(
  options?: Omit<
    UseQueryOptions<GetGoalSettingsData, unknown, T, string[]>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    ...getGoalSettingsQuery(),
    ...options,
  });
}

export const getGoalSettingsLoader =
  (queryClient: QueryClient) => async (): Promise<GetGoalSettingsData> => {
    const query = getGoalSettingsQuery();

    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export function getGoalSettingsQuery() {
  return {
    queryKey: ['getGoalSettings'],
    queryFn: fetchGoalSettings,
  };
}

async function fetchGoalSettings() {
  const connectInvestorGoalTypesApi = new ConnectInvestorGoalTypesApi();
  const res = await connectInvestorGoalTypesApi.getInvestorGoalTypes();
  return res.data;
}

export default useGetGoalSettings;
