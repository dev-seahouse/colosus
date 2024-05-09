import type {
  InvestorBrokerageApiResponseDto,
  StandardError,
} from '@bambu/api-client';
import { useQuery } from '@tanstack/react-query';
import { TransactInvestorAuthenticatedBrokerageApi } from '@bambu/api-client';
import type { QueryArgs } from '../../types/utils';
import type { QueryClient } from '@tanstack/react-query';

export const getBrokerageProfileForInvestorQuery = {
  queryKey: ['getBrokerageProfileForInvestor'],
  queryFn: fetchBrokerageProfileForInvestor,
  retry: (count: number, error: StandardError) => {
    if (
      error?.response?.data?.message?.includes('No accounts found for user')
    ) {
      return false;
    }

    if (error?.response?.status === 502) {
      return false;
    }

    return count < 3;
  },
};

export function useGetBrokerageProfileForInvestor<
  T = InvestorBrokerageApiResponseDto
>(queryOptions?: QueryArgs<InvestorBrokerageApiResponseDto, T>) {
  return useQuery({
    ...getBrokerageProfileForInvestorQuery,
    ...queryOptions,
  });
}

export const getBrokerageProfileForInvestorLoader =
  (queryClient: QueryClient) => async () => {
    return (
      queryClient.getQueryData(getBrokerageProfileForInvestorQuery.queryKey) ??
      (await queryClient.fetchQuery(getBrokerageProfileForInvestorQuery))
    );
  };

async function fetchBrokerageProfileForInvestor() {
  const investorBrokerageApi = new TransactInvestorAuthenticatedBrokerageApi();
  const res = await investorBrokerageApi.getBrokerageProfileForInvestor();
  return res.data;
}
