import type { ConnectAdvisorUpdatePreferencesRequestDto } from '@bambu/api-client';
import { ConnectAdvisorPreferencesApi } from '@bambu/api-client';
import { getPreferencesQuery } from '../useGetPreferences/useGetPreferences';
import { useMutation, useQueryClient } from '@tanstack/react-query';
async function updatePreferences(
  req: ConnectAdvisorUpdatePreferencesRequestDto
) {
  const connectAdvisorUpdatePreferencesApi = new ConnectAdvisorPreferencesApi();
  const res = await connectAdvisorUpdatePreferencesApi.updatePreferences(req);
  return res.data;
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePreferences,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: getPreferencesQuery().queryKey,
      });
    },
  });
}

export default useUpdatePreferences;
