import type { InvestorBrokerageDirectDebitMandateGetPdfPreviewRequestDto } from '@bambu/api-client';
import { TransactInvestorAuthenticatedBrokerageApi } from '@bambu/api-client';
import type { QueryArgs } from '@bambu/go-core';
import { useQuery } from '@tanstack/react-query';

export const getDirectDebitMandatePdfPreviewQuery = (
  args: InvestorBrokerageDirectDebitMandateGetPdfPreviewRequestDto
) => ({
  queryKey: ['getDirectDebitMandatePdfPreview', args],
  queryFn: async () => fetchAndParsePreviewPdf(args),
  retryOnWindowFocus: false,
  retry: true,
  retryDelay: 3000,
});

type PdfPreviewRes = {
  fileName: string;
  dataUrl: string;
};

export function useGetDirectDebitMandatePdfPreview(
  requestArgs: InvestorBrokerageDirectDebitMandateGetPdfPreviewRequestDto,
  queryOptions?: QueryArgs<PdfPreviewRes>
) {
  return useQuery({
    ...getDirectDebitMandatePdfPreviewQuery(requestArgs),
    ...queryOptions,
  });
}

export default useGetDirectDebitMandatePdfPreview;

async function fetchAndParsePreviewPdf(
  args: InvestorBrokerageDirectDebitMandateGetPdfPreviewRequestDto
): Promise<PdfPreviewRes> {
  const api = new TransactInvestorAuthenticatedBrokerageApi();
  const res = await api.getDirectDebitMandatePdfPreview(args);
  const fileName = `direct-debit-mandate.pdf`;
  const dataUrl = window.URL.createObjectURL(
    new Blob([res.data], { type: 'application/pdf' })
  );
  return {
    fileName,
    dataUrl,
  };
}
