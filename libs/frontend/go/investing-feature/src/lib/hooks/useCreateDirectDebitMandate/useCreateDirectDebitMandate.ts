import type {
  InvestorBrokerageCreateDirectDebitMandateRequestDto,
  InvestorBrokerageCreateDirectDebitMandateResponseDto,
} from '@bambu/api-client';
import { TransactInvestorAuthenticatedBrokerageApi } from '@bambu/api-client';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export function useCreateDirectDebitMandate(
  queryOptions?: UseMutationOptions<
    InvestorBrokerageCreateDirectDebitMandateResponseDto,
    AxiosError,
    InvestorBrokerageCreateDirectDebitMandateRequestDto
  >
) {
  return useMutation({
    mutationKey: ['createDirectDebitMandate'],
    mutationFn: (args: InvestorBrokerageCreateDirectDebitMandateRequestDto) =>
      postToDirectDebitMandate(args),
    ...queryOptions,
  });
}

async function postToDirectDebitMandate(
  args: InvestorBrokerageCreateDirectDebitMandateRequestDto
) {
  const createDiDirectDebitMandateApi =
    new TransactInvestorAuthenticatedBrokerageApi();
  const res =
    await createDiDirectDebitMandateApi.createDirectDebitMandateForParty(args);
  return res.data;
}

export default useCreateDirectDebitMandate;
