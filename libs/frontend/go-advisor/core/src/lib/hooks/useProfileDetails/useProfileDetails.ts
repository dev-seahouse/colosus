import { useQuery } from '@tanstack/react-query';
import { ConnectAdvisorProfileApi } from '@bambu/api-client';
import type { ConnectAdvisorGetProfileResponseDto } from '@bambu/api-client';
import type { QueryClient } from '@tanstack/react-query';

export type GetProfileDetailsData = ConnectAdvisorGetProfileResponseDto;

export const getProfileDetailsQuery = () => ({
  queryKey: ['getProfileDetails'],
  queryFn: async () => {
    const connectAdvisorProfileApi = new ConnectAdvisorProfileApi();
    const res = await connectAdvisorProfileApi.getProfile();

    return res.data;
  },
});

export const getProfileDetailsLoader =
  (queryClient: QueryClient) => async (): Promise<GetProfileDetailsData> => {
    const query = getProfileDetailsQuery();

    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export interface UseProfileDetailsOptions {
  initialData?: Partial<GetProfileDetailsData>;
}
export function useProfileDetails({
  initialData,
}: UseProfileDetailsOptions = {}) {
  return useQuery({
    ...getProfileDetailsQuery(),
    initialData,
  });
}

export default useProfileDetails;
