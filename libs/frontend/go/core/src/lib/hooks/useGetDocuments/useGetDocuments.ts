import { QueryClient, useQuery } from '@tanstack/react-query';
import { ConnectInvestorLegalDocumentApi } from '@bambu/api-client';
import type { ConnectInvestorGetDocumentsResponseDto } from '@bambu/api-client';

export type GetDocumentsData = ConnectInvestorGetDocumentsResponseDto;

export const getDocumentsQuery = () => ({
  queryKey: ['getDocuments'],
  queryFn: async () => {
    const connectInvestorLegalDocumentApi =
      new ConnectInvestorLegalDocumentApi();
    const res = await connectInvestorLegalDocumentApi.getLegalDocuments();

    return res.data;
  },
  staleTime: Infinity,
});

export const getDocumentsLoader =
  (queryClient: QueryClient) => async (): Promise<GetDocumentsData> => {
    const query = getDocumentsQuery();

    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export interface UseGetDocumentsOptions {
  initialData?: GetDocumentsData;
}

/**
 * hook to get tenant documents data
 */
export const useGetDocuments = ({
  initialData,
}: UseGetDocumentsOptions = {}) => {
  return useQuery({ ...getDocumentsQuery(), initialData });
};

export default useGetDocuments;
