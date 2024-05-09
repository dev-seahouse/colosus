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
  ConnectTenantCentralDbRepositoryService,
  TenantBrandingCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { TenantBrandingService } from './tenant-branding.service';
import { TenantBrandingServiceBase } from './tenant-branding.service.base';

describe('TenantBrandingService', () => {
  let service: TenantBrandingServiceBase;

  const blobRepositoryServiceBaseMock: DeepMockProxy<BlobRepositoryServiceBase> =
    mockDeep<BlobRepositoryServiceBase>();
  const ConnectTenantCentralDbRepositoryServiceMock: DeepMockProxy<ConnectTenantCentralDbRepositoryService> =
    mockDeep<ConnectTenantCentralDbRepositoryService>();

  const tenantBrandingCentralDbRepositoryServiceMock: DeepMockProxy<TenantBrandingCentralDbRepositoryService> =
    mockDeep<TenantBrandingCentralDbRepositoryService>();

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
          provide: TenantBrandingCentralDbRepositoryService,
          useFactory: () => {
            return tenantBrandingCentralDbRepositoryServiceMock;
          },
        },
        {
          provide: ConnectTenantCentralDbRepositoryService,
          useFactory: () => {
            return ConnectTenantCentralDbRepositoryServiceMock;
          },
        },
        {
          provide: TenantBrandingServiceBase,
          useClass: TenantBrandingService,
        },
      ],
    }).compile();
    service = module.get<TenantBrandingServiceBase>(TenantBrandingServiceBase);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetBranding', () => {
    it('should have GetBranding defined', () => {
      expect(service.GetBranding).toBeDefined();
    });

    it('should return null if no logo url is present', async () => {
      jest.clearAllMocks();
      tenantBrandingCentralDbRepositoryServiceMock.GetTenantBranding.mockResolvedValueOnce(
        {
          logoUrl: null,
          headerBgColor: null,
          brandColor: null,
          tradeName: null,
        }
      );
      const result = await service.GetBranding({ tenantId: '1234455' });
      expect(result).toBeDefined();
      expect(result.logoUrl).toBeNull();
    });
    it('should return logo url for tenants who uploaded', async () => {
      const currentEnvVarValue =
        process.env.AZURE_STORAGE_ADVISOR_PUBLIC_ASSETS_PUBLIC_BASE_URL;
      process.env.AZURE_STORAGE_ADVISOR_PUBLIC_ASSETS_PUBLIC_BASE_URL =
        'https://test-cdn.com';

      const commonLogoUrlPath = 'tenant-branding/logo.png';
      const commonLogoUrl = `http://test.com/${commonLogoUrlPath}`;
      const logoUrlCdn = `${process.env.AZURE_STORAGE_ADVISOR_PUBLIC_ASSETS_PUBLIC_BASE_URL}/${commonLogoUrlPath}`;

      jest.clearAllMocks();
      tenantBrandingCentralDbRepositoryServiceMock.GetTenantBranding.mockResolvedValue(
        {
          logoUrl: commonLogoUrl,
          headerBgColor: null,
          brandColor: null,
          tradeName: null,
        }
      );
      const result = await service.GetBranding({ tenantId: '12344' });
      expect(result).toBeDefined();
      expect(result.logoUrl).not.toBeNull();
      expect(result.logoUrl).toBe(logoUrlCdn);

      process.env.AZURE_STORAGE_ADVISOR_PUBLIC_ASSETS_PUBLIC_BASE_URL =
        currentEnvVarValue;
    });
  });
});
