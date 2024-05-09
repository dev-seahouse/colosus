import { useQuery } from '@tanstack/react-query';
import { StripeIntegrationPricesApi } from '@bambu/api-client';
import type { StripeIntegrationGetPricesResponseDto } from '@bambu/api-client';
import type { QueryClient } from '@tanstack/react-query';

export type GetPricesData = StripeIntegrationGetPricesResponseDto;

export const getPricesQuery = () => ({
  queryKey: ['getPrices'],
  queryFn: async () => {
    const stripeIntegrationPricesApi = new StripeIntegrationPricesApi();
    const res = await stripeIntegrationPricesApi.getPrices();

    return res.data;
  },
});

export const getPricesLoader =
  (queryClient: QueryClient) => async (): Promise<GetPricesData> => {
    const query = getPricesQuery();

    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export interface UseGetPricesOptions {
  initialData?: Partial<GetPricesData>;
}
export function useGetPrices({ initialData }: UseGetPricesOptions = {}) {
  return useQuery({
    ...getPricesQuery(),
    initialData,
  });
}

export default useGetPrices;
