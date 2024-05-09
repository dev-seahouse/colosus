// noinspection ES6PreferShortImport

process.env.STRIPE_SECRET_KEY = 'STRIPE_SECRET_KEY';
process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET = 'STRIPE_WEBHOOK_ENDPOINT_SECRET';
process.env.AZURE_STORAGE_CONNECTION_STRING = 'stub for testing';
process.env.AZURE_STORAGE_PUBLIC_SYSTEM_ASSETS_PUBLIC_BASE_URL =
  'stub for testing';
process.env.AZURE_STORAGE_ADVISOR_PUBLIC_ASSETS_PUBLIC_BASE_URL =
  'stub for testing';

import {
  BlobRepositoryServiceBase,
  LegalDocumentSetCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import { Test, TestingModule } from '@nestjs/testing';
import * as crypto from 'crypto';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { LegalDocumentsService } from './legal-documents.service';
import { LegalDocumentsServiceBase } from './legal-documents.service.base';

describe('LegalDocumentsService', () => {
  let service: LegalDocumentsServiceBase;
  const blobRepositoryServiceBaseMock: DeepMockProxy<BlobRepositoryServiceBase> =
    mockDeep<BlobRepositoryServiceBase>();
  const legalDocumentSetCentralDbRepositoryServiceMock: DeepMockProxy<LegalDocumentSetCentralDbRepositoryService> =
    mockDeep<LegalDocumentSetCentralDbRepositoryService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BlobRepositoryServiceBase,
          useFactory: () => {
            return blobRepositoryServiceBaseMock;
          },
        },
        {
          provide: LegalDocumentSetCentralDbRepositoryService,
          useFactory: () => {
            return legalDocumentSetCentralDbRepositoryServiceMock;
          },
        },
        {
          provide: LegalDocumentsServiceBase,
          useClass: LegalDocumentsService,
        },
      ],
    }).compile();

    service = module.get<LegalDocumentsServiceBase>(LegalDocumentsServiceBase);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetLegalDocumentSet', () => {
    it('should have GetLegalDocumentSet defined', () => {
      expect(service.GetLegalDocumentSet).toBeDefined();
    });

    it('should return null for tenants who did not upload documents', async () => {
      jest.clearAllMocks();
      legalDocumentSetCentralDbRepositoryServiceMock.GetLegalDocumentSet.mockResolvedValueOnce(
        {
          privacyPolicyUrl: null,
          termsAndConditionsUrl: null,
        }
      );

      const result = await service.GetLegalDocumentSet('tenantId', {
        requestId: crypto.randomUUID(),
        requesterId: crypto.randomUUID(),
      });

      expect(result).toBeDefined();
      expect(result.privacyPolicyUrl).toBeNull();
      expect(result.termsAndConditionsUrl).toBeNull();
    });

    it('should return URLs for legal documents set for tenants that uploaded', async () => {
      // get current environment variable(s)
      const currentEnvVarValue =
        process.env.AZURE_STORAGE_ADVISOR_PUBLIC_ASSETS_PUBLIC_BASE_URL;
      // set environment variable(s)
      process.env.AZURE_STORAGE_ADVISOR_PUBLIC_ASSETS_PUBLIC_BASE_URL =
        'https://test-cdn.com';

      const commonPrivacyPolicyUrlPath = 'documents/privacyPolicyUrl.pdf';
      const privacyPolicyUrl = `https://test.com/${commonPrivacyPolicyUrlPath}`;
      const cdnPrivacyPolicyUrl = `${process.env.AZURE_STORAGE_ADVISOR_PUBLIC_ASSETS_PUBLIC_BASE_URL}/${commonPrivacyPolicyUrlPath}`;

      const commonTermsAndConditionsUrlPath =
        'documents/termsAndConditionsUrl.pdf';
      const termsAndConditionsUrl = `https://test.com/${commonTermsAndConditionsUrlPath}`;
      const cdnTermsAndConditionsUrl = `${process.env.AZURE_STORAGE_ADVISOR_PUBLIC_ASSETS_PUBLIC_BASE_URL}/${commonTermsAndConditionsUrlPath}`;

      jest.clearAllMocks();
      legalDocumentSetCentralDbRepositoryServiceMock.GetLegalDocumentSet.mockResolvedValueOnce(
        {
          privacyPolicyUrl,
          termsAndConditionsUrl,
        }
      );

      const result = await service.GetLegalDocumentSet('tenantId', {
        requestId: crypto.randomUUID(),
        requesterId: crypto.randomUUID(),
      });

      expect(result).toBeDefined();

      expect(result.privacyPolicyUrl).not.toBeNull();
      expect(result.privacyPolicyUrl).not.toBe(privacyPolicyUrl);
      expect(result.privacyPolicyUrl).toBe(cdnPrivacyPolicyUrl);

      expect(result.termsAndConditionsUrl).not.toBeNull();
      expect(result.termsAndConditionsUrl).not.toBe(termsAndConditionsUrl);
      expect(result.termsAndConditionsUrl).toBe(cdnTermsAndConditionsUrl);

      process.env.AZURE_STORAGE_ADVISOR_PUBLIC_ASSETS_PUBLIC_BASE_URL =
        currentEnvVarValue;
    });
  });
});
