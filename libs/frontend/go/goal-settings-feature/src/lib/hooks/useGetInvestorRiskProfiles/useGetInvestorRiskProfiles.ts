import {
  type ConnectInvestorGetInvestorRiskProfilesResponseDto,
  type ConnectInvestorGetAdvisorProfileResponseDto,
  ConnectInvestorRiskProfilingApi,
} from '@bambu/api-client';
import type { QueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

export const getInvestorRiskProfilesQuery = {
  queryKey: ['investorRiskProfiles'],
  queryFn: fetchInvestorRiskProfiles,
  staleTime: 1000 * 59 * 5,
};

export function useGetInvestorRiskProfiles<
  T = ConnectInvestorGetInvestorRiskProfilesResponseDto
>(
  options?: UseQueryOptions<
    ConnectInvestorGetInvestorRiskProfilesResponseDto,
    unknown,
    T,
    string[]
  >
) {
  return useQuery({
    queryKey: getInvestorRiskProfilesQuery.queryKey,
    queryFn: getInvestorRiskProfilesQuery.queryFn,
    staleTime: getInvestorRiskProfilesQuery.staleTime,
    ...options,
  });
}

export const getInvestorRiskProfilesLoader =
  (queryClient: QueryClient) =>
  async (): Promise<ConnectInvestorGetAdvisorProfileResponseDto> => {
    // return data or fetch it
    return (
      queryClient.getQueryData(getInvestorRiskProfilesQuery.queryKey) ??
      (await queryClient.fetchQuery(getInvestorRiskProfilesQuery))
    );
  };

async function fetchInvestorRiskProfiles() {
  const api = new ConnectInvestorRiskProfilingApi();
  const res = await api.getInvestorRiskProfiles();
  return res.data;
}

export default useGetInvestorRiskProfiles;
