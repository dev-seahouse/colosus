import { useMutation } from '@tanstack/react-query';
import { ConnectAdvisorProfileApi } from '@bambu/api-client';

export const deleteAdvisorInternalProfilePicture = () => ({
  mutationKey: ['deleteAdvisorInternalProfilePicture'],
  mutationFn: async () => {
    const connectAdvisorProfileApi = new ConnectAdvisorProfileApi();
    const res =
      await connectAdvisorProfileApi.deleteAdvisorInternalProfilePicture();

    return res.data;
  },
});

export interface UseDeleteAdvisorInternalProfilePictureOptions {
  onSuccess?: () => void;
}

/**
 * query hook to delete advisor internal profile picture
 */
export function useDeleteAdvisorInternalProfilePicture({
  onSuccess,
}: UseDeleteAdvisorInternalProfilePictureOptions = {}) {
  return useMutation(
    deleteAdvisorInternalProfilePicture().mutationKey,
    deleteAdvisorInternalProfilePicture().mutationFn,
    { onSuccess }
  );
}

export default useDeleteAdvisorInternalProfilePicture;
