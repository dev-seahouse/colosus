import type {
  InvestorBrokerageCreateBankAccountForPartyRequestDto,
  InvestorBrokerageCreateBankAccountForPartyResponseDto,
  StandardError,
} from '@bambu/api-client';
import { TransactInvestorAuthenticatedBrokerageApi } from '@bambu/api-client';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

export function useCreateBankAccount(
  queryOptions?: UseMutationOptions<
    InvestorBrokerageCreateBankAccountForPartyResponseDto,
    StandardError,
    InvestorBrokerageCreateBankAccountForPartyRequestDto
  >
) {
  return useMutation({
    mutationKey: ['createBankAccount'],
    mutationFn: postToCreateBankAccount,
    ...queryOptions,
  });
}

async function postToCreateBankAccount(
  args: InvestorBrokerageCreateBankAccountForPartyRequestDto
) {
  const investorBrokerageApi = new TransactInvestorAuthenticatedBrokerageApi();
  const res = await investorBrokerageApi.createBankAccountForParty(args);
  return res.data;
}
export default useCreateBankAccount;
