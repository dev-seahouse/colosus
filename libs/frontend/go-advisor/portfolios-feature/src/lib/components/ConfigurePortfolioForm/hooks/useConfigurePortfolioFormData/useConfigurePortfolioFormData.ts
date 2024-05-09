import { useSelectConnectPortfolioByKey } from '../../../../hooks/useGetConnectPortfolioByKey/useGetConnectPortfolioByKey.selectors';
import { useSelectIsReadyToConfigureTransactPortfolioQuery } from '@bambu/go-advisor-core';
import useGetInitialTransactPortfolioFormData from '../useGetInitialTransactPorfolioFormData/useGetInitialTransactPortfolioFormData';

export function useConfigurePortfolioFormData(
  portfolioType: string | undefined
) {
  const {
    data: connectPortfolioSummary,
    isLoading: isConnectPortfolioLoading,
    isError: isConnectPortfolioError,
  } = useSelectConnectPortfolioByKey(portfolioType as string);
  const {
    data: isReadyToConfigureTransactPortfolio,
    isLoading: isReadyToConfigureTransactPortfolioLoading,
    isError: isReadyToConfigureTransactPortfolioError,
  } = useSelectIsReadyToConfigureTransactPortfolioQuery();
  const {
    data: transactPortfolioInitialData,
    isLoading: isTransactPortfolioLoading,
    isError: isTransactPortfolioInitialDataError,
  } = useGetInitialTransactPortfolioFormData({
    connectPortfolioId: connectPortfolioSummary?.id ?? '',
  });
  return {
    connectPortfolioSummary,
    isConnectPortfolioLoading,
    isConnectPortfolioError,
    isReadyToConfigureTransactPortfolio,
    isReadyToConfigureTransactPortfolioLoading,
    isReadyToConfigureTransactPortfolioError,
    transactPortfolioInitialData,
    isTransactPortfolioLoading,
    isTransactPortfolioInitialDataError,
  };
}
