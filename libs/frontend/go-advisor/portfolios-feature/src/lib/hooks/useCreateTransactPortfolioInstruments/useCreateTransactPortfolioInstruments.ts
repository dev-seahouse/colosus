import { TransactAdvisorModelPortfolioApi } from '@bambu/api-client';
import type {
  TransactCreateModelPortfolioInstrumentsDto,
  StandardError,
  TransactCreateModePortfolioInstrumentsResponseDto,
} from '@bambu/api-client';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

export const createTransactAdvisorModelPortfolioInstruments = async (
  req: TransactCreateModelPortfolioInstrumentsDto[]
) => {
  const transactAdvisorModelPortfolioApi =
    new TransactAdvisorModelPortfolioApi();
  const res =
    await transactAdvisorModelPortfolioApi.upsertModelPortfolioInstruments(req);
  return res.data;
};

export function useCreateTransactPortfolioInstruments(
  queryArgs?: UseMutationOptions<
    TransactCreateModePortfolioInstrumentsResponseDto,
    StandardError,
    TransactCreateModelPortfolioInstrumentsDto[]
  >
) {
  return useMutation({
    mutationKey: ['createModelPortfolioInstruments'],
    mutationFn: createTransactAdvisorModelPortfolioInstruments,
    ...queryArgs,
  });
}

export default useCreateTransactPortfolioInstruments;
