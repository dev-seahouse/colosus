import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ConnectAdvisorGoalTypesApi } from '@bambu/api-client';
import type { ConnectAdvisorSetGoalTypesRequestDto } from '@bambu/api-client';
import { getGoalConfigurationsQuery } from '../useGetGoalsConfiguration/useGetGoalsConfiguration';

export function useSetGoalsConfiguration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setGoalsConfiguration,
    // the onSuccess callbacks on useMutation fire before the callbacks on mutate
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: getGoalConfigurationsQuery().queryKey,
      });
    },
  });
}

export default useSetGoalsConfiguration;

async function setGoalsConfiguration(
  enabledGoalsIds: ConnectAdvisorSetGoalTypesRequestDto['goalTypeIds']
) {
  const connectAdvisorGoalTypesApi = new ConnectAdvisorGoalTypesApi();
  const res = await connectAdvisorGoalTypesApi.setGoalTypes({
    goalTypeIds: enabledGoalsIds,
  });
  return res.data;
}
