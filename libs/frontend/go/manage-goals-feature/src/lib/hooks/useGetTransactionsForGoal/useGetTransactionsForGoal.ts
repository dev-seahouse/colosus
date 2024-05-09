import type { InvestorBrokerageIntegrationTransactionsListAllResponseDto } from '@bambu/api-client';
import {
  type InvestorGetGoalTransactionsApiRequestDto,
  TransactInvestorAuthenticatedGoalsApi,
} from '@bambu/api-client';
import type { QueryArgs } from '@bambu/go-core';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

const GET_TRANSACTIONS_FOR_GOAL_KEY = 'getTransactionsForGoal';

export function useGetTransactionsForGoal(
  args: InvestorGetGoalTransactionsApiRequestDto,
  queryOptions?: QueryArgs<InvestorBrokerageIntegrationTransactionsListAllResponseDto>
) {
  return useQuery({
    queryKey: [GET_TRANSACTIONS_FOR_GOAL_KEY, args],
    queryFn: () => fetchTransactionsForGoals(args),
    ...queryOptions,
  });
}

export function useInfiniteGetTransactionsForGoal(
  args: InvestorGetGoalTransactionsApiRequestDto
) {
  return useInfiniteQuery({
    queryKey: [GET_TRANSACTIONS_FOR_GOAL_KEY, args.goalId],
    queryFn: ({ pageParam }) =>
      fetchTransactionsForGoals({ ...args, after: pageParam }),
    getNextPageParam: (lastPage) => lastPage.paginationToken,
    refetchOnMount: false,
  });
}

async function fetchTransactionsForGoals(
  args: InvestorGetGoalTransactionsApiRequestDto
) {
  const api = new TransactInvestorAuthenticatedGoalsApi();
  const res = await api.getTransactionsForGoal(args);
  return res.data;
}

export default useGetTransactionsForGoal;
