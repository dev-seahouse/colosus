import type { InvestorGoalHoldingsResponseDto } from '@bambu/api-client';
import { TransactInvestorAuthenticatedGoalsApi } from '@bambu/api-client';
import { useQuery } from '@tanstack/react-query';
import type { QueryArgs } from '@bambu/go-core';

export const getInvestorGoalHoldings = (goalId: string) => ({
  queryKey: ['getInvestorGoalHoldings', goalId],
  queryFn: () => fetchInvestorGoalHoldings(goalId),
  refetchOnMount: false,
});

export const useGetInvestorGoalHoldings = (
  goalId: string,
  queryOptions?: QueryArgs<InvestorGoalHoldingsResponseDto>
) => {
  return useQuery({
    ...getInvestorGoalHoldings(goalId),
    ...queryOptions,
  });
};

async function fetchInvestorGoalHoldings(goalId: string) {
  const transactInvestorAuthenticatedGoalsApi =
    new TransactInvestorAuthenticatedGoalsApi();
  const res =
    await transactInvestorAuthenticatedGoalsApi.getInvestorGoalHoldings(goalId);
  return res.data;
}
