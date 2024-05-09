// noinspection ES6PreferShortImport

process.env.STRIPE_SECRET_KEY = 'STRIPE_SECRET_KEY';
process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET = 'STRIPE_WEBHOOK_ENDPOINT_SECRET';

import {
  FusionAuthIamLoginRepositoryServiceBase,
  FusionAuthIamUserRepositoryServiceBase,
  IamClientRepositoryServiceBase,
  TenantCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as crypto from 'crypto';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { AuthenticationService } from './authentication.service';
import { AuthenticationServiceBase } from './authentication.service.base';

describe('AuthenticationService', () => {
  let service: AuthenticationServiceBase;

  const iamClientRepositoryServiceBaseMock: DeepMockProxy<IamClientRepositoryServiceBase> =
    mockDeep<IamClientRepositoryServiceBase>();
  const tenantCentralDbRepositoryServiceMock: DeepMockProxy<TenantCentralDbRepositoryService> =
    mockDeep<TenantCentralDbRepositoryService>();
  const fusionAuthIamLoginRepositoryServiceBaseMock: DeepMockProxy<FusionAuthIamLoginRepositoryServiceBase> =
    mockDeep<FusionAuthIamLoginRepositoryServiceBase>();
  const fusionAuthIamUserRepositoryServiceBaseMock: DeepMockProxy<FusionAuthIamUserRepositoryServiceBase> =
    mockDeep<FusionAuthIamUserRepositoryServiceBase>();
  const configServiceMock: DeepMockProxy<ConfigService> =
    mockDeep<ConfigService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IamClientRepositoryServiceBase,
          useValue: iamClientRepositoryServiceBaseMock,
        },
        {
          provide: TenantCentralDbRepositoryService,
          useValue: tenantCentralDbRepositoryServiceMock,
        },
        {
          provide: FusionAuthIamLoginRepositoryServiceBase,
          useValue: fusionAuthIamLoginRepositoryServiceBaseMock,
        },
        {
          provide: FusionAuthIamUserRepositoryServiceBase,
          useValue: fusionAuthIamUserRepositoryServiceBaseMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        {
          provide: AuthenticationServiceBase,
          useClass: AuthenticationService,
        },
      ],
    }).compile();

    service = module.get<AuthenticationServiceBase>(AuthenticationServiceBase);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('RefreshJwtToken', () => {
    it('should not throw an error if it is a valid key cloak refresh token but invalid for fusion auth', async () => {
      jest.clearAllMocks();

      const mockResponse = {
        session_state: 'session_state',
        token_type: 'token_type',
        refresh_token: 'refresh_token',
        access_token: 'access_token',
        refresh_expires_in: 1,
        expires_in: 1,
        'not-before-policy': 1,
      };

      iamClientRepositoryServiceBaseMock.Refresh.mockResolvedValueOnce(
        mockResponse
      );

      fusionAuthIamLoginRepositoryServiceBaseMock.RefreshJwtToken.mockRejectedValueOnce(
        new Error('stubbed error')
      );

      const result = await service.RefreshJwtToken(
        crypto.randomUUID(),
        crypto.randomUUID()
      );

      expect(result).toBeDefined();
      expect(result).toEqual(mockResponse);
    });

    it('should not throw an error if it is an invalid key cloak refresh token but valid for fusion auth', async () => {
      jest.clearAllMocks();

      iamClientRepositoryServiceBaseMock.Refresh.mockRejectedValueOnce(
        new Error('stubbed error')
      );

      const mockFusionAuthRefreshToken = {
        token: 'token',
        refreshTokenId: 'refreshTokenId',
        refreshToken: 'refreshToken',
      };

      fusionAuthIamLoginRepositoryServiceBaseMock.RefreshJwtToken.mockResolvedValueOnce(
        mockFusionAuthRefreshToken
      );

      const mockFusionAuthRefreshTokenMetadata = {
        refreshToken: {
          startInstant: 1,
          token: 'token',
          userId: 'userId',
          tenantId: crypto.randomUUID(),
          id: crypto.randomUUID(),
          data: {},
          applicationId: crypto.randomUUID(),
        },
      };

      fusionAuthIamLoginRepositoryServiceBaseMock.AdministrativelyGetRefreshTokenMetadata.mockResolvedValueOnce(
        mockFusionAuthRefreshTokenMetadata
      );

      const mockFaJwtSettingsResponse = {
        jwtTokenTtlInSeconds: 1,
        jwtRefreshTokenTtlInMinutes: 1,
      };

      configServiceMock.getOrThrow.mockReturnValueOnce(
        mockFaJwtSettingsResponse
      );

      const result = await service.RefreshJwtToken(
        crypto.randomUUID(),
        crypto.randomUUID()
      );

      console.log('result', result);

      expect(result).toBeDefined();
      expect(result.access_token).toEqual(mockFusionAuthRefreshToken.token);
      expect(result.expires_in).toEqual(
        mockFaJwtSettingsResponse.jwtTokenTtlInSeconds
      );
      expect(result.refresh_expires_in).toEqual(
        mockFaJwtSettingsResponse.jwtRefreshTokenTtlInMinutes * 60
      );
    });
  });
});
