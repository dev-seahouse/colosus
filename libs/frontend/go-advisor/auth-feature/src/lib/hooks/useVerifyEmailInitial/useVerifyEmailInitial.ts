import { ConnectAdvisorAuthApi } from '@bambu/api-client';
import type { ConnectAdvisorVerifyEmailRequestDto } from '@bambu/api-client';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios/index';

export const verifyEmailInitial = async (
  req: ConnectAdvisorVerifyEmailRequestDto
) => {
  const connectAdvisorAuthApi = new ConnectAdvisorAuthApi();

  return connectAdvisorAuthApi.verifyEmailInitial(req).then((res) => res.data);
};

export interface UseVerifyEmailProps {
  onSuccess?: (res: Awaited<ReturnType<typeof verifyEmailInitial>>) => void;
  onError?: (err: AxiosError) => void;
}

export function useVerifyEmailInitial({
  onSuccess,
  onError,
}: Partial<UseVerifyEmailProps> = {}) {
  return useMutation(['verifyEmailInitial'], verifyEmailInitial, {
    onSuccess,
    onError,
  });
}

export default useVerifyEmailInitial;
