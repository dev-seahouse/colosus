// noinspection ES6PreferShortImport

import { generateCDNUrl } from '@bambu/server-core/configuration';
import { Enums } from '@bambu/server-core/constants';
import { IColossusTrackingDto } from '@bambu/server-core/dto';
import {
  BlobRepositoryServiceBase,
  LegalDocumentSetCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import { LoggingUtils } from '@bambu/server-core/utilities';
// import { ConnectLegalDocumentsDto } from '@bambu/shared';
// noinspection ES6PreferShortImport
import { Injectable, Logger } from '@nestjs/common';
import { LegalDocumentsEnum } from './legal-documents.enum';
import {
  ISetLegalDocumentOpts,
  LegalDocumentsServiceBase,
  IConnectLegalDocumentsDto,
  IUnsetLegalDocumentOpts,
} from './legal-documents.service.base';

@Injectable()
export class LegalDocumentsService implements LegalDocumentsServiceBase {
  readonly #logger = new Logger(LegalDocumentsService.name);

  constructor(
    private readonly blobRepository: BlobRepositoryServiceBase,
    private readonly legalDocumentSetCentralDbRepository: LegalDocumentSetCentralDbRepositoryService
  ) {}

  async GetLegalDocumentSet(
    tenantId: string,
    tracking?: IColossusTrackingDto
  ): Promise<IConnectLegalDocumentsDto> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetLegalDocumentSet.name,
      tracking?.requestId
        ? tracking?.requestId
        : `Request from ${this.GetLegalDocumentSet.name} without request id.`
    );
    try {
      const legalDocumentSet =
        await this.legalDocumentSetCentralDbRepository.GetLegalDocumentSet({
          tenantId,
        });

      return {
        privacyPolicyUrl: ((): string | null => {
          if (
            legalDocumentSet?.privacyPolicyUrl &&
            typeof legalDocumentSet?.privacyPolicyUrl === 'string' &&
            legalDocumentSet?.privacyPolicyUrl?.trim().length > 0
          ) {
            const extractPrivacyPolicyFileName =
              legalDocumentSet.privacyPolicyUrl.substring(
                legalDocumentSet.privacyPolicyUrl.indexOf('/documents')
              );
            return generateCDNUrl(extractPrivacyPolicyFileName) as string;
          }

          return null;
        })(),
        termsAndConditionsUrl: ((): string | null => {
          if (
            legalDocumentSet?.termsAndConditionsUrl &&
            typeof legalDocumentSet?.termsAndConditionsUrl === 'string' &&
            legalDocumentSet?.termsAndConditionsUrl?.trim().length > 0
          ) {
            const extractTermsAndConditionFileName =
              legalDocumentSet.termsAndConditionsUrl.substring(
                legalDocumentSet.termsAndConditionsUrl.indexOf('/documents')
              );
            return generateCDNUrl(extractTermsAndConditionFileName) as string;
          }

          return null;
        })(),
      };
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error getting legal document set from tenant id: ${error}`
      );
      throw error;
    }
  }

  async SetLegalDocument({
    tenantId,
    documentType,
    filePath,
    originalFilename,
    contentType,
    tracking,
  }: ISetLegalDocumentOpts): Promise<void> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.SetLegalDocument.name,
      tracking.requestId
    );
    try {
      const before =
        await this.legalDocumentSetCentralDbRepository.GetLegalDocumentSet({
          tenantId,
        });
      const documentUrl =
        await this.blobRepository.CreatePublicBlobFromLocalFile(
          filePath,
          contentType,
          Enums.FileUpload.Paths.DOCUMENTS,
          originalFilename
        );
      const documentUrls = {
        privacyPolicyUrl: null,
        termsAndConditionsUrl: null,
        ...before,
        ...(documentType === LegalDocumentsEnum.PRIVACY_POLICY
          ? { privacyPolicyUrl: documentUrl }
          : {}),
        ...(documentType === LegalDocumentsEnum.TERMS_AND_CONDITIONS
          ? { termsAndConditionsUrl: documentUrl }
          : {}),
      };
      await this.legalDocumentSetCentralDbRepository.AppendLegalDocumentSet({
        tenantId,
        documentUrls,
        tracking,
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error getting tenant id from tenant name: ${error}.`
      );
      throw error;
    }
  }

  async UnsetLegalDocument({
    tenantId,
    documentType,
    tracking,
  }: ISetLegalDocumentOpts): Promise<void> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.UnsetLegalDocument.name,
      tracking.requestId
    );
    try {
      const before =
        await this.legalDocumentSetCentralDbRepository.GetLegalDocumentSet({
          tenantId,
        });
      const documentUrls = {
        ...before,
        ...(documentType === LegalDocumentsEnum.PRIVACY_POLICY
          ? { privacyPolicyUrl: null }
          : {}),
        ...(documentType === LegalDocumentsEnum.TERMS_AND_CONDITIONS
          ? { termsAndConditionsUrl: null }
          : {}),
      };
      await this.legalDocumentSetCentralDbRepository.AppendLegalDocumentSet({
        tenantId,
        documentUrls,
        tracking,
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error getting tenant id from tenant name: ${error}.`
      );
      throw error;
    }
  }
}
