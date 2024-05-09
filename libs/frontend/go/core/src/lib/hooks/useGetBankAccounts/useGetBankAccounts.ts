import type {
  InvestorBrokerageGetBankAccountsForPartyResponseDto,
  StandardError,
} from '@bambu/api-client';
import {
  hasNoAccountFoundError,
  TransactInvestorAuthenticatedBrokerageApi,
} from '@bambu/api-client';
import type { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { QueryArgs } from '../../types/utils';

export const getBankAccountsQuery = {
  queryKey: ['getBankAccounts'],
  queryFn: fetchBankAccounts,
  retry: (count: number, error: StandardError) => {
    if (hasNoAccountFoundError(error)) return false;
    return count <= 5;
  },
  retryDelay: 2000,
  refecthOnWindowFocus: false,
};
export function useGetBankAccounts<
  T = InvestorBrokerageGetBankAccountsForPartyResponseDto
>(
  queryOptions?: QueryArgs<
    InvestorBrokerageGetBankAccountsForPartyResponseDto,
    T
  >
) {
  return useQuery({
    ...getBankAccountsQuery,
    ...queryOptions,
  });
}
export const getBankAccountsLoader = (queryClient: QueryClient) => {
  return async () => {
    const query = getBankAccountsQuery;
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };
};

async function fetchBankAccounts() {
  const bankAccountsApi = new TransactInvestorAuthenticatedBrokerageApi();
  const res = await bankAccountsApi.getBankAccounts();
  return res.data;
}
export default useGetBankAccounts;
