import { useMutation } from '@tanstack/react-query';
import { ConnectAdvisorProfileApi } from '@bambu/api-client';

export const deleteAdvisorPublicProfilePicture = () => ({
  mutationKey: ['deleteAdvisorPublicProfilePicture'],
  mutationFn: async () => {
    const connectAdvisorProfileApi = new ConnectAdvisorProfileApi();
    const res =
      await connectAdvisorProfileApi.deleteAdvisorPublicProfilePicture();

    return res.data;
  },
});

export interface UseDeleteAdvisorPublicProfilePictureOptions {
  onSuccess?: () => void;
}

/**
 * query hook to delete advisor public profile picture
 */
export function useDeleteAdvisorPublicProfilePictureOptions({
  onSuccess,
}: UseDeleteAdvisorPublicProfilePictureOptions = {}) {
  return useMutation(
    deleteAdvisorPublicProfilePicture().mutationKey,
    deleteAdvisorPublicProfilePicture().mutationFn,
    { onSuccess }
  );
}

export default useDeleteAdvisorPublicProfilePictureOptions;
