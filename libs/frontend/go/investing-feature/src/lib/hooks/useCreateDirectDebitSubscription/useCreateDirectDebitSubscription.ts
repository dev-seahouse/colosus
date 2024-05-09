import type {
  InvestorBrokerageUkDirectDebitCreateSubscriptionReqDto,
  InvestorBrokerageUkDirectDebitCreateSubscriptionResDto,
  StandardError,
} from '@bambu/api-client';
import { TransactInvestorAuthenticatedBrokerageApi } from '@bambu/api-client';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

export const CREATE_SUBSCRIPTION_MUTATION_KEY = 'createDirectDebitSubscription';

export function useCreateDirectDebitSubscription(
  mutateOptions?: UseMutationOptions<
    InvestorBrokerageUkDirectDebitCreateSubscriptionResDto,
    StandardError,
    InvestorBrokerageUkDirectDebitCreateSubscriptionReqDto
  >
) {
  return useMutation({
    mutationKey: [CREATE_SUBSCRIPTION_MUTATION_KEY],
    mutationFn: postDirectDebitSubscription,
    ...mutateOptions,
  });
}

async function postDirectDebitSubscription(
  args: InvestorBrokerageUkDirectDebitCreateSubscriptionReqDto
) {
  const api = new TransactInvestorAuthenticatedBrokerageApi();
  const res = await api.createDirectDebitSubscription(args);
  return res.data;
}

export default useCreateDirectDebitSubscription;
