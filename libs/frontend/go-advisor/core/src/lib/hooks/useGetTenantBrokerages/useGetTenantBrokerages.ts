import { useQuery } from '@tanstack/react-query';
import type { TenantTransactBrokerageResponseDto } from '@bambu/api-client';
import { TransactAdvisorTenantBrokeragesApi } from '@bambu/api-client';
import { QueryArgs } from '@bambu/go-core';

export const getTenantBrokeragesQuery = () => ({
  queryKey: ['getTenantBrokerages'],
  queryFn: fetchTenantBrokerages,
});

export function useGetTenantBrokeragesQuery<
  T = TenantTransactBrokerageResponseDto
>(queryOptions?: QueryArgs<TenantTransactBrokerageResponseDto, T>) {
  return useQuery({
    ...getTenantBrokeragesQuery(),
    ...queryOptions,
  });
}

async function fetchTenantBrokerages() {
  const transactAdvisorTenantBrokeragesApi =
    new TransactAdvisorTenantBrokeragesApi();
  const res = await transactAdvisorTenantBrokeragesApi.getTenantBrokerages();

  return res.data;
}

export default useGetTenantBrokeragesQuery;
