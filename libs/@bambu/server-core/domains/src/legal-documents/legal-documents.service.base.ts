import { IColossusTrackingDto } from '@bambu/server-core/dto';
import { LegalDocumentsEnum } from './legal-documents.enum';

export interface IConnectLegalDocumentsDto {
  privacyPolicyUrl: string | null;
  termsAndConditionsUrl: string | null;
}

export interface ISetLegalDocumentOpts {
  tenantId: string;
  documentType: LegalDocumentsEnum;
  filePath: string;
  originalFilename: string;
  contentType: string;
  tracking?: IColossusTrackingDto;
}

export interface IUnsetLegalDocumentOpts {
  tenantId: string;
  documentType: LegalDocumentsEnum;
  tracking?: IColossusTrackingDto;
}

export abstract class LegalDocumentsServiceBase {
  abstract GetLegalDocumentSet(
    tenantId: string,
    tracking: IColossusTrackingDto
  ): Promise<IConnectLegalDocumentsDto>;
  abstract SetLegalDocument(params: ISetLegalDocumentOpts): Promise<void>;
  abstract UnsetLegalDocument(params: IUnsetLegalDocumentOpts): Promise<void>;
}
