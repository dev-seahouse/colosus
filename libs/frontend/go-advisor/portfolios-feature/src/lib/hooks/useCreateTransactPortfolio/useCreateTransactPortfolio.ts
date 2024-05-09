import { TransactAdvisorModelPortfolioApi } from '@bambu/api-client';
import type { TransactModelPortfolioSummaryDto } from '@bambu/api-client';
import { useMutation } from '@tanstack/react-query';

export const createTransactAdvisorModelPortfolio = async (
  args: TransactModelPortfolioSummaryDto
) => {
  const transactAdvisorModelPortfolioApi =
    new TransactAdvisorModelPortfolioApi();
  const res = await transactAdvisorModelPortfolioApi.createModelPortfolio(args);
  return res.data;
};

export function useCreateTransactPortfolio() {
  return useMutation({
    mutationKey: ['createModelPortfolio'],
    mutationFn: createTransactAdvisorModelPortfolio,
  });
}

export default useCreateTransactPortfolio;
