import { useMutation } from '@tanstack/react-query';
import { ConnectAdvisorProfileApi } from '@bambu/api-client';
import type { ConnectAdvisorUpdateProfileRequestDto } from '@bambu/api-client';

export const updateProfileDetailsQuery = () => ({
  mutationKey: ['updateProfileDetails'],
  mutationFn: async (req: ConnectAdvisorUpdateProfileRequestDto) => {
    const connectAdvisorProfileApi = new ConnectAdvisorProfileApi();
    const res = await connectAdvisorProfileApi.updateProfile(req);

    return res.data;
  },
});

export interface UseUpdateProfileDetailsOptions {
  onSuccess?: () => void;
}

export function useUpdateProfileDetails({
  onSuccess,
}: UseUpdateProfileDetailsOptions = {}) {
  return useMutation(
    updateProfileDetailsQuery().mutationKey,
    updateProfileDetailsQuery().mutationFn,
    { onSuccess }
  );
}

export default useUpdateProfileDetails;
