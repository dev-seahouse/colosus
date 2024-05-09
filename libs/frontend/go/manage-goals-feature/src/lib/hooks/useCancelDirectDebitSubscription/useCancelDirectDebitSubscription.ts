import type { InvestorBrokerageCancelDirectDebitSubscriptionRequestDto } from '@bambu/api-client';
import { TransactInvestorAuthenticatedBrokerageApi } from '@bambu/api-client';
import { useMutation } from '@tanstack/react-query';

const CANCEL_DIRECT_DEBIT_SUB_QUERY_KEY = 'cancelDirectDebitSubscription';

export function useCancelDirectDebitSubscription() {
  return useMutation({
    mutationKey: [CANCEL_DIRECT_DEBIT_SUB_QUERY_KEY],
    mutationFn: postToCancelDirectDebitSubscription,
  });
}

async function postToCancelDirectDebitSubscription(
  args: InvestorBrokerageCancelDirectDebitSubscriptionRequestDto
) {
  const api = new TransactInvestorAuthenticatedBrokerageApi();
  const res = await api.cancelDirectDebitSubscription(args);
  return res.data;
}

export default useCancelDirectDebitSubscription;
