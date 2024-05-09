import { useMutation } from '@tanstack/react-query';
import { StripeIntegrationBillingPortalApi } from '@bambu/api-client';
import type { StripeIntegrationCreateBillingPortalSessionResponseDto } from '@bambu/api-client';

export const createBillingPortalSessionQuery = () => ({
  mutationKey: ['createBillingPortalSession'],
  mutationFn: async () => {
    const stripeIntegrationBillingPortalApi =
      new StripeIntegrationBillingPortalApi();

    const res =
      await stripeIntegrationBillingPortalApi.createBillingPortalSession();

    return res.data;
  },
});

export interface UseCreateBillingPortalSessionOptions {
  onSuccess?: (
    data: StripeIntegrationCreateBillingPortalSessionResponseDto
  ) => void;
}

/**
 * query hook to create billing portal session
 */
export function useCreateBillingPortalSession({
  onSuccess,
}: UseCreateBillingPortalSessionOptions = {}) {
  return useMutation(
    createBillingPortalSessionQuery().mutationKey,
    createBillingPortalSessionQuery().mutationFn,
    { onSuccess }
  );
}

export default useCreateBillingPortalSession;
