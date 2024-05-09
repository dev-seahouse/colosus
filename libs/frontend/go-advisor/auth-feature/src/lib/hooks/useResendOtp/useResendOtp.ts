import type { ConnectAdvisorResendOtpRequestDto } from '@bambu/api-client';
import { ConnectAdvisorAuthApi } from '@bambu/api-client';
import { useMutation } from '@tanstack/react-query';

async function sendOtp(req: ConnectAdvisorResendOtpRequestDto) {
  const connectAdvisorAuthApi = new ConnectAdvisorAuthApi();
  const res = await connectAdvisorAuthApi.resendOtp(req);
  return res.data;
}

export function useResendOtp() {
  return useMutation({
    mutationFn: sendOtp,
  });
}

export default useResendOtp;
