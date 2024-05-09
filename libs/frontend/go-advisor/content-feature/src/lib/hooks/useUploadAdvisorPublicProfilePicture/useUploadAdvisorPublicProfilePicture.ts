import { useMutation } from '@tanstack/react-query';
import { ConnectAdvisorProfileApi } from '@bambu/api-client';

export const uploadAdvisorPublicProfilePictureQuery = () => ({
  mutationKey: ['uploadAdvisorPublicProfilePicture'],
  mutationFn: async (req: FormData) => {
    const connectAdvisorProfileApi = new ConnectAdvisorProfileApi();
    const res =
      await connectAdvisorProfileApi.uploadAdvisorPublicProfilePicture(req);

    return res.data;
  },
});

export interface UseUploadAdvisorPublicProfilePictureOptions {
  onSuccess?: () => void;
}

/**
 * query hook to upload advisor public profile picture
 */
export function useUploadAdvisorPublicProfilePicture({
  onSuccess,
}: UseUploadAdvisorPublicProfilePictureOptions = {}) {
  return useMutation(
    uploadAdvisorPublicProfilePictureQuery().mutationKey,
    uploadAdvisorPublicProfilePictureQuery().mutationFn,
    { onSuccess }
  );
}

export default useUploadAdvisorPublicProfilePicture;
