import type {
  InvestorBrokerageDirectDebitMandateCancelRequestDto,
  StandardError,
} from '@bambu/api-client';
import { TransactInvestorAuthenticatedBrokerageApi } from '@bambu/api-client';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

export function useCancelDirectDebitMandate(
  queryOptions?: UseMutationOptions<
    Awaited<ReturnType<typeof postToCancelDirectDebitMandate>>,
    StandardError,
    InvestorBrokerageDirectDebitMandateCancelRequestDto
  >
) {
  return useMutation({
    mutationKey: ['cancelDirectDebitMandate'],
    mutationFn: postToCancelDirectDebitMandate,
    ...queryOptions,
  });
}

async function postToCancelDirectDebitMandate(
  args: InvestorBrokerageDirectDebitMandateCancelRequestDto
) {
  const brokerageApi = new TransactInvestorAuthenticatedBrokerageApi();
  const res = await brokerageApi.cancelDirectDebitMandate(args);
  return res.data;
}
export default useCancelDirectDebitMandate;
