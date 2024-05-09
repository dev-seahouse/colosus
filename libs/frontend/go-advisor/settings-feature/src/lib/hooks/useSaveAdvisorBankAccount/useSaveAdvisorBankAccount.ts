import { TransactAdvisorBankAccountApi } from '@bambu/api-client';
import type { AdvisorBankAccountDto } from '@bambu/api-client';
import { useMutation } from '@tanstack/react-query';

export const saveAdvisorBankAccountDetails = async (
  args: AdvisorBankAccountDto
) => {
  const transactAdvisorBankAccountApi = new TransactAdvisorBankAccountApi();
  const res = await transactAdvisorBankAccountApi.saveAdvisorBankAccount(args);
  return res.data;
};

export function useSaveAdvisorBankAccountDetails() {
  return useMutation({
    mutationKey: ['saveAdvisorBankAccountDetails'],
    mutationFn: saveAdvisorBankAccountDetails,
  });
}

export default useSaveAdvisorBankAccountDetails;
