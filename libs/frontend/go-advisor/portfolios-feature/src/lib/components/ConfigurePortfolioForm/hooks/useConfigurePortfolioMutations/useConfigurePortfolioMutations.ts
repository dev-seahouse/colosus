import useUpdateConnectPortfolio from '../../../../hooks/useUpdateConnectPortfolio/useUpdateConnectPortfolio';
import useCreateTransactPortfolio from '../../../../hooks/useCreateTransactPortfolio/useCreateTransactPortfolio';
import useCreateTransactPortfolioInstruments from '../../../../hooks/useCreateTransactPortfolioInstruments/useCreateTransactPortfolioInstruments';
import useUploadTransactPortfolioFactSheet from '../../../../hooks/useUploadTransactPortfolioFactSheet/useUploadTransactPortfolioFactSheet';

export function useConfigurePortfolioFormMutations() {
  const {
    mutate: updateConnectPortfolio,
    isLoading: isUpdatingConnectPortfolio,
  } = useUpdateConnectPortfolio();

  const {
    mutate: createTransactModelPortfolio,
    isLoading: isCreatingTransactPortfolio,
  } = useCreateTransactPortfolio();

  const {
    mutate: createTransactPortfolioInstruments,
    isLoading: isCreatingTransactPortfolioInstruments,
  } = useCreateTransactPortfolioInstruments();

  const {
    mutate: uploadTransactPortfolioFactSheet,
    isLoading: isUploadingTransactPortfolioFactSheet,
  } = useUploadTransactPortfolioFactSheet();
  return {
    updateConnectPortfolio,
    isUpdatingConnectPortfolio,
    createTransactModelPortfolio,
    isCreatingTransactPortfolio,
    createTransactPortfolioInstruments,
    isCreatingTransactPortfolioInstruments,
    uploadTransactPortfolioFactSheet,
    isUploadingTransactPortfolioFactSheet,
  };
}
