import { useMutation } from '@tanstack/react-query';
import { ConnectAdvisorLegalDocumentApi } from '@bambu/api-client';
import type { ConnectAdvisorUploadDocumentRequestDto } from '@bambu/api-client';

export const uploadDocumentQuery = () => ({
  mutationKey: ['uploadDocument'],
  mutationFn: async (req: ConnectAdvisorUploadDocumentRequestDto) => {
    const connectAdvisorLegalDocumentApi = new ConnectAdvisorLegalDocumentApi();
    const res = await connectAdvisorLegalDocumentApi.uploadDocument(req);

    return res.data;
  },
});

export interface UseUploadDocumentOptions {
  onSuccess?: () => void;
}

/**
 * query hook to upload tenant document
 */
export function useUploadDocument({
  onSuccess,
}: UseUploadDocumentOptions = {}) {
  return useMutation(
    uploadDocumentQuery().mutationKey,
    uploadDocumentQuery().mutationFn,
    { onSuccess }
  );
}

export default useUploadDocument;
