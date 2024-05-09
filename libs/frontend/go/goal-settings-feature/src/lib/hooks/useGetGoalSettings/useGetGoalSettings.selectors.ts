import { useCallback } from 'react';
import { useGetGoalSettings } from './useGetGoalSettings';
import type { GetGoalSettingsData } from './useGetGoalSettings';

/**
 * query hook to get goal types
 */
export const useSelectGoalTypesQuery = () => {
  return useGetGoalSettings<GetGoalSettingsData['goalTypes']>({
    select: useCallback(
      (data: GetGoalSettingsData) => data.goalTypes ?? [],
      []
    ),
  });
};
