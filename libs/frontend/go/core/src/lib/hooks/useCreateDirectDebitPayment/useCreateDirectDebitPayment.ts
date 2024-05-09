import {
  InvestorBrokerageUkDirectDebitCreatePaymentReqDto,
  InvestorBrokerageUkDirectDebitCreatePaymentResDto,
  StandardError,
  TransactInvestorAuthenticatedBrokerageApi,
} from '@bambu/api-client';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

const createDirectDebitPaymentQuery = {
  mutationKey: ['createDirectDebitPayment'],
  mutationFn: postToCreateDirectDebitPayment,
};

export function useCreateDirectDebitPayment(
  mutationOptions?: UseMutationOptions<
    InvestorBrokerageUkDirectDebitCreatePaymentResDto,
    StandardError,
    InvestorBrokerageUkDirectDebitCreatePaymentReqDto
  >
) {
  return useMutation({
    ...createDirectDebitPaymentQuery,
    ...mutationOptions,
  });
}

async function postToCreateDirectDebitPayment(
  args: InvestorBrokerageUkDirectDebitCreatePaymentReqDto
) {
  const api = new TransactInvestorAuthenticatedBrokerageApi();
  const res = await api.createDirectDebitPayment(args);
  return res.data;
}

export default useCreateDirectDebitPayment;
