import { useMutation } from '@tanstack/react-query';
import { StripeIntegrationAdvisorSubscriptionsApi } from '@bambu/api-client';

export const upgradeSubscription = () => ({
  mutationKey: ['upgradeSubscription'],
  mutationFn: async () => {
    const stripeIntegrationAdvisorSubscriptionsApi =
      new StripeIntegrationAdvisorSubscriptionsApi();
    const res =
      await stripeIntegrationAdvisorSubscriptionsApi.upgradeSubscription();

    return res.data;
  },
});

export interface UseUpgradeSubscriptionProps {
  onSuccess?: () => void;
}

/**
 * query hook to delete advisor internal profile picture
 */
export function useUpgradeSubscription({
  onSuccess,
}: UseUpgradeSubscriptionProps = {}) {
  return useMutation(
    upgradeSubscription().mutationKey,
    upgradeSubscription().mutationFn,
    { onSuccess }
  );
}

export default useUpgradeSubscription;
