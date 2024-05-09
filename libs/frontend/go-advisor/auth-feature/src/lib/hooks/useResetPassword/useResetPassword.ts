import { useMutation } from '@tanstack/react-query';
import { ConnectAdvisorAuthApi } from '@bambu/api-client';
import type { ConnectAdvisorChangePasswordRequestDto } from '@bambu/api-client';

export const resetPassword = () => ({
  mutationKey: ['resetPassword'],
  mutationFn: async (req: ConnectAdvisorChangePasswordRequestDto) => {
    const connectAdvisorAuthApi = new ConnectAdvisorAuthApi();
    const res = await connectAdvisorAuthApi.changePassword(req);

    return res.data;
  },
});

export interface UseResetPasswordOptions {
  onSuccess?: () => void;
}

/**
 * query hook to change password
 */
export function useResetPassword({ onSuccess }: UseResetPasswordOptions = {}) {
  return useMutation(resetPassword().mutationKey, resetPassword().mutationFn, {
    onSuccess,
  });
}

export default useResetPassword;
