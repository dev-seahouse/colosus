import type {
  TenantBrandingDto,
  ConnectLegalDocumentsDto,
} from '@bambu/shared';
import ConnectAdvisorBasePrivateApi from '../_Base/Base';

export interface ConnectAdvisorUploadDocumentRequestDto {
  document: FormData;
  documentType: 'PRIVACY_POLICY' | 'TERMS_AND_CONDITIONS';
}

export type ConnectAdvisorGetDocumentsResponseDto =
  ConnectLegalDocumentsDto.IConnectLegalDocumentsDto;

export class ConnectAdvisorLegalDocumentApi extends ConnectAdvisorBasePrivateApi {
  constructor(private readonly apiPath = '/legal-document') {
    super();
  }

  public async getLegalDocuments() {
    return this.axios.get<ConnectAdvisorGetDocumentsResponseDto>(this.apiPath);
  }

  /**
   * Set a legal document..
   * - {@link http://localhost:9000/openapi#/Connect%20Advisor/SetLegalDocument}
   */
  public async uploadDocument(req: ConnectAdvisorUploadDocumentRequestDto) {
    return this.axios.post(
      `${this.apiPath}?documentType=${req.documentType}`,
      req.document,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }
}

export default ConnectAdvisorLegalDocumentApi;
