process.env.STRIPE_SECRET_KEY = 'STRIPE_SECRET_KEY';
process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET = 'STRIPE_WEBHOOK_ENDPOINT_SECRET';

import {
  FusionAuthIamUserRepositoryServiceBase,
  IamAdminRepositoryServiceBase,
  TenantCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import { Test, TestingModule } from '@nestjs/testing';
import * as crypto from 'crypto';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { IamAdminService } from './iam-admin.service';
import { IamAdminServiceBase } from './iam-admin.service.base';

describe('IamAdminService', () => {
  let service: IamAdminServiceBase;

  const iamAdminRepositoryServiceBaseMock: DeepMockProxy<IamAdminRepositoryServiceBase> =
    mockDeep<IamAdminRepositoryServiceBase>();

  const tenantCentralDbRepositoryServiceMock: DeepMockProxy<TenantCentralDbRepositoryService> =
    mockDeep<TenantCentralDbRepositoryService>();

  const fusionAuthIamUserRepositoryServiceBaseMock: DeepMockProxy<FusionAuthIamUserRepositoryServiceBase> =
    mockDeep<FusionAuthIamUserRepositoryServiceBase>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IamAdminRepositoryServiceBase,
          useValue: iamAdminRepositoryServiceBaseMock,
        },
        {
          provide: TenantCentralDbRepositoryService,
          useValue: tenantCentralDbRepositoryServiceMock,
        },
        {
          provide: FusionAuthIamUserRepositoryServiceBase,
          useValue: fusionAuthIamUserRepositoryServiceBaseMock,
        },
        {
          provide: IamAdminServiceBase,
          useClass: IamAdminService,
        },
      ],
    }).compile();

    service = module.get<IamAdminServiceBase>(IamAdminServiceBase);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('SetUserPersonalNames', () => {
    it('should throw an error if not IAM is configured', async () => {
      jest.clearAllMocks();
      tenantCentralDbRepositoryServiceMock.FindTenantById.mockResolvedValueOnce(
        {
          createdBy: 'createdBy',
          createdAt: new Date(),
          realm: 'realm',
          linkedToKeyCloak: false,
          usesIdInsteadOfRealm: true,
          updatedAt: new Date(),
          id: 'id',
          linkedToFusionAuth: false,
          updatedBy: 'updatedBy',
          apiKeys: [],
          tenantSubscriptions: [],
          branding: null,
          connectAdvisors: [],
          otps: [],
          users: [],
          httpUrls: [],
        }
      );

      try {
        await service.SetUserPersonalNames(crypto.randomUUID(), {
          firstName: 'firstName',
          userId: crypto.randomUUID(),
          lastName: 'lastName',
          realmId: crypto.randomUUID(),
        });

        // Should not get there
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBe('User realm is not linked to IAM.');
      }
    });

    it('should not throw an error if Fusion Auth IAM is configured', async () => {
      jest.clearAllMocks();
      tenantCentralDbRepositoryServiceMock.FindTenantById.mockResolvedValueOnce(
        {
          createdBy: 'createdBy',
          createdAt: new Date(),
          realm: 'realm',
          linkedToKeyCloak: false,
          usesIdInsteadOfRealm: true,
          updatedAt: new Date(),
          id: 'id',
          linkedToFusionAuth: true,
          updatedBy: 'updatedBy',
          apiKeys: [],
          tenantSubscriptions: [],
          branding: null,
          connectAdvisors: [],
          otps: [],
          users: [],
          httpUrls: [],
        }
      );

      await expect(
        service.SetUserPersonalNames(crypto.randomUUID(), {
          firstName: 'firstName',
          userId: crypto.randomUUID(),
          lastName: 'lastName',
          realmId: crypto.randomUUID(),
        })
      ).resolves.toBeUndefined();
    });

    it('should not throw an error if Key Cloak IAM is configured', async () => {
      jest.clearAllMocks();
      tenantCentralDbRepositoryServiceMock.FindTenantById.mockResolvedValueOnce(
        {
          createdBy: 'createdBy',
          createdAt: new Date(),
          realm: 'realm',
          linkedToKeyCloak: true,
          usesIdInsteadOfRealm: true,
          updatedAt: new Date(),
          id: 'id',
          linkedToFusionAuth: false,
          updatedBy: 'updatedBy',
          apiKeys: [],
          tenantSubscriptions: [],
          branding: null,
          connectAdvisors: [],
          otps: [],
          users: [],
          httpUrls: [],
        }
      );

      await expect(
        service.SetUserPersonalNames(crypto.randomUUID(), {
          firstName: 'firstName',
          userId: crypto.randomUUID(),
          lastName: 'lastName',
          realmId: crypto.randomUUID(),
        })
      ).resolves.toBeUndefined();
    });
  });
});
