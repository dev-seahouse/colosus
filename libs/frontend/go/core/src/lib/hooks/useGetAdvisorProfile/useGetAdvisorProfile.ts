import type { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { ConnectInvestorAdvisorProfileApi } from '@bambu/api-client';
import type { ConnectInvestorGetAdvisorProfileResponseDto } from '@bambu/api-client';
import { QueryArgs } from '../../types/utils';

export type GetAdvisorProfileData = ConnectInvestorGetAdvisorProfileResponseDto;

export const getAdvisorProfileQuery = () => ({
  queryKey: ['getAdvisorProfile'],
  queryFn: async () => {
    const connectInvestorAdvisorProfileApi =
      new ConnectInvestorAdvisorProfileApi();
    const res = await connectInvestorAdvisorProfileApi.getAdvisorProfile();

    return res.data;
  },
  staleTime: Infinity,
});

export const getAdvisorProfileLoader =
  (queryClient: QueryClient) => async (): Promise<GetAdvisorProfileData> => {
    const query = getAdvisorProfileQuery();

    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

/**
 * hook to get advisor profile data
 */
export const useGetAdvisorProfile = <T>(
  queryOptions?: QueryArgs<GetAdvisorProfileData, T>
) => {
  return useQuery({
    ...getAdvisorProfileQuery(),
    ...queryOptions,
  });
};

export default useGetAdvisorProfile;
