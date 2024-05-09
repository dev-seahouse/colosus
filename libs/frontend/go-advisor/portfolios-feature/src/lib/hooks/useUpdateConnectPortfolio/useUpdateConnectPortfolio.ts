import { ConnectAdvisorPortfolioSummaryApi } from '@bambu/api-client';
import type { ConnectAdvisorPortfolioRequestDto } from '@bambu/api-client';
import { useMutation } from '@tanstack/react-query';

export const updateConnectPortfolio = async (
  req: ConnectAdvisorPortfolioRequestDto
) => {
  const connectAdvisorPortfolioSummaryApi =
    new ConnectAdvisorPortfolioSummaryApi();

  const res = await connectAdvisorPortfolioSummaryApi.updateConnectPortfolio(
    req
  );
  return res.data;
};

export function useUpdateConnectPortfolio() {
  return useMutation({
    mutationKey: ['updateConnectPortfolio'],
    mutationFn: updateConnectPortfolio,
  });
}

export default useUpdateConnectPortfolio;
