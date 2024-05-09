import { useMutation } from '@tanstack/react-query';
import { StripeIntegrationAdvisorSubscriptionsApi } from '@bambu/api-client';
import type {
  StripeIntegrationCreateCheckoutSessionRequestDto,
  StripeIntegrationCreateCheckoutSessionResponseDto,
} from '@bambu/api-client';

export const createCheckoutSessionQuery = () => ({
  mutationKey: ['createCheckoutSession'],
  mutationFn: async (req: StripeIntegrationCreateCheckoutSessionRequestDto) => {
    const stripeIntegrationAdvisorSubscriptionsApi =
      new StripeIntegrationAdvisorSubscriptionsApi();
    const res =
      await stripeIntegrationAdvisorSubscriptionsApi.createCheckoutSession(req);

    return res.data;
  },
});

export interface UseCreateCheckoutSessionOptions {
  onSuccess?: (data: StripeIntegrationCreateCheckoutSessionResponseDto) => void;
}

/**
 * query hook to create checkout session
 */
export function useCreateCheckoutSession({
  onSuccess,
}: UseCreateCheckoutSessionOptions = {}) {
  return useMutation(
    createCheckoutSessionQuery().mutationKey,
    createCheckoutSessionQuery().mutationFn,
    { onSuccess }
  );
}

export default useCreateCheckoutSession;
