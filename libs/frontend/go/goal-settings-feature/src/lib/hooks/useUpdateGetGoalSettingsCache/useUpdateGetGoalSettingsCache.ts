import { useQueryClient } from '@tanstack/react-query';
import { getGoalSettingsQuery } from '../useGetGoalSettings/useGetGoalSettings';
import type { ConnectInvestorGetGoalTypesResponseDto } from '@bambu/api-client';

export function useUpdateGetGoalSettingsCache() {
  const queryClient = useQueryClient();
  const query = getGoalSettingsQuery();
  return (overrideData: ConnectInvestorGetGoalTypesResponseDto) => {
    queryClient.setQueryData(query.queryKey, (oldData) =>
      oldData ? { ...oldData, ...overrideData } : overrideData
    );
  };
}

export default useUpdateGetGoalSettingsCache;
