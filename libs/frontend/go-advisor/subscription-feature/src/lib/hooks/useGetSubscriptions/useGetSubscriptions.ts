import { useQuery } from '@tanstack/react-query';
import { StripeIntegrationAdvisorSubscriptionsApi } from '@bambu/api-client';
import type { StripeIntegrationGetSubscriptionsResponseDto } from '@bambu/api-client';
import type { QueryClient } from '@tanstack/react-query';

export type GetSubscriptionsData = StripeIntegrationGetSubscriptionsResponseDto;

export const getSubscriptionsQuery = () => ({
  queryKey: ['getSubscriptions'],
  queryFn: async () => {
    const stripeIntegrationAdvisorSubscriptionsApi =
      new StripeIntegrationAdvisorSubscriptionsApi();

    const res =
      await stripeIntegrationAdvisorSubscriptionsApi.getSubscriptions();

    return res.data;
  },
});

export const getSubscriptionsLoader =
  (queryClient: QueryClient) => async (): Promise<GetSubscriptionsData> => {
    const query = getSubscriptionsQuery();

    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export interface UseGetSubscriptionsOptions {
  initialData?: Partial<GetSubscriptionsData>;
}
export function useGetSubscriptions({
  initialData,
}: UseGetSubscriptionsOptions = {}) {
  return useQuery({
    ...getSubscriptionsQuery(),
    initialData,
  });
}

export default useGetSubscriptions;
