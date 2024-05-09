import type { QueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ConnectAdvisorGetGoalTypesResponseDto } from '@bambu/api-client';
import { ConnectAdvisorGoalTypesApi } from '@bambu/api-client';

async function fetchGoalsConfiguration() {
  const connectAdvisorGoalTypesApi = new ConnectAdvisorGoalTypesApi();
  const res = await connectAdvisorGoalTypesApi.getGoalTypes();
  return res.data;
}

export const getGoalConfigurationsQuery = () => ({
  queryKey: ['getGoalsConfiguration'],
  queryFn: fetchGoalsConfiguration,
  staleTime: 10 * 60 * 1000,
  gcTime: 15 * 60 * 1000,
  select: (data: ConnectAdvisorGetGoalTypesResponseDto) =>
    moveItemToEnd(data.goalTypes, 'Other'),
});

function moveItemToEnd<T extends { name: string }>(
  arr: readonly T[],
  itemName: string
) {
  const newArray = [...arr];
  const index = newArray.findIndex((item) => item.name === itemName);

  if (index !== -1) {
    const item = newArray[index];
    newArray.splice(index, 1);
    newArray.push(item);
  }

  return newArray;
}

export function useGetGoalsConfiguration(
  options?: Omit<
    UseQueryOptions<
      ConnectAdvisorGetGoalTypesResponseDto,
      unknown,
      ConnectAdvisorGetGoalTypesResponseDto['goalTypes'],
      string[]
    >,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    ...getGoalConfigurationsQuery(),
    ...options,
  });
}

export function getGoalsConfigurationLoader(queryClient: QueryClient) {
  return async () => {
    const query = getGoalConfigurationsQuery();
    const data = queryClient.getQueryData(query.queryKey);
    if (data) return data;
    return queryClient.fetchQuery(query);
  };
}

export default useGetGoalsConfiguration;
