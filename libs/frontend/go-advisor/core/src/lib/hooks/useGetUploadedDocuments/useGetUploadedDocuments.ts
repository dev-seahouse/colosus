import { useQuery } from '@tanstack/react-query';
import { ConnectAdvisorLegalDocumentApi } from '@bambu/api-client';
import type { ConnectAdvisorGetDocumentsResponseDto } from '@bambu/api-client';
import type { QueryClient } from '@tanstack/react-query';

export type GetUploadedDocumentsData = ConnectAdvisorGetDocumentsResponseDto;

export const getUploadedDocumentsQuery = () => ({
  queryKey: ['getUploadedDocuments'],
  queryFn: async () => {
    const connectAdvisorLegalDocumentApi = new ConnectAdvisorLegalDocumentApi();

    const res = await connectAdvisorLegalDocumentApi.getLegalDocuments();

    return res.data;
  },
});

export const getUploadedDocumentsLoader =
  (queryClient: QueryClient) => async (): Promise<GetUploadedDocumentsData> => {
    const query = getUploadedDocumentsQuery();

    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export interface UseGetUploadedDocumentsOptions {
  initialData?: Partial<GetUploadedDocumentsData>;
}
export function useGetUploadedDocuments({
  initialData,
}: UseGetUploadedDocumentsOptions = {}) {
  return useQuery({
    ...getUploadedDocumentsQuery(),
    initialData,
  });
}

export default useGetUploadedDocuments;
