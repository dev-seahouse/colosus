import type {
  InvestorBrokerageGetDirectDebitMandatesResponseDto,
  StandardError,
} from '@bambu/api-client';
import {
  hasNoAccountFoundError,
  TransactInvestorAuthenticatedBrokerageApi,
} from '@bambu/api-client';
import type { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { QueryArgs } from '../../types/utils';

export const getDirectDebitMandatesQuery = {
  queryKey: ['getDirectDebitMandates'],
  queryFn: fetchDirectDebitMandates,
  retry: (count: number, error: StandardError) => {
    if (hasNoAccountFoundError(error)) return false;
    return count <= 3;
  },
  refecthOnWindowFocus: false,
};

export function useGetDirectDebitMandates<
  T = InvestorBrokerageGetDirectDebitMandatesResponseDto
>(
  queryOptions?: QueryArgs<
    InvestorBrokerageGetDirectDebitMandatesResponseDto,
    T
  >
) {
  return useQuery({
    ...getDirectDebitMandatesQuery,
    ...queryOptions,
  });
}

export const getDirectDebitMandatesLoader = (queryClient: QueryClient) => {
  return async () => {
    const query = getDirectDebitMandatesQuery;
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };
};

export async function fetchDirectDebitMandates() {
  const investorBrokerageApi = new TransactInvestorAuthenticatedBrokerageApi();
  const res = await investorBrokerageApi.getDirectDebitMandatesByParty();
  return res.data;
}

export default useGetDirectDebitMandates;
