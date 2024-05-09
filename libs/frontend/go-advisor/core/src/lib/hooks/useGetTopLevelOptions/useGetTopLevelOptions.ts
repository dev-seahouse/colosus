import { useQuery } from '@tanstack/react-query';
import { ConnectAdvisorTopLevelOptionsApi } from '@bambu/api-client';
import type { ConnectAdvisorGetTopLevelOptionsResponseDto } from '@bambu/api-client';
import type { QueryClient } from '@tanstack/react-query';

export type GetTopLevelOptionsData =
  ConnectAdvisorGetTopLevelOptionsResponseDto;

export const getTopLevelOptionsQuery = () => ({
  queryKey: ['getTopLevelOptions'],
  queryFn: async () => {
    const connectAdvisorTopLevelOptionsApi =
      new ConnectAdvisorTopLevelOptionsApi();

    const res = await connectAdvisorTopLevelOptionsApi.getTopLevelOptions();

    return res.data;
  },
});

export const getTopLevelOptionsLoader =
  (queryClient: QueryClient) => async (): Promise<GetTopLevelOptionsData> => {
    const query = getTopLevelOptionsQuery();

    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export interface UseGetTopLevelOptionsOptions {
  initialData?: Partial<GetTopLevelOptionsData>;
}
export function useGetTopLevelOptions({
  initialData,
}: UseGetTopLevelOptionsOptions = {}) {
  return useQuery({
    ...getTopLevelOptionsQuery(),
    initialData,
  });
}

export default useGetTopLevelOptions;
