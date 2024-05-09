import { useMutation } from '@tanstack/react-query';
import { ConnectAdvisorProfileBioApi } from '@bambu/api-client';
import type { ConnectAdvisorUpdateProfileSummaryContentRequestDto } from '@bambu/api-client';

export const updateProfileSummaryQuery = () => ({
  mutationKey: ['updateProfileSummary'],
  mutationFn: async (
    req: ConnectAdvisorUpdateProfileSummaryContentRequestDto
  ) => {
    const connectAdvisorProfileBioApi = new ConnectAdvisorProfileBioApi();
    const res = await connectAdvisorProfileBioApi.updateProfileSummaryContent(
      req
    );

    return res.data;
  },
});

export interface UseUpdateProfileSummaryOptions {
  onSuccess?: () => void;
}

/**
 * query hook to update profile summary
 */
export function useUpdateProfileSummary({
  onSuccess,
}: UseUpdateProfileSummaryOptions = {}) {
  return useMutation(
    updateProfileSummaryQuery().mutationKey,
    updateProfileSummaryQuery().mutationFn,
    { onSuccess }
  );
}

export default useUpdateProfileSummary;
