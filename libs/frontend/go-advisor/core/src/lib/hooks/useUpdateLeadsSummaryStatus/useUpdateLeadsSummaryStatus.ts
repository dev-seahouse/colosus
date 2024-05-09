import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ConnectAdvisorUpdateLeadsSummaryStatusDto } from '@bambu/api-client';
import { ConnectAdvisorLeadsApi } from '@bambu/api-client';

async function updateLeadsSummaryStatus(
  args: ConnectAdvisorUpdateLeadsSummaryStatusDto
) {
  const connectAdvisorLeadsApi = new ConnectAdvisorLeadsApi();
  const res = await connectAdvisorLeadsApi.updateLeadsStatus(args);
  return res.data;
}

// Wip - update ui (table & details drawer) after successful mutation
export function useUpdateLeadsSummaryStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLeadsSummaryStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getLeads'] }),
  });
}

export default useUpdateLeadsSummaryStatus;
