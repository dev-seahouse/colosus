import { useQuery } from '@tanstack/react-query';
import { ConnectAdvisorBrandAndSubdomainApi } from '@bambu/api-client';
import type { ConnectAdvisorGetBrandAndSubdomainResponseDto } from '@bambu/api-client';
import type { QueryClient } from '@tanstack/react-query';

export type GetSubdomainData = ConnectAdvisorGetBrandAndSubdomainResponseDto;

export const getSubdomainQuery = () => ({
  queryKey: ['getSubdomain'],
  queryFn: async () => {
    const connectAdvisorBrandAndSubdomainApi =
      new ConnectAdvisorBrandAndSubdomainApi();
    const res = await connectAdvisorBrandAndSubdomainApi.getSubdomain();

    return res.data;
  },
});

export const getSubdomainLoader =
  (queryClient: QueryClient) => async (): Promise<GetSubdomainData> => {
    const query = getSubdomainQuery();

    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export interface UseGetSubdomainOptions {
  initialData?: Partial<GetSubdomainData>;
}
export function useGetSubdomain({ initialData }: UseGetSubdomainOptions = {}) {
  return useQuery({
    ...getSubdomainQuery(),
    initialData,
  });
}

export default useGetSubdomain;
