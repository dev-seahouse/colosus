import type { TransactModelPortfolioResponseDto } from '@bambu/api-client';
import { TransactInvestorModelPortfoliosApi } from '@bambu/api-client';
import { useQuery } from '@tanstack/react-query';
import { QueryArgs } from '../../types/utils';

export const getInvestorModelPortfolioQuery = (id: string) => ({
  queryKey: ['getInvestorModelPortfolio', id],
  queryFn: () => fetchInvestorModelPortfolios(id),
});

export const useGetInvestorModelPortfolio = (
  id: string,
  queryOptions?: QueryArgs<TransactModelPortfolioResponseDto>
) => {
  return useQuery({
    ...getInvestorModelPortfolioQuery(id),
    ...queryOptions,
  });
};

async function fetchInvestorModelPortfolios(id: string) {
  const investorModelPortfolio = new TransactInvestorModelPortfoliosApi();
  const res = await investorModelPortfolio.getModelPortfolioById(id);
  return res.data;
}
