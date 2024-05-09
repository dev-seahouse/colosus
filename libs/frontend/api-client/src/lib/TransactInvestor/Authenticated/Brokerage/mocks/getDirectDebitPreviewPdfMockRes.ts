import pdf from './mockPdf.pdf';

export const getDirectDebitPreviewPdfMockRes = new Blob([pdf], {
  type: 'application/pdf',
});
