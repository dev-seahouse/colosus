import { useQuery } from '@tanstack/react-query';
import { BambuApiLibraryIntegrationRetirementApi } from '@bambu/api-client';
import type { CalculateRetirementGoalAmountRequestDto } from '@bambu/api-client';

export const calculateRetirementGoalAmountQuery = (
  args: CalculateRetirementGoalAmountRequestDto,
  enabled: boolean
) => ({
  queryKey: ['calculateRetirementGoalAmount', args],
  queryFn: async () => {
    const bambuApiLibraryIntegrationRetirementApi =
      new BambuApiLibraryIntegrationRetirementApi();
    const res =
      await bambuApiLibraryIntegrationRetirementApi.calculateRetirementGoalAmount(
        args
      );
    return res.data;
  },
  enabled,
});

export interface UseCalculateRetirementGoalAmountOptions {
  enabled?: boolean;
  args: CalculateRetirementGoalAmountRequestDto;
}

/**
 * query hook to calculate retirement goal amount
 */
export function useCalculateRetirementGoalAmount({
  args,
  enabled = true,
}: UseCalculateRetirementGoalAmountOptions) {
  return useQuery({
    ...calculateRetirementGoalAmountQuery(args, enabled),
  });
}
export default useCalculateRetirementGoalAmount;
