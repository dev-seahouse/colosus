import {
  IFusionAuthIntegrationConfigDto,
  IFusionAuthIntegrationConfigInternalDto,
} from '@bambu/server-core/configuration';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { SharedEnums } from '@bambu/shared';
import {
  EmailTemplateSearchRequest,
  EmailTemplateSearchResponse,
  FusionAuthClient,
} from '@fusionauth/typescript-client';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';

export interface ISearchEmailTemplatesParamsDto {
  requestId: string;
  name?: string;
  numberOfResults?: number;
  orderBy?: string;
  startRow?: number;
}

@Injectable()
export class BaseFusionAuthIamRepositoryService {
  private readonly _fusionAuthConfig: IFusionAuthIntegrationConfigInternalDto;
  readonly #logger = new Logger(BaseFusionAuthIamRepositoryService.name);

  constructor(
    private readonly configService: ConfigService<IFusionAuthIntegrationConfigDto>,
    private readonly _httpService: HttpService
  ) {
    const {
      baseUrl,
      apiKey,
      jwtRefreshTokenTtlInMinutes,
      jwtTokenTtlInSeconds,
      rememberPreviousPasswords,
    } = this.configService.getOrThrow('fusionAuth', {
      infer: true,
    });

    this._fusionAuthConfig = {
      baseUrl,
      apiKey,
      jwtRefreshTokenTtlInMinutes,
      jwtTokenTtlInSeconds,
      rememberPreviousPasswords,
    };
  }

  protected get fusionAuthConfig(): IFusionAuthIntegrationConfigInternalDto {
    return this._fusionAuthConfig;
  }

  protected get httpService(): HttpService {
    return this._httpService;
  }

  protected generateFusionAuthClient(tenantId?: string): FusionAuthClient {
    if (!tenantId) {
      return new FusionAuthClient(
        this.fusionAuthConfig.apiKey,
        this.fusionAuthConfig.baseUrl
      );
    }

    return new FusionAuthClient(
      this.fusionAuthConfig.apiKey,
      this.fusionAuthConfig.baseUrl,
      tenantId
    );
  }

  protected generateFusionAuthError({
    error,
    platformErrorCode,
    requestId,
  }: {
    error: unknown;
    platformErrorCode?: ErrorUtils.ErrorCodes;
    requestId?: string;
  }) {
    /**
     * There is no proper error from Fusion Auth.
     * It is a generic JSON object with no real way to guard it.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fusionAuthRepositoryError = error as any;

    if (
      !fusionAuthRepositoryError?.statusCode ||
      !fusionAuthRepositoryError?.exception
    ) {
      return error;
    }

    const { statusCode, exception } = fusionAuthRepositoryError;
    let errorMessage = 'Unhandled IAM service error.';

    if (
      exception.fieldErrors &&
      Object.keys(exception.fieldErrors).length > 0
    ) {
      const fieldErrors = Object.values(exception.fieldErrors);
      const fieldErrorsFlattened = _.flatten(fieldErrors);
      const errorMessageStringBuilder: string[] = [];

      if (fieldErrors.length > 0 && fieldErrorsFlattened.length > 0) {
        fieldErrorsFlattened.forEach((x) => {
          /**
           * No strong typings found for this from Fusion Auth.
           */
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const item = x as any;
          const code = item.code || null;
          const message = item.message || null;

          if (code !== null && message !== null) {
            errorMessageStringBuilder.push(`${code}: ${message}`);
          }
        });
      }

      if (errorMessageStringBuilder.length > 0) {
        errorMessage = errorMessageStringBuilder.join(' ');
      }
    }

    return new ErrorUtils.ColossusError(
      errorMessage,
      requestId || 'NA',
      exception,
      statusCode,
      platformErrorCode ||
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.UNHANDLED_IAM_SERVICE_ERROR
    );
  }

  protected async searchEmailTemplatesAsAdmin({
    name,
    numberOfResults = 25,
    orderBy = 'name ASC',
    startRow = 0,
    requestId,
  }: ISearchEmailTemplatesParamsDto): Promise<EmailTemplateSearchResponse> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.searchEmailTemplatesAsAdmin.name,
      requestId
    );

    this.#logger.debug(
      `${logPrefix} Starting search email templates as admin.`
    );

    try {
      this.#logger.debug(
        `${logPrefix} Parameters: ${JSON.stringify({
          name,
          numberOfResults,
          orderBy,
          startRow,
        })}`
      );

      const apiRequestPayload: EmailTemplateSearchRequest = {
        search: {
          name,
          numberOfResults,
          orderBy,
          startRow,
        },
      };

      const apiResponse =
        await this.generateFusionAuthClient().searchEmailTemplates(
          apiRequestPayload
        );

      return apiResponse.response;
    } catch (error) {
      this.#logger.debug(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      throw this.generateFusionAuthError({
        error,
        requestId,
      });
    }
  }
}
