import {
  InvestorBrokerageIntegrationListAllQueryParamsBaseDto,
  InvestorBrokerageIntegrationPartyBankAccountListAllResponseDto,
  TransactInvestorAuthenticatedBrokerageBankAccountsV2Api,
} from '@bambu/api-client';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { QueryArgs } from '../../types/utils';

const QUERY_KEY = 'getBankAccountsPaged';

const getBankAccountsPagedQuery = (
  args: InvestorBrokerageIntegrationListAllQueryParamsBaseDto
) => ({
  queryKey: [QUERY_KEY, args],
  queryFn: () => fetchBankAccountsPaged(args),
  refetchOnWindowFocus: false,
});

export function useGetBankAccountsPaged(
  args: InvestorBrokerageIntegrationListAllQueryParamsBaseDto,
  queryOptions?: QueryArgs<InvestorBrokerageIntegrationPartyBankAccountListAllResponseDto>
) {
  return useQuery({
    ...getBankAccountsPagedQuery(args),
    ...queryOptions,
  });
}

export const getBankAccountsPagedLoader = (queryClient: QueryClient) => {
  return async (
    args: InvestorBrokerageIntegrationListAllQueryParamsBaseDto = { limit: 1 }
  ) => {
    const query = getBankAccountsPagedQuery(args);
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };
};

async function fetchBankAccountsPaged(
  args: InvestorBrokerageIntegrationListAllQueryParamsBaseDto
) {
  const api = new TransactInvestorAuthenticatedBrokerageBankAccountsV2Api();
  const response = await api.getBankAccountsPaged(args);
  return response.data;
}

export default useGetBankAccountsPaged;
