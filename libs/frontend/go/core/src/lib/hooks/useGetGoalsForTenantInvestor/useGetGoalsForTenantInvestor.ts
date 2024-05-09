import type {
  InvestorGetGoalsForTenantInvestorRequestDto,
  InvestorGetGoalsForTenantInvestorResponseDto,
} from '@bambu/api-client';
import { TransactInvestorAuthenticatedGoalsApi } from '@bambu/api-client';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { QueryArgs } from '../../types/utils';

export const GET_GOALS_FOR_TENANT_INVESTOR_QUERY_KEY =
  'getGoalsForTenantInvestor';

const DEFAULT_PREFETCH_NUM_GOALS = 50;

export function useGetGoalsForTenantInvestor(
  args: InvestorGetGoalsForTenantInvestorRequestDto,
  queryArgs?: QueryArgs<InvestorGetGoalsForTenantInvestorResponseDto>
) {
  return useQuery({
    queryKey: [
      GET_GOALS_FOR_TENANT_INVESTOR_QUERY_KEY,
      args.pageIndex,
      args.pageSize,
    ],
    queryFn: () => fetchGoalsForTenantInvestor(args),
    ...queryArgs,
  });
}

export const getGoalsForTenantInvestorLoader =
  (queryClient: QueryClient) => async () => {
    return (
      queryClient.getQueryData([GET_GOALS_FOR_TENANT_INVESTOR_QUERY_KEY]) ??
      (await queryClient.fetchQuery({
        queryKey: [GET_GOALS_FOR_TENANT_INVESTOR_QUERY_KEY],
        queryFn: () =>
          fetchGoalsForTenantInvestor({
            pageSize: DEFAULT_PREFETCH_NUM_GOALS,
            pageIndex: 0,
          }),
      }))
    );
  };

async function fetchGoalsForTenantInvestor(
  args: InvestorGetGoalsForTenantInvestorRequestDto
) {
  const api = new TransactInvestorAuthenticatedGoalsApi();
  const res = await api.getGoalsForTenantInvestor(args);
  return res.data;
}

export default useGetGoalsForTenantInvestor;
