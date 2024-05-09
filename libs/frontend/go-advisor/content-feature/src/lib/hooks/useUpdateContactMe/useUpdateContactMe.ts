import { useMutation } from '@tanstack/react-query';
import { ConnectAdvisorContactMeApi } from '@bambu/api-client';
import type { ConnectAdvisorUpdateContactMeContentRequestDto } from '@bambu/api-client';

export const updateContactMeQuery = () => ({
  mutationKey: ['updateContactMe'],
  mutationFn: async (req: ConnectAdvisorUpdateContactMeContentRequestDto) => {
    const connectAdvisorContactMeApi = new ConnectAdvisorContactMeApi();
    const res = await connectAdvisorContactMeApi.updateContactMeContent(req);

    return res.data;
  },
});

export interface UseUpdateContactMeOptions {
  onSuccess?: () => void;
}

/**
 * query hook to update contact me
 */
export function useUpdateContactMe({
  onSuccess,
}: UseUpdateContactMeOptions = {}) {
  return useMutation(
    updateContactMeQuery().mutationKey,
    updateContactMeQuery().mutationFn,
    { onSuccess }
  );
}

export default useUpdateContactMe;
