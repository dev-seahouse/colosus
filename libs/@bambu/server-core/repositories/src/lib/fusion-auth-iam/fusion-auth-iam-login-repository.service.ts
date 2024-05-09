import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import {
  JWTRefreshResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from '@fusionauth/typescript-client';
import { Injectable, Logger } from '@nestjs/common';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { BaseFusionAuthIamRepositoryService } from './base-fusion-auth-iam-repository.service';

export interface IFusionAuthLoginParamsDto {
  clientIpAddress: string | null;
  tenantId: string;
  username: string;
  password: string;
  applicationId: string | null;
}

export abstract class FusionAuthIamLoginRepositoryServiceBase extends BaseFusionAuthIamRepositoryService {
  public abstract Login(
    requestId: string,
    input: IFusionAuthLoginParamsDto
  ): Promise<LoginResponse>;

  public abstract RefreshJwtToken(
    requestId: string,
    refreshToken: string,
    tenantId?: string
  ): Promise<JWTRefreshResponse>;

  public abstract AdministrativelyGetRefreshTokenMetadata(
    requestId: string,
    refreshTokenId: string,
    tenantId?: string
  ): Promise<RefreshTokenResponse>;
}

@Injectable()
export class FusionAuthIamLoginRepositoryService extends FusionAuthIamLoginRepositoryServiceBase {
  private readonly logger: Logger = new Logger(
    FusionAuthIamLoginRepositoryService.name
  );

  public async Login(
    requestId: string,
    input: IFusionAuthLoginParamsDto
  ): Promise<LoginResponse> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.Login.name,
      requestId
    );
    try {
      const { clientIpAddress, password, username, tenantId, applicationId } =
        input;

      const headers: Record<string, string> = {
        'X-FusionAuth-TenantId': tenantId,
      };
      if (clientIpAddress) {
        headers['X-Forwarded-For'] = clientIpAddress;
      }

      const payload: LoginRequest = {
        loginId: username,
        password,
      };
      if (applicationId) {
        payload.applicationId = applicationId;
      }

      const url = new URL(
        '/api/login',
        super.fusionAuthConfig.baseUrl
      ).toString();
      this.logger.debug(
        `${logPrefix} - Payload: ${JsonUtils.Stringify({
          url,
          headers,
          payload,
        })}.`
      );
      const source = super.httpService.post<LoginResponse>(url, payload, {
        headers,
      });
      const response = await firstValueFrom(source);

      this.logger.debug(
        `${logPrefix} - Response: ${JsonUtils.Stringify(response)}.`
      );

      return response.data as LoginResponse;
    } catch (error) {
      this.logger.error(`${logPrefix} - Error: ${JsonUtils.Stringify(error)}.`);

      if (isAxiosError(error)) {
        if (error.isAxiosError && error.response?.status === 404) {
          throw ErrorUtils.getDefaultInvalidCredentialsError(requestId, {
            error,
          });
        }
      }

      throw error;
    }
  }

  public async RefreshJwtToken(
    requestId: string,
    refreshToken: string,
    tenantId?: string
  ): Promise<JWTRefreshResponse> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.RefreshJwtToken.name,
      requestId
    );
    try {
      const headers: Record<string, string> = {};

      if (tenantId) {
        headers['X-FusionAuth-TenantId'] = tenantId;
      }

      const payload = {
        refreshToken,
      };
      const url = new URL(
        '/api/jwt/refresh',
        super.fusionAuthConfig.baseUrl
      ).toString();
      this.logger.debug(
        `${logPrefix} - Payload: ${JsonUtils.Stringify({
          url,
          headers,
          payload,
        })}.`
      );
      const source = super.httpService.post<JWTRefreshResponse>(url, payload, {
        headers,
      });
      const response = await firstValueFrom(source);
      this.logger.debug(
        `${logPrefix} - Response: ${JsonUtils.Stringify(response)}.`
      );
      return response.data;
    } catch (error) {
      this.logger.error(`${logPrefix} - Error: ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async AdministrativelyGetRefreshTokenMetadata(
    requestId: string,
    refreshTokenId: string,
    tenantId?: string
  ): Promise<RefreshTokenResponse> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.AdministrativelyGetRefreshTokenMetadata.name,
      requestId
    );
    const payloadForLogging = {
      tenantId,
      refreshTokenId,
    };
    try {
      this.logger.debug(
        `${logPrefix} Input: ${JsonUtils.Stringify(payloadForLogging)}.`
      );
      const client = super.generateFusionAuthClient(tenantId);
      const sdkResponse = await client.retrieveRefreshTokenById(refreshTokenId);
      this.logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(sdkResponse)}.`
      );
      return sdkResponse.response;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error verifying user: ${JsonUtils.Stringify(error)}.`
      );
      throw super.generateFusionAuthError({
        error,
        requestId,
      });
    }
  }
}
