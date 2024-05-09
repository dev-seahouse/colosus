// noinspection ES6PreferShortImport

import {
  InvalidRefreshTokenError,
  RealmNotFoundError,
} from '@bambu/server-core/common-errors';
import { IKeycloakIntegrationConfigDto } from '@bambu/server-core/configuration';
import {
  ErrorUtils,
  IamUtils,
  JoseUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { AuthenticationDto, ICertsResponseDto } from '@bambu/shared';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAxiosError } from 'axios';
import * as _ from 'lodash';
import { firstValueFrom } from 'rxjs';
import { IamClientRepositoryServiceBase } from './iam-client-repository.service.base';

// This repository interacts with Keycloak potentially using credentials belonging to a user.
@Injectable()
export class KeycloakIamClientRepositoryService
  implements IamClientRepositoryServiceBase
{
  readonly #logger: Logger = new Logger(IamClientRepositoryServiceBase.name);
  readonly #keycloakConfig: IKeycloakIntegrationConfigDto['keycloak'];

  constructor(
    private readonly keycloakConfig: ConfigService<IKeycloakIntegrationConfigDto>,
    private readonly httpService: HttpService
  ) {
    this.#keycloakConfig = this.keycloakConfig.get('keycloak', {
      infer: true,
    }) as IKeycloakIntegrationConfigDto['keycloak'];

    this.#logger.debug(`The baseUrl set is ${this.#keycloakConfig.baseUrl}`);
  }

  PredictRealmIdFromIssuer(issuer: string): string {
    const logPrefix = `${this.PredictRealmIdFromIssuer.name} -`;

    this.#logger.log(`${logPrefix} Getting realm from token issuer.`);

    return IamUtils.GetRealmSansUrl(issuer, this.#keycloakConfig.baseUrl);
  }

  public async GetCerts(realmId: string): Promise<ICertsResponseDto> {
    const logPrefix = `${this.GetCerts.name} -`;
    try {
      const url = [
        this.#keycloakConfig.baseUrl,
        '/realms/',
        realmId,
        '/protocol/openid-connect/certs',
      ].join('');
      const source = this.httpService.get(url);
      const response = await firstValueFrom(source);

      return _.cloneDeep<ICertsResponseDto>(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        if (
          error.response?.status === 404 &&
          error.response?.data?.error === 'Realm does not exist'
        ) {
          this.#logger.error(
            `${logPrefix} Realm ${realmId} does not seem to exist. Details: ${JsonUtils.Stringify(
              error
            )}`
          );
          throw new RealmNotFoundError(
            `Realm ${realmId} does not seem to exist.`
          );
        }
      }
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  public async GuestLogin(): Promise<AuthenticationDto.IAuthenticationLoginResponseDto> {
    const logPrefix = `${this.GuestLogin.name} -`;
    try {
      return await this.Login('N/A', {
        username: this.#keycloakConfig.publicUserUsername,
        password: this.#keycloakConfig.publicUserPassword,
        realmId: this.#keycloakConfig.publicRealm,
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  public async Login(
    requestId: string,
    {
      realmId,
      username,
      password,
    }: AuthenticationDto.IAuthenticationLoginRequestDto
  ): Promise<AuthenticationDto.IAuthenticationLoginResponseDto> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.Login.name,
      requestId
    );

    if (!realmId) {
      throw new ErrorUtils.ColossusError(
        'Realm id could not be acquired.',
        requestId,
        {
          realmId,
          username,
          password,
        }
      );
    }

    try {
      const data = {
        grant_type: 'password',
        // TODO: check if account's client roles are too permissive (e.g. investors should not be able to change their group.)
        client_id: 'account',
        username,
        password,
      };

      return await this.#callOpenIdConnectTokenEndpoint(realmId, data);
    } catch (error) {
      if (isAxiosError(error)) {
        if (
          error.response?.status === 401 &&
          error.response?.data?.error === 'invalid_grant'
        ) {
          throw ErrorUtils.getDefaultInvalidCredentialsError(requestId, {
            error,
          });
        }
      }
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  async Refresh(
    refreshToken: string
  ): Promise<AuthenticationDto.IAuthenticationLoginResponseDto> {
    const logPrefix = `${this.Refresh.name} -`;
    try {
      const { iss } = JoseUtils.parseArbitraryJWT(refreshToken);
      if (!iss) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error('Invalid refresh token. No issuer found.');
      }
      const realmId = this.PredictRealmIdFromIssuer(iss);

      const data = {
        grant_type: 'refresh_token',
        client_id: 'account',
        refresh_token: refreshToken,
      };

      return await this.#callOpenIdConnectTokenEndpoint(realmId, data);
    } catch (error) {
      if (isAxiosError(error)) {
        if (
          error.response?.status === 400 &&
          error.response?.data?.error === 'invalid_grant'
        ) {
          throw new InvalidRefreshTokenError();
        }
      }
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  async #callOpenIdConnectTokenEndpoint(realmId: string, data?: unknown) {
    // Note: `AxiosError`s are silently rethrown by this method. All other errors are rethrown, but with logging.
    //   Rationale for silently rethrowing `AxiosError`s: some `AxiosError`s are due to invalid input (e.g. invalid credentials), which are not necessarily an error.
    const logPrefix = `${this.#callOpenIdConnectTokenEndpoint.name} -`;
    try {
      const url = [
        this.#keycloakConfig.baseUrl,
        '/realms/',
        realmId,
        '/protocol/openid-connect/token',
      ].join('');

      const loggerPayload = {
        url,
        data,
      };

      this.#logger.debug(
        `${logPrefix} Calling API with following parameters: ${JsonUtils.Stringify(
          loggerPayload
        )}`
      );

      const source = this.httpService.post(url, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const response = await firstValueFrom(source);

      const responseData = _.cloneDeep(response.data);

      this.#logger.debug(
        [
          `${logPrefix} Data Retrieved: ${JsonUtils.Stringify(responseData)}.`,
          `Input values: ${JsonUtils.Stringify(loggerPayload)}`,
        ].join(' ')
      );

      return responseData;
    } catch (error) {
      if (isAxiosError(error)) {
        throw error;
      }
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }
}
