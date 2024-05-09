import { TransactAdvisorBankAccountApi } from '@bambu/api-client';
import type { AdvisorBankAccountDto } from '@bambu/api-client';
import { useMutation } from '@tanstack/react-query';

export const updateAdvisorBankAccountDetails = async (
  args: AdvisorBankAccountDto
) => {
  const transactAdvisorBankAccountApi = new TransactAdvisorBankAccountApi();
  const res = await transactAdvisorBankAccountApi.updateAdvisorBankAccount(
    args
  );
  return res.data;
};

export function useUpdateAdvisorBankAccountDetails() {
  return useMutation({
    mutationKey: ['updateAdvisorBankAccountDetails'],
    mutationFn: updateAdvisorBankAccountDetails,
  });
}

export default useUpdateAdvisorBankAccountDetails;
