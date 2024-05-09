import { TransactInvestorAuthenticatedProfileApi } from '@bambu/api-client';
import { useQuery } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import type { InvestorGetInvestorPlatformUserProfileResponseDto } from '@bambu/api-client';
import type { QueryArgs } from '../../types/utils';

export const investorProfileQuery = {
  queryKey: ['getInvestorProfile'],
  queryFn: fetchProfiles,
};

export function useGetInvestorProfile<
  T = InvestorGetInvestorPlatformUserProfileResponseDto
>(
  queryOptions?: QueryArgs<InvestorGetInvestorPlatformUserProfileResponseDto, T>
) {
  return useQuery({
    ...investorProfileQuery,
    ...queryOptions,
  });
}

export const getInvestorProfileLoader = (queryClient: QueryClient) => {
  return async () => {
    const query = investorProfileQuery;
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };
};

async function fetchProfiles() {
  const investorProfileApi = new TransactInvestorAuthenticatedProfileApi();
  const res = await investorProfileApi.getInvestorPlatformUserProfile();
  return res.data;
}

export default useGetInvestorProfile;
