import { useQuery } from '@tanstack/react-query';
import { ConnectAdvisorPortfolioSummaryApi } from '@bambu/api-client';
import type { ConnectAdvisorGetPortfolioByKeyResponseDto } from '@bambu/api-client';
import type { QueryClient } from '@tanstack/react-query';

export type GetConnectPortfolioByKeyData =
  Awaited<ConnectAdvisorGetPortfolioByKeyResponseDto>;

// TODO this triggers re-render on every call since array ref changed
export const getConnectPortfolioByKeyQuery = (key: string) => ({
  queryKey: ['getConnectPortfolioByKey', key],
  queryFn: async () => {
    const connectAdvisorPortfolioSummaryApi =
      new ConnectAdvisorPortfolioSummaryApi();
    const res = await connectAdvisorPortfolioSummaryApi.getPortfolios();
    return res.data.portfolioSummaries.find(
      (portfolio) => portfolio.key === key
    );
  },
});
export const getConnectPortfolioByKeyLoader =
  (queryClient: QueryClient) =>
  async (key: string): Promise<GetConnectPortfolioByKeyData> => {
    const query = getConnectPortfolioByKeyQuery(key);

    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export interface UseGetConnectPortfolioByKeyOptions {
  initialData?: Partial<GetConnectPortfolioByKeyData>;
  key: string;
}
export function useGetConnectPortfolioByKey({
  initialData,
  key,
}: UseGetConnectPortfolioByKeyOptions) {
  return useQuery({
    ...getConnectPortfolioByKeyQuery(key),
    initialData,
  });
}

export default useGetConnectPortfolioByKey;
