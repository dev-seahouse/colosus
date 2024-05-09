import { rest } from 'msw';
import type {
  ConnectAdvisorUploadDocumentRequestDto,
  ConnectAdvisorGetDocumentsResponseDto,
} from '../LegalDocument';

const BASE_URL = 'http://localhost:9000/api/v1/connect/advisor/legal-document';

export const connectAdvisorLegalDocumentApiHandler = [
  rest.get(BASE_URL, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<ConnectAdvisorGetDocumentsResponseDto>({
        privacyPolicyUrl: 'some-pdf.pdf',
        termsAndConditionsUrl: 'some-pdf.pdf',
      })
    );
  }),
  rest.post<ConnectAdvisorUploadDocumentRequestDto, any, null>(
    BASE_URL,
    (req, res, ctx) => {
      return res(ctx.status(204));
    }
  ),
];
