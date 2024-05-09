import { useMutation } from '@tanstack/react-query';
import { ConnectAdvisorProfileApi } from '@bambu/api-client';

export const uploadAdvisorInternalProfilePictureQuery = () => ({
  mutationKey: ['uploadAdvisorInternalProfilePicture'],
  mutationFn: async (req: FormData) => {
    const connectAdvisorProfileApi = new ConnectAdvisorProfileApi();
    const res =
      await connectAdvisorProfileApi.uploadAdvisorInternalProfilePicture(req);

    return res.data;
  },
});

export interface UseUploadAdvisorInternalProfilePictureOptions {
  onSuccess?: () => void;
}

/**
 * query hook to upload advisor internal profile picture
 */
export function useUploadAdvisorInternalProfilePicture({
  onSuccess,
}: UseUploadAdvisorInternalProfilePictureOptions = {}) {
  return useMutation(
    uploadAdvisorInternalProfilePictureQuery().mutationKey,
    uploadAdvisorInternalProfilePictureQuery().mutationFn,
    { onSuccess }
  );
}

export default useUploadAdvisorInternalProfilePicture;
