import type { TransactInvestorResendOtpRequestDto } from '@bambu/api-client';
import { TransactInvestorAuthApi } from '@bambu/api-client';
import { useMutation } from '@tanstack/react-query';

async function sendOtp(req: TransactInvestorResendOtpRequestDto) {
  const connectAdvisorAuthApi = new TransactInvestorAuthApi();
  const res = await connectAdvisorAuthApi.resendOtp(req);
  return res.data;
}

export function useResendOtp() {
  return useMutation({
    mutationFn: sendOtp,
  });
}

export default useResendOtp;
