import type { ConnectInvestorComputeRiskProfileScoreResponseDto } from '@bambu/api-client';
import {
  ConnectInvestorRiskProfilingApi,
  type ConnectInvestorComputeRiskProfileScoreRequestDto,
} from '@bambu/api-client';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

export function useComputeRiskProfileScore(
  options?: UseMutationOptions<
    ConnectInvestorComputeRiskProfileScoreResponseDto,
    any,
    ConnectInvestorComputeRiskProfileScoreRequestDto
  >
) {
  return useMutation({
    mutationKey: ['computeRiskProfileScore'],
    mutationFn: (args: ConnectInvestorComputeRiskProfileScoreRequestDto) =>
      fetchRiskProfileScore(args),
    ...options,
  });
}

async function fetchRiskProfileScore(
  args: ConnectInvestorComputeRiskProfileScoreRequestDto
) {
  const connectInvestorRiskProfilingApi = new ConnectInvestorRiskProfilingApi();

  const res = await connectInvestorRiskProfilingApi.computeRiskProfileScore(
    args
  );
  return res.data;
}
export default useComputeRiskProfileScore;
