import { TransactAdvisorBankAccountApi } from '@bambu/api-client';
import { type QueryClient, useQuery } from '@tanstack/react-query';
import { QueryArgs } from '@bambu/go-core';
import type { ITransactAdvisorBankAccountDto } from '@bambu/shared';

export const getAdvisorBankAccountDetailsQuery = () => ({
  queryKey: ['getAdvisorBankAccountDetails'],
  queryFn: fetchBankAccountDetails,
});

export const fetchBankAccountDetails = async () => {
  const transactAdvisorBankAccountApi = new TransactAdvisorBankAccountApi();
  const res = await transactAdvisorBankAccountApi.getAdvisorBankAccount();
  return res.data;
};

export const getAdvisorBankAccountDetailsLoader =
  (queryClient: QueryClient) => async () => {
    const query = getAdvisorBankAccountDetailsQuery();

    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export function useGetAdvisorBankAccountDetails(
  queryOptions?: QueryArgs<ITransactAdvisorBankAccountDto>
) {
  return useQuery({
    ...getAdvisorBankAccountDetailsQuery(),
    ...queryOptions,
  });
}

export default useGetAdvisorBankAccountDetails;
