import { TransactAdvisorModelPortfolioApi } from '@bambu/api-client';
import { useMutation } from '@tanstack/react-query';
import type { TransactModePortfolioFileUploadDto } from '@bambu/api-client';
export const uploadModelPortfolioFactSheetQuery = async ({
  id,
  file,
}: TransactModePortfolioFileUploadDto) => {
  const transactAdvisorModelPortfolioApi =
    new TransactAdvisorModelPortfolioApi();
  const res =
    await transactAdvisorModelPortfolioApi.uploadModelPortfolioFactSheet({
      id,
      file,
    });
  return res.data;
};

export function useUploadTransactPortfolioFactSheet() {
  return useMutation({
    mutationKey: ['uploadModelPortfolioFactSheet'],
    mutationFn: uploadModelPortfolioFactSheetQuery,
  });
}

export default useUploadTransactPortfolioFactSheet;
