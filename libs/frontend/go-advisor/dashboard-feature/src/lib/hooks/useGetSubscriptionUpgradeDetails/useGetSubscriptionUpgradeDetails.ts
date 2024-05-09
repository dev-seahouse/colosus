import { useQuery } from '@tanstack/react-query';
import { StripeIntegrationAdvisorSubscriptionsApi } from '@bambu/api-client';

export const getSubscriptionUpgradeDetails = (requestId: string) => ({
  queryKey: ['getSubscriptionUpgradeDetails', requestId],
  queryFn: async () => {
    const stripeIntergrationAdvisorSubscriptionsApi =
      new StripeIntegrationAdvisorSubscriptionsApi();
    const res =
      await stripeIntergrationAdvisorSubscriptionsApi.getSubscriptionUpgradeDetails(
        requestId
      );

    return res.data;
  },
});

export function useGetSubscriptionUpgradeDetails(requestId: string) {
  return useQuery({
    ...getSubscriptionUpgradeDetails(requestId),
  });
}

export default useGetSubscriptionUpgradeDetails;
