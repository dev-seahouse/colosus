import { QueryClient, useQuery } from '@tanstack/react-query';
import { ConnectInvestorAdvisorModelPortfoliosApi } from '@bambu/api-client';
import type { ConnectInvestorGetModelPortfoliosSummaryResponseDto } from '@bambu/api-client';

export type GetModelPortfoliosData =
  ConnectInvestorGetModelPortfoliosSummaryResponseDto;

export const getModelPortfoliosQuery = () => ({
  queryKey: ['getModelPortfolios'],
  queryFn: async () => {
    const connectInvestorAdvisorModelPortfoliosApi =
      new ConnectInvestorAdvisorModelPortfoliosApi();
    const res =
      await connectInvestorAdvisorModelPortfoliosApi.getModelPortfoliosSummary();

    return res.data;
  },
  staleTime: Infinity,
});

export const getModelPortfoliosLoader =
  (queryClient: QueryClient) => async (): Promise<GetModelPortfoliosData> => {
    const query = getModelPortfoliosQuery();

    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export interface UseGetModelPortfoliosOptions {
  initialData?: GetModelPortfoliosData;
}

/**
 * hook to get tenant model portfolios data
 */
export const useGetModelPortfolios = ({
  initialData,
}: UseGetModelPortfoliosOptions = {}) => {
  return useQuery({
    ...getModelPortfoliosQuery(),
    initialData,
  });
};

export default useGetModelPortfolios;
