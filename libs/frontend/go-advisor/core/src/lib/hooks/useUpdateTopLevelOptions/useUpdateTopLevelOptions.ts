import type { ConnectAdvisorUpdateTopLevelOptionsRequestDto } from '@bambu/api-client';
import { ConnectAdvisorTopLevelOptionsApi } from '@bambu/api-client';
import { getTopLevelOptionsQuery } from '../useGetTopLevelOptions/useGetTopLevelOptions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
async function updateTopLevelOptions(
  req: ConnectAdvisorUpdateTopLevelOptionsRequestDto
) {
  const connectAdvisorUpdateTopLevelOptionsApi =
    new ConnectAdvisorTopLevelOptionsApi();
  const res =
    await connectAdvisorUpdateTopLevelOptionsApi.updateTopLevelOptions(req);
  return res.data;
}

export function useUpdateTopLevelOptions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTopLevelOptions,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: getTopLevelOptionsQuery().queryKey,
      });
    },
  });
}

export default useUpdateTopLevelOptions;
