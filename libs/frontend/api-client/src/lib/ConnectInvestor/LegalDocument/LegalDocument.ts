import type { ConnectLegalDocumentsDto } from '@bambu/shared';
import ConnectInvestorBaseApi from '../_Base/Base';

export type ConnectInvestorGetDocumentsResponseDto =
  ConnectLegalDocumentsDto.IConnectLegalDocumentsDto;

export class ConnectInvestorLegalDocumentApi extends ConnectInvestorBaseApi {
  constructor(private readonly apiPath = '/legal-document') {
    super();
  }

  public async getLegalDocuments() {
    return this.axios.get<ConnectInvestorGetDocumentsResponseDto>(this.apiPath);
  }
}

export default ConnectInvestorLegalDocumentApi;
