import { useQuery } from '@tanstack/react-query';
import { ConnectAdvisorPortfolioSummaryApi } from '@bambu/api-client';
import type { ConnectAdvisorGetPortfoliosResponseDto } from '@bambu/api-client';
import type { QueryClient } from '@tanstack/react-query';

export type GetConnectPortfoliosData = ConnectAdvisorGetPortfoliosResponseDto;

export const getConnectPortfoliosQuery = () => ({
  queryKey: ['getPortfolios'],
  queryFn: async () => {
    const connectAdvisorPortfolioSummaryApi =
      new ConnectAdvisorPortfolioSummaryApi();
    const res = await connectAdvisorPortfolioSummaryApi.getPortfolios();

    return res.data;
  },
});

export const getConnectPortfoliosLoader =
  (queryClient: QueryClient) => async (): Promise<GetConnectPortfoliosData> => {
    const query = getConnectPortfoliosQuery();

    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export interface UseGetConnectPortfoliosOptions {
  initialData?: Partial<GetConnectPortfoliosData>;
}
export function useGetConnectPortfolios({
  initialData,
}: UseGetConnectPortfoliosOptions = {}) {
  return useQuery({
    ...getConnectPortfoliosQuery(),
    initialData,
  });
}

export default useGetConnectPortfolios;
