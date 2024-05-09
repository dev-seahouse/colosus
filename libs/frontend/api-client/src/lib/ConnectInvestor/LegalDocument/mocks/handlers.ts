import { rest } from 'msw';
import type { ConnectInvestorGetDocumentsResponseDto } from '../LegalDocument';

const BASE_URL = 'http://localhost:9000/api/v1/connect/investor/legal-document';

export const connectInvestorLegalDocumentApiHandler = [
  rest.get(BASE_URL, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<ConnectInvestorGetDocumentsResponseDto>({
        privacyPolicyUrl: 'some-pdf.pdf',
        termsAndConditionsUrl: 'some-pdf.pdf',
      })
    );
  }),
];
