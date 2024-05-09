import { useQuery } from '@tanstack/react-query';
import type { GetLeadsSummaryByIdType } from '@bambu/api-client';
import { ConnectAdvisorLeadsApi } from '@bambu/api-client';

export function getLeadsSummaryByIdQuery(args: GetLeadsSummaryByIdType) {
  return {
    queryKey: ['getLeads', args], // caching based on arguments
    queryFn: () => fetchLeadsSummary(args),
    keepPreviousData: true,
  };
}
export function useGetLeadsSummaryById(args: GetLeadsSummaryByIdType) {
  return useQuery({
    ...getLeadsSummaryByIdQuery(args),
  });
}

async function fetchLeadsSummary(args: GetLeadsSummaryByIdType) {
  const connectAdvisorLeadsApi = new ConnectAdvisorLeadsApi();
  const res = await connectAdvisorLeadsApi.getLeadsSummaryById(args);
  return res.data;
}
