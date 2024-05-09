import type { QueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type {
  ConnectAdvisorGetLeadsResponseDto,
  ConnectAdvisorGetLeadsRequestDto,
} from '@bambu/api-client';
import { LEADS_TYPES } from '@bambu/api-client';
import { ConnectAdvisorLeadsApi } from '@bambu/api-client';

export type QueryKeys = Array<string | ConnectAdvisorGetLeadsRequestDto>;

export function getLeadsQuery(args: ConnectAdvisorGetLeadsRequestDto) {
  return {
    queryKey: ['getLeads', args], // caching based on arguments
    queryFn: () => fetchLeads(args),
    keepPreviousData: true,
  };
}

export function useGetLeads<
  TQueryReturnData = ConnectAdvisorGetLeadsResponseDto
>(
  args: ConnectAdvisorGetLeadsRequestDto,
  options?: Omit<
    UseQueryOptions<
      ConnectAdvisorGetLeadsResponseDto,
      unknown,
      TQueryReturnData,
      QueryKeys
    >,
    'queryFn'
  >
) {
  return useQuery({
    ...getLeadsQuery(args),
    ...options,
  });
}

export function getLeadsLoader(queryClient: QueryClient) {
  return async () => {
    const DEFAULT_ARG = {
      pageIndex: 0,
      pageSize: 10,
      nameFilter: '',
      qualifiedFilter: LEADS_TYPES.QUALIFIED,
    };

    const query = getLeadsQuery(DEFAULT_ARG);
    return (
      // return data or fetch it
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };
}

// helpers
async function fetchLeads(args: ConnectAdvisorGetLeadsRequestDto) {
  const connectAdvisorLeadsApi = new ConnectAdvisorLeadsApi();
  const res = await connectAdvisorLeadsApi.getLeads(args);
  return res.data;
}

export default useGetLeads;
