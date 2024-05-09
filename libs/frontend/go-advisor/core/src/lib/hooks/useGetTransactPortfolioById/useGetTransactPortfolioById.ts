import type { GetModelPortfolioResponseDto } from '@bambu/api-client';
import { TransactAdvisorModelPortfolioApi } from '@bambu/api-client';
import { useQuery } from '@tanstack/react-query';
import type { QueryArgs } from '@bambu/go-core';

const getTransactPortfolioByIdQuery = (id: string) => {
  return {
    queryKey: ['getTransactPortfolioById', id],
    queryFn: () => fetchTransactPortfolioById(id),
  };
};

export function useGetTransactPortfolioById<T>(
  id: string,
  queryArgs?: QueryArgs<GetModelPortfolioResponseDto, T>
) {
  return useQuery({
    ...getTransactPortfolioByIdQuery(id),
    ...queryArgs,
  });
}

async function fetchTransactPortfolioById(id: string) {
  const api = new TransactAdvisorModelPortfolioApi();
  const res = await api.getModelPortfolioById(id);
  return res.data;
}

export default useGetTransactPortfolioById;
