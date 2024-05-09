// noinspection ES6PreferShortImport

import {
  IDefaultServerConfig,
  IKeycloakFusionAuthSwitchoverConfigDto,
  IKeycloakIntegrationConfigDto,
} from '@bambu/server-core/configuration';
import { CentralDbPrismaService } from '@bambu/server-core/db/central-db';
import { Keycloak as KcAdminClient } from '@jhanschoo/keycloak-cjs';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { IamAdminRepositoryServiceBase } from './iam-admin-repository.service.base';
import { KeycloakIamAdminRepositoryService } from './keycloak-iam-admin-repository-with-initialization.service';

describe('KeycloakIamAdminRepositoryService', () => {
  let service: IamAdminRepositoryServiceBase;

  const configMock: DeepMockProxy<ConfigService<IDefaultServerConfig>> =
    mockDeep<ConfigService<IDefaultServerConfig>>();

  const keyCloakConfigMock: DeepMockProxy<
    ConfigService<IKeycloakIntegrationConfigDto>
  > = mockDeep<ConfigService<IKeycloakIntegrationConfigDto>>();

  /**
   * Put here so that constructor logic does not fail.
   */
  keyCloakConfigMock.get.mockReturnValue({
    baseUrl: 'http://localhost:8080/auth',
  });

  const keycloakFusionAuthSwitchoverConfigMock: DeepMockProxy<
    ConfigService<IKeycloakFusionAuthSwitchoverConfigDto>
  > = mockDeep<ConfigService<IKeycloakFusionAuthSwitchoverConfigDto>>();
  const mockPrisma = mockDeep<CentralDbPrismaService>();
  const mockKcAdminClient = mockDeep<KcAdminClient>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IamAdminRepositoryServiceBase,
          useFactory: () => {
            return new KeycloakIamAdminRepositoryService(
              configMock,
              keyCloakConfigMock,
              keycloakFusionAuthSwitchoverConfigMock,
              mockPrisma
            );
          },
        },
      ],
    }).compile();

    service = module.get<IamAdminRepositoryServiceBase>(
      IamAdminRepositoryServiceBase
    );

    keyCloakConfigMock.get.mockClear();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initializeKeycloak', () => {
    it('should not throw an error if keycloak is not enabled', async () => {
      keycloakFusionAuthSwitchoverConfigMock.getOrThrow.mockReturnValueOnce(
        false
      );

      const initializeKeycloakSpy = jest.spyOn(
        service as never,
        'initializeKeycloak'
      );

      /**
       * Now before the TypeScript never any police comes screaming at me, I have to do this because
       * I need to access a private function.
       *
       * If there is a better way of doing this please let me know.
       */
      await expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (service as any).initializeKeycloak(mockKcAdminClient)
      ).resolves.not.toThrow();
      expect(initializeKeycloakSpy).toHaveBeenCalled();
    });
    it('should throw an error if keycloak is enabled but no keycloak configs are in place', async () => {
      keycloakFusionAuthSwitchoverConfigMock.getOrThrow.mockReturnValueOnce(
        true
      );

      const initializeKeycloakSpy = jest.spyOn(
        service as never,
        'initializeKeycloak'
      );

      /**
       * Now before the TypeScript never any police comes screaming at me, I have to do this because
       * I need to access a private function.
       *
       * If there is a better way of doing this please let me know.
       */
      await expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (service as any).initializeKeycloak(mockKcAdminClient)
      ).rejects.toThrow();
      expect(initializeKeycloakSpy).toHaveBeenCalled();
    });
  });
});
