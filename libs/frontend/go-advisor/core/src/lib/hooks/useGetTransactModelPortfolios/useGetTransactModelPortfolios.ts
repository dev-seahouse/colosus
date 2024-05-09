import { useQuery } from '@tanstack/react-query';
import type { GetModelPortfolioResponseDto } from '@bambu/api-client';
import { TransactAdvisorModelPortfolioApi } from '@bambu/api-client';
import type { QueryArgs } from '@bambu/go-core';

export const getTransactModelPortfoliosQuery = () => ({
  queryKey: ['getTransactModelPortfolios'],
  queryFn: async () => {
    const transactAdvisorModelPortfolioApi =
      new TransactAdvisorModelPortfolioApi();
    const res = await transactAdvisorModelPortfolioApi.getModelPortfolios();
    return res.data;
  },
});

export function useGetTransactModelPortfolios<T = GetModelPortfolioResponseDto>(
  queryArgs?: QueryArgs<GetModelPortfolioResponseDto[], T>
) {
  return useQuery({
    ...getTransactModelPortfoliosQuery(),
    ...queryArgs,
  });
}

export default useGetTransactModelPortfolios;
