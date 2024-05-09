// noinspection ES6PreferShortImport

import { IFusionAuthIntegrationConfigInternalDto } from '@bambu/server-core/configuration';
import {
  FusionAuthIamLoginRepositoryServiceBase,
  FusionAuthIamUserRepositoryServiceBase,
  IamClientRepositoryServiceBase,
  IFusionAuthLoginParamsDto,
  TenantCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
  UuidUtils,
} from '@bambu/server-core/utilities';
import {
  JWTRefreshResponse,
  LoginResponse,
} from '@fusionauth/typescript-client';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Luxon from 'luxon';
import {
  AuthenticationServiceBase,
  IAuthenticationLoginResponseDto,
  IAuthenticationLoginRequestDto,
} from './authentication.service.base';

@Injectable()
export class AuthenticationService implements AuthenticationServiceBase {
  readonly #logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly iamClientRepository: IamClientRepositoryServiceBase,
    private readonly tenantCentralDb: TenantCentralDbRepositoryService,
    private readonly fusionAuthIamLogin: FusionAuthIamLoginRepositoryServiceBase,
    private readonly fusionAuthIamUser: FusionAuthIamUserRepositoryServiceBase,
    private readonly configService: ConfigService
  ) {}

  GuestLogin(): Promise<IAuthenticationLoginResponseDto> {
    return this.iamClientRepository.GuestLogin();
  }

  public async Login(
    requestId: string,
    credentials: IAuthenticationLoginRequestDto
  ): Promise<IAuthenticationLoginResponseDto> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.Login.name,
      requestId
    );

    try {
      /**
       * Workaround.
       *
       * We are moving towards using UUIDs for tenant realms, but we still have some legacy code that uses tenant names.
       */
      const { realmId, username, password } = credentials;

      const tenant = await this.getTenantMetadata(requestId, realmId, username);

      if (tenant.linkedToFusionAuth) {
        const fusionAuthResponses = await this.loginWithFusionAuth(requestId, {
          tenantId: tenant.id,
          password,
          username,
          applicationId: credentials?.applicationId,
        });

        return fusionAuthResponses.colossusApiResponse;
      }

      if (tenant.usesIdInsteadOfRealm) {
        return this.iamClientRepository.Login(requestId, {
          realmId: tenant.id,
          password,
          username,
        });
      }

      return this.iamClientRepository.Login(requestId, {
        realmId: tenant.realm,
        password,
        username,
      });
    } catch (error) {
      const errorMessage: string = [
        `${logPrefix} Error logging in.`,
        `Input: ${JsonUtils.Stringify(credentials)}.`,
        `Error: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');

      this.#logger.error(errorMessage);

      throw error;
    }
  }

  private async getTenantMetadata(
    requestId: string,
    realmId?: string | null,
    loginId?: string | null
  ) {
    const tenantMissingError =
      ErrorUtils.getDefaultMissingTenantInDbErrorWithTenantId({
        requestId,
        tenantId: realmId,
        metadata: {
          realmId,
        },
      });

    if (loginId) {
      const userSearchResult = await this.fusionAuthIamUser.FindUserByLoginId(
        requestId,
        loginId
      );

      if (userSearchResult) {
        const { tenantId } = userSearchResult;

        const tenant = await this.tenantCentralDb.FindTenantById(tenantId);

        if (tenant) {
          return tenant;
        }
      }
    }

    if (realmId) {
      /**
       * Workaround.
       *
       * We are moving towards using UUIDs for tenant realms, but we still have some legacy code that uses tenant names.
       */
      const tenant = UuidUtils.isStringUuid(realmId)
        ? await this.tenantCentralDb.FindTenantById(realmId)
        : await this.tenantCentralDb.FindTenantByRealm(realmId);

      if (tenant) {
        return tenant;
      }

      // throw tenantMissingError;
    }

    throw tenantMissingError;
  }

  private async loginWithFusionAuth(
    requestId: string,
    input: {
      tenantId: string;
      password: string;
      username: string;
      applicationId?: string;
      clientIpAddress?: string;
    }
  ): Promise<{
    colossusApiResponse: IAuthenticationLoginResponseDto;
    fusionAuthApiResponse: LoginResponse;
  }> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.loginWithFusionAuth.name,
      requestId
    );

    const config: IFusionAuthIntegrationConfigInternalDto =
      this.configService.getOrThrow<IFusionAuthIntegrationConfigInternalDto>(
        'fusionAuth'
      );

    const { jwtTokenTtlInSeconds, jwtRefreshTokenTtlInMinutes } = config;

    const { tenantId, password, username, applicationId, clientIpAddress } =
      input;

    const requestPayload: IFusionAuthLoginParamsDto = {
      password,
      username,
      tenantId,
      applicationId: applicationId || null,
      clientIpAddress: clientIpAddress || null,
    };

    const response = await this.fusionAuthIamLogin.Login(
      requestId,
      requestPayload
    );

    const expiresIn: number = jwtTokenTtlInSeconds;
    const refreshTokenExpiresIn: number = jwtRefreshTokenTtlInMinutes * 60;

    /**
     * If the user does not have a refresh token, we need to generate one.
     *
     * Fusion Auth will seem to only generate refresh tokens when the user logs in with an application id.
     * This is something we will need to look into at greater depth in the future when we have multiple Fusion Auth applications.
     */
    if (!response.refreshToken) {
      const message: string = [
        `${logPrefix} Fusion Auth login response did not contain a refresh token.`,
        `This is most likely due to a lack of application id in the login request.`,
        `Logging in with first available application id.`,
      ].join(' ');
      this.#logger.verbose(message);
      this.#logger.debug(
        `${logPrefix} Fusion Auth initial login response: ${JsonUtils.Stringify(
          response
        )}.`
      );

      const applicationId: string =
        response.user.registrations[0].applicationId;

      this.#logger.verbose(
        `${logPrefix} Fusion Auth login response did not contain a refresh token. Using application id: ${applicationId}.`
      );

      const responseWithRefreshToken = await this.fusionAuthIamLogin.Login(
        requestId,
        {
          ...requestPayload,
          applicationId,
        }
      );

      return {
        colossusApiResponse: this.generateColossusJwtResponse({
          token: responseWithRefreshToken.token,
          nbfValue: Luxon.DateTime.now().toUnixInteger(),
          expiresIn,
          refreshToken: responseWithRefreshToken.refreshToken,
          refreshTokenExpiresIn,
        }),
        fusionAuthApiResponse: responseWithRefreshToken,
      };
    }

    return {
      colossusApiResponse: this.generateColossusJwtResponse({
        expiresIn,
        nbfValue: Luxon.DateTime.now().toUnixInteger(),
        refreshToken: response.refreshToken,
        refreshTokenExpiresIn,
        token: response.token,
      }),
      fusionAuthApiResponse: response,
    };
  }

  private generateColossusJwtResponse({
    token,
    nbfValue,
    expiresIn,
    refreshToken,
    refreshTokenExpiresIn,
  }: {
    token: string;
    nbfValue: number;
    expiresIn: number;
    refreshToken: string;
    refreshTokenExpiresIn: number;
  }) {
    return {
      session_state: '-',
      access_token: token,
      'not-before-policy': nbfValue,
      expires_in: expiresIn,
      refresh_expires_in: refreshTokenExpiresIn,
      refresh_token: refreshToken,
      token_type: 'Bearer',
    } as IAuthenticationLoginResponseDto;
  }

  public async RefreshJwtToken(
    requestId: string,
    refreshToken: string,
    tenantId?: string
  ): Promise<IAuthenticationLoginResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.RefreshJwtToken.name,
      requestId
    );
    const payloadForLogger = {
      tenantId,
      refreshToken,
    };

    try {
      this.#logger.debug(
        `${logPrefix} Refreshing JWT token: ${JsonUtils.Stringify(
          payloadForLogger
        )}.`
      );

      if (tenantId) {
        return this.handleJwtRefreshWithTenantId(
          requestId,
          refreshToken,
          tenantId
        );
      }

      const [keyCloakResponse, fusionAuthResponse] = await Promise.allSettled([
        this.iamClientRepository.Refresh(refreshToken),
        this.fusionAuthIamLogin.RefreshJwtToken(requestId, refreshToken),
      ]);

      if (keyCloakResponse.status === 'fulfilled') {
        return keyCloakResponse.value;
      }

      if (fusionAuthResponse.status === 'fulfilled') {
        return this.generateFusionAuthJwtResponseForColossus(
          requestId,
          fusionAuthResponse.value
        );
      }

      if (keyCloakResponse.status === 'rejected') {
        // noinspection ExceptionCaughtLocallyJS
        throw keyCloakResponse.reason;
      }

      if (fusionAuthResponse.status === 'rejected') {
        // noinspection ExceptionCaughtLocallyJS
        throw fusionAuthResponse.reason;
      }

      // noinspection ExceptionCaughtLocallyJS
      throw new ErrorUtils.ColossusError(
        'Unexpected error while refreshing JWT token.',
        requestId,
        {
          payloadForLogger,
        },
        500
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error refreshing JWT token: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }

  private async handleJwtRefreshWithTenantId(
    requestId: string,
    refreshToken: string,
    tenantId: string
  ) {
    const tenant = await this.getTenantMetadata(requestId, tenantId, null);

    if (tenant.linkedToKeyCloak) {
      return this.iamClientRepository.Refresh(refreshToken);
    }

    const fusionAuthRefreshResponse = tenantId
      ? await this.fusionAuthIamLogin.RefreshJwtToken(
          requestId,
          refreshToken,
          tenant.id
        )
      : await this.fusionAuthIamLogin.RefreshJwtToken(requestId, refreshToken);

    return await this.generateFusionAuthJwtResponseForColossus(
      requestId,
      fusionAuthRefreshResponse,
      tenantId
    );
  }

  private async generateFusionAuthJwtResponseForColossus(
    requestId: string,
    fusionAuthRefreshResponse: JWTRefreshResponse,
    tenantId?: string
  ): Promise<IAuthenticationLoginResponseDto> {
    const {
      token,
      refreshToken: fusionAuthRefreshToken,
      refreshTokenId,
    } = fusionAuthRefreshResponse;
    const refreshTokenMetadata =
      await this.fusionAuthIamLogin.AdministrativelyGetRefreshTokenMetadata(
        requestId,
        refreshTokenId,
        tenantId
      );
    const {
      refreshToken: { startInstant: refreshTokenStartInstant },
    } = refreshTokenMetadata;

    const config =
      this.configService.getOrThrow<IFusionAuthIntegrationConfigInternalDto>(
        'fusionAuth'
      );

    const { jwtTokenTtlInSeconds, jwtRefreshTokenTtlInMinutes } = config;

    const jwtRefreshTokenTtlInMinutesInMs =
      jwtRefreshTokenTtlInMinutes * 60 * 1000;
    const jwtExpiryEpoch =
      refreshTokenStartInstant + jwtRefreshTokenTtlInMinutesInMs;
    const numberOfMsRemaining = jwtExpiryEpoch - refreshTokenStartInstant;
    const numberOfSecondsRemaining = numberOfMsRemaining / 1000;

    const epochNow = Date.now();

    return this.generateColossusJwtResponse({
      token: token,
      nbfValue: epochNow,
      refreshTokenExpiresIn: numberOfSecondsRemaining,
      expiresIn: jwtTokenTtlInSeconds,
      refreshToken: fusionAuthRefreshToken,
    });
  }
}
