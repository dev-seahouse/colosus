import { TransactInvestorAuthApi } from '@bambu/api-client';
import type { TransactInvestorValidateAccountRequestDto } from '@bambu/api-client';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export const verifyAccount = async (
  req: TransactInvestorValidateAccountRequestDto
) => {
  const transactInvestorAuthApi = new TransactInvestorAuthApi();

  return transactInvestorAuthApi.verifyAccount(req).then((res) => res.data);
};

export interface UseVerifyAccountProps {
  onSuccess?: (res: Awaited<ReturnType<typeof verifyAccount>>) => void;
  onError?: (err: AxiosError) => void;
}

export function useVerifyAccount({
  onSuccess,
  onError,
}: Partial<UseVerifyAccountProps> = {}) {
  return useMutation(['verifyAccount'], verifyAccount, { onSuccess, onError });
}

export default useVerifyAccount;
