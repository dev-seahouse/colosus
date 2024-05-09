import { useMutation } from '@tanstack/react-query';
import { ConnectAdvisorAuthApi } from '@bambu/api-client';
import type { ConnectAdvisorSendResetPasswordEmailRequestDto } from '@bambu/api-client';

export const sendResetPasswordEmail = () => ({
  mutationKey: ['sendResetPasswordEmail'],
  mutationFn: async (req: ConnectAdvisorSendResetPasswordEmailRequestDto) => {
    const connectAdvisorAuthApi = new ConnectAdvisorAuthApi();
    const res = await connectAdvisorAuthApi.sendResetPasswordEmail(req);

    return res.data;
  },
});

export interface UseSendResetPasswordEmailOptions {
  onSuccess?: () => void;
}

/**
 * query hook to send reset password email
 */
export function useSendResetPasswordEmail({
  onSuccess,
}: UseSendResetPasswordEmailOptions = {}) {
  return useMutation(
    sendResetPasswordEmail().mutationKey,
    sendResetPasswordEmail().mutationFn,
    { onSuccess }
  );
}

export default useSendResetPasswordEmail;
