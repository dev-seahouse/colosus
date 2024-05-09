import type {
  InvestorBrokerageWithdrawalRequestDto,
  StandardError,
  InvestorBrokerageWithdrawalResponseDto,
} from '@bambu/api-client';
import { TransactInvestorAuthenticatedBrokerageApi } from '@bambu/api-client';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const createWithdrawalRequestQuery = {
  mutationKey: ['createWithdrawalRequest'],
  mutationFn: postToCreateWithdrawal,
};

export function useCreateWithdrawalRequest(
  mutationOptions?: UseMutationOptions<
    InvestorBrokerageWithdrawalResponseDto,
    StandardError,
    InvestorBrokerageWithdrawalRequestDto
  >
) {
  return useMutation({
    ...createWithdrawalRequestQuery,
    ...mutationOptions,
  });
}

async function postToCreateWithdrawal(
  args: InvestorBrokerageWithdrawalRequestDto
) {
  const api = new TransactInvestorAuthenticatedBrokerageApi();
  const res = await api.createWithdrawalRequest(args);
  return res.data;
}

export default useCreateWithdrawalRequest;
