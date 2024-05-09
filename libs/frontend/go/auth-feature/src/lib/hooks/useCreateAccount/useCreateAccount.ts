import { TransactInvestorAuthApi } from '@bambu/api-client';
import type { TransactInvestorCreateAccountRequestDto } from '@bambu/api-client';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios/index';

export const createAccount = async (
  req: TransactInvestorCreateAccountRequestDto
) => {
  const transactInvestorAuthApi = new TransactInvestorAuthApi();

  return transactInvestorAuthApi.createAccount(req).then((res) => res.data);
};

export interface UseCreateAccountProps {
  onSuccess?: (res: Awaited<ReturnType<typeof createAccount>>) => void;
  onError?: (err: AxiosError) => void;
}

export function useCreateAccount({
  onSuccess,
  onError,
}: Partial<UseCreateAccountProps> = {}) {
  return useMutation(['createAccount'], createAccount, { onSuccess, onError });
}

export default useCreateAccount;
