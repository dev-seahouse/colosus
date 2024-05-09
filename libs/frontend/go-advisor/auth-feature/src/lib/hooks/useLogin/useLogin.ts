import { ConnectAdvisorAuthApi } from '@bambu/api-client';
import type { ConnectAdvisorLoginRequestDto } from '@bambu/api-client';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export const login = async (req: ConnectAdvisorLoginRequestDto) => {
  const connectAdvisorAuthApi = new ConnectAdvisorAuthApi();

  return connectAdvisorAuthApi.login(req).then((res) => res.data);
};

export interface UseLoginProps {
  onSuccess?: (res: Awaited<ReturnType<typeof login>>) => void;
  onError?: (err: AxiosError) => void;
}

export function useLogin({ onSuccess, onError }: Partial<UseLoginProps> = {}) {
  return useMutation(['login'], login, { onSuccess, onError });
}

export default useLogin;
