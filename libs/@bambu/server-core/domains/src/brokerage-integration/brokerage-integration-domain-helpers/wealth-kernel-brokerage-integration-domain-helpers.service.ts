import { IOpenPGPConfigDto } from '@bambu/server-core/configuration';
import { PrismaModel } from '@bambu/server-core/db/central-db';
import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import {
  CacheManagerRepositoryServiceBase,
  TenantApiKeyCentralDbRepository,
  TenantCentralDbRepositoryService,
  WealthKernelAccountsApiRepositoryServiceBase,
  WealthKernelAuthApiRepositoryServiceBase,
  WealthKernelPartiesApiRepositoryServiceBase,
  WealthKernelPortfoliosApiRepositoryServiceBase,
} from '@bambu/server-core/repositories';
import {
  CryptographyUtils,
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import {
  IEncryptedKeyConfigDto,
  IWealthKernelKeyConfigDto,
  SharedEnums,
} from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export abstract class WealthKernelIntegrationHelpersServiceBase {
  public abstract GetTenantWealthKernelCredentials(
    requestId: string,
    tenantId: string,
    logger?: Logger
  ): Promise<{
    clientId: string;
    clientSecret: string;
  }>;

  public abstract GetWealthKernelTenant(
    requestId: string,
    tenantId: string
  ): Promise<PrismaModel.Tenant | null>;

  public abstract GuardWealthKernelTenant(
    requestId: string,
    tenantId: string
  ): Promise<void>;

  public abstract GetAuthenticationTokenFromCache(
    requestId: string,
    tenantId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto | null>;

  public abstract GetAuthenticationTokenFromCacheWithRetry(
    requestId: string,
    tenantId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto>;

  public abstract HandleWealthKernelIntegrationError(
    requestId: string,
    error: unknown,
    errorMetadata: unknown | null
  ): void;

  public abstract GuardTenantAndGetTenantToken(
    requestId: string,
    tenantId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto>;

  public abstract HandleWealthKernelApiInputError(
    requestId: string,
    error: Error,
    loggingPayload?: unknown
  ): void;

  public abstract HandleWealthKernelIdempotentInputError(
    error: Error | unknown,
    requestId: string,
    creationIdempotencyKey: string,
    additionalMetadata?: unknown
  ): void;

  public abstract GetPartyById(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto | null>;

  public abstract HandlePartyNotFoundError(
    error: unknown,
    requestId: string,
    loggingPayload: unknown
  ): void;

  public abstract GetBrokerageAccountById(
    requestId: string,
    tenantId: string,
    brokerageAccountId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto>;

  public abstract HandleBrokerageAccountNotFoundError(
    error: unknown,
    requestId: string,
    metadata: unknown
  ): void;

  public abstract GetBrokerageAccountNotFoundError(
    requestId: string,
    metadata: unknown
  ): ErrorUtils.ColossusError;

  public abstract GetPortfolioById(
    requestId: string,
    tenantId: string,
    brokeragePortfolioId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>;

  public abstract HandleBrokeragePortfolioNotFoundError(
    error: unknown,
    requestId: string,
    metadata: unknown
  ): void;

  public abstract GetBrokeragePortfolioNotFoundError(
    requestId: string,
    metadata: unknown
  ): ErrorUtils.ColossusError;

  public abstract GetPartyNotFoundError(
    requestId: string,
    metadata: unknown
  ): ErrorUtils.ColossusError;

  public abstract CreateAndCacheAuthenticationToken(
    requestId: string,
    tenantId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto>;
}

@Injectable()
export class WealthKernelBrokerageIntegrationDomainHelpersService
  implements WealthKernelIntegrationHelpersServiceBase
{
  private readonly logger = new Logger(
    WealthKernelBrokerageIntegrationDomainHelpersService.name
  );

  private readonly currentBrokerageType =
    SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL;

  constructor(
    private readonly tenantCentralDb: TenantCentralDbRepositoryService,
    private readonly cacheManager: CacheManagerRepositoryServiceBase,
    private readonly wealthKernelPartiesApi: WealthKernelPartiesApiRepositoryServiceBase,
    private readonly wealthKernelAccountsApi: WealthKernelAccountsApiRepositoryServiceBase,
    private readonly wealthKernelPortfoliosApi: WealthKernelPortfoliosApiRepositoryServiceBase,
    private readonly wealthKernelAuthApi: WealthKernelAuthApiRepositoryServiceBase,
    private readonly openPgpConfigService: ConfigService<IOpenPGPConfigDto>,
    private readonly tenantApiKeyCentralDb: TenantApiKeyCentralDbRepository
  ) {}

  /**
   * Get the Wealth Kernel credentials for a tenant.
   *
   * This is a dummy for now until we have a proper KYC onboarding mechanism.
   * @param requestId
   * @param tenantId
   * @constructor
   */
  public async GetTenantWealthKernelCredentials(
    requestId: string,
    tenantId: string
  ) {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetTenantWealthKernelCredentials.name,
      requestId
    );
    const loggingPayload = { tenantId };
    this.logger.debug(
      `${logPrefix} Start. LoggingPayload: ${JsonUtils.Stringify(
        loggingPayload
      )}`
    );
    const result = await this.tenantApiKeyCentralDb.GetApiKeysByTenantIdAndType(
      requestId,
      tenantId,
      SharedEnums.ApiKeyTypeEnum.WEALTH_KERNEL_API
    );
    if (!result) {
      const error = new ErrorUtils.ColossusError(
        'Tenant not valid for brokerage.',
        requestId,
        { tenantId },
        400,
        SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.TENANT_NOT_BOUND_TO_BROKERAGE
      );
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      throw error;
    }
    const rawKey = result.keyConfig as IEncryptedKeyConfigDto;
    const { encryptedConfig } = rawKey;
    const config = this.openPgpConfigService.getOrThrow('openPGPConfig', {
      infer: true,
    });
    const { pgpPrivateKeyBase64, pgpPublicKeyBase64, pgpPassphrase } = config;
    const decryptedString = await CryptographyUtils.decryptContent({
      passphrase: pgpPassphrase,
      encryptedContentBase64: encryptedConfig,
      publicKeyBase64: pgpPublicKeyBase64,
      privateKeyBase64: pgpPrivateKeyBase64,
    });
    const decryptedConfig: IWealthKernelKeyConfigDto = JSON.parse(
      decryptedString
    ) as IWealthKernelKeyConfigDto;
    this.logger.debug(
      `${logPrefix} End. DecryptedConfig: ${JsonUtils.Stringify(
        decryptedConfig
      )}`
    );
    return decryptedConfig;
  }

  /**
   * Until we have a proper KYC onboarding mechanism, we will just check if the tenant exists.
   * @param requestId
   * @param tenantId
   * @constructor
   */
  public async GuardWealthKernelTenant(
    requestId: string,
    tenantId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GuardWealthKernelTenant.name,
      requestId
    );

    const tenant = await this.GetWealthKernelTenant(requestId, tenantId);
    if (tenant) {
      return;
    }

    const error = new ErrorUtils.ColossusError(
      'Tenant not valid for brokerage.',
      requestId,
      { tenantId },
      400,
      SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.TENANT_NOT_BOUND_TO_BROKERAGE
    );

    this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);

    throw error;
  }

  /**
   * Until we have a proper KYC onboarding mechanism, we will just check if the tenant exists.
   * @param requestId
   * @param tenantId
   * @constructor
   */
  public async GetWealthKernelTenant(
    requestId: string,
    tenantId: string
  ): Promise<PrismaModel.Tenant | null> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetTenantWealthKernelCredentials.name,
      requestId
    );
    const loggingPayload = { tenantId };
    this.logger.debug(
      `${logPrefix} Start. LoggingPayload: ${JsonUtils.Stringify(
        loggingPayload
      )}`
    );
    try {
      const tenant = await this.tenantCentralDb.FindTenantById(tenantId);
      if (!tenant) {
        return null;
      }
      return tenant as PrismaModel.Tenant;
    } catch (error) {
      const message = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(message);
      throw error;
    }
  }

  public async GetAuthenticationTokenFromCache(
    requestId: string,
    tenantId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto | null> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetAuthenticationTokenFromCache.name,
      requestId
    );
    const loggingPayload = {
      tenantId,
    };
    this.logger.debug(
      `${logPrefix} Start. LoggingPayload: ${JsonUtils.Stringify(
        loggingPayload
      )}`
    );
    try {
      await this.GuardWealthKernelTenant(requestId, tenantId);
      const data = await this.cacheManager.GetAuthenticationTokenFromCache(
        requestId,
        this.currentBrokerageType,
        tenantId
      );
      if (data === null) {
        return this.CreateAndCacheAuthenticationToken(requestId, tenantId);
        // return null;
      }
      this.logger.debug(`${logPrefix} End. Data: ${JsonUtils.Stringify(data)}`);
      return data;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error encountered.`,
          `Input: ${JsonUtils.Stringify(loggingPayload)}`,
          `Error: ${JsonUtils.Stringify(error)}`,
        ].join(' ')
      );
      throw error;
    }
  }

  private getInnerLoggerContext(logPrefix: string): string {
    return `${WealthKernelBrokerageIntegrationDomainHelpersService.name}.${logPrefix}`;
  }

  public async GetAuthenticationTokenFromCacheWithRetry(
    requestId: string,
    tenantId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetAuthenticationTokenFromCacheWithRetry.name,
      requestId
    );
    return await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto>(
      new Logger(this.getInnerLoggerContext(logPrefix)),
      async () => {
        const token = await this.GetAuthenticationTokenFromCache(
          requestId,
          tenantId
        );
        if (!token) {
          throw ErrorUtils.getDefaultTenantAccessTokenMissingError(
            requestId,
            tenantId
          );
        }
        return token;
      },
      8,
      1000,
      [
        SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
          .AUTHENTICATION_TOKEN_MISSING,
      ]
    );
  }

  public HandleWealthKernelIntegrationError(
    requestId: string,
    error: unknown,
    errorMetadata: unknown | null
  ): void {
    if (ErrorUtils.isErrorFromAxios(error)) {
      const axiosError = ErrorUtils.castErrorAsAxiosError(error);

      const metadata = {
        error,
        additionalMetadata: null,
      };

      if (errorMetadata) {
        metadata.additionalMetadata = errorMetadata;
      }

      if (axiosError.response?.status === 429) {
        throw ErrorUtils.getDefaultBrokerageApiRateLimitError(
          requestId,
          metadata
        );
      }
    }

    throw error;
  }

  public async GuardTenantAndGetTenantToken(
    requestId: string,
    tenantId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto> {
    await this.GuardWealthKernelTenant(requestId, tenantId);
    return await this.GetAuthenticationTokenFromCacheWithRetry(
      requestId,
      tenantId
    );
  }

  public HandleWealthKernelApiInputError(
    requestId: string,
    error: Error,
    loggingPayload?: unknown
  ): void {
    if (ErrorUtils.isErrorFromAxios(error)) {
      const axiosError = ErrorUtils.castErrorAsAxiosError(error);
      if (axiosError.response?.status === 400) {
        const errorMessage =
          (axiosError.response?.data as Record<string, string>)?.title ||
          'Invalid request to Brokerage.';
        const errorsObject = (
          axiosError.response?.data as Record<string, unknown>
        ).errors;
        const supplementaryErrorMessages: string[] = [];
        if (
          errorsObject &&
          Array.isArray(errorsObject) &&
          errorsObject.length > 0
        ) {
          supplementaryErrorMessages.push(...errorsObject);
        } else if (errorsObject && Object.keys(errorsObject).length > 0) {
          Object.keys(errorsObject).forEach((key) => {
            const value = errorsObject[key];

            if (Array.isArray(value) && value.length > 0) {
              supplementaryErrorMessages.push(...value);
            }

            if (typeof value === 'string') {
              supplementaryErrorMessages.push(value);
            }
          });
        } else if (
          axiosError?.response?.data &&
          typeof axiosError?.response?.data === 'string'
        ) {
          supplementaryErrorMessages.push(axiosError?.response?.data);
        } else {
          supplementaryErrorMessages.push(
            'No further details available from brokerage'
          );
        }
        const finalErrorMessageBuilder = [errorMessage];
        if (supplementaryErrorMessages.length > 0) {
          finalErrorMessageBuilder.push(
            `Supplementary error messages: [${supplementaryErrorMessages.join(
              ','
            )}].`
          );
        }
        const metadata: Record<string, unknown> = {
          axiosError,
          loggingPayload: null,
        };
        if (loggingPayload) {
          metadata.loggingPayload = loggingPayload;
        }
        throw new ErrorUtils.ColossusError(
          finalErrorMessageBuilder.join(' '),
          requestId,
          metadata,
          400,
          SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.BAD_BROKERAGE_REQUEST
        );
      }
    }
  }

  public HandleWealthKernelIdempotentInputError(
    error: Error | unknown,
    requestId: string,
    creationIdempotencyKey: string,
    additionalMetadata?: unknown
  ): void {
    if (ErrorUtils.isErrorFromAxios(error)) {
      const axiosError = ErrorUtils.castErrorAsAxiosError(error);
      const medataData = {
        error: axiosError,
        additionalMetadata: null,
      };
      if (additionalMetadata) {
        medataData.additionalMetadata = additionalMetadata;
      }
      if (axiosError.response?.status === 409) {
        throw new ErrorUtils.ColossusError(
          `The creation request has already been submitted with different details. Idempotency key: ${creationIdempotencyKey}.`,
          requestId,
          medataData,
          409,
          SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.IDEMPOTENT_CREATION_REQUEST_ALREADY_SUBMITTED
        );
      }
    }
  }

  /**
   * Centralized function to get the party by id as this is needed across the board.
   *
   * Note that the behavior whereby it throws a 404 error if the party is not found is used by many dependent functions.
   * DO NOT remove the 404 behavior please.
   * @param requestId
   * @param tenantId
   * @param brokeragePartyId
   * @constructor
   */
  public async GetPartyById(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto | null> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetPartyById.name,
      requestId
    );
    const loggingPayload = { tenantId, brokeragePartyId };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      const tokenObject = await this.GuardTenantAndGetTenantToken(
        requestId,
        tenantId
      );
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelPartiesApi.GetPartyById(
              requestId,
              tokenObject.token,
              brokeragePartyId
            );
          }
        );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.HandlePartyNotFoundError(error, requestId, loggingPayload);
      this.HandleWealthKernelIntegrationError(requestId, error, loggingPayload);
    }
  }

  public HandlePartyNotFoundError(
    error: unknown,
    requestId: string,
    loggingPayload: unknown
  ): void {
    if (ErrorUtils.isErrorFromAxios(error)) {
      const axiosError = ErrorUtils.castErrorAsAxiosError(error);
      if (axiosError.response?.status === 404) {
        throw this.GetPartyNotFoundError(requestId, loggingPayload);
      }
    }
  }

  public GetPartyNotFoundError(
    requestId: string,
    metadata: unknown
  ): ErrorUtils.ColossusError {
    return new ErrorUtils.ColossusError(
      `Party not found.`,
      requestId,
      metadata,
      404,
      SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.TENANT_PARTY_NOT_FOUND
    );
  }

  /**
   * Centralized function to get the brokerage account by id as this is needed across the board.
   *
   * Note that the behavior whereby it throws a 404 error if the party is not found is used by many dependent functions.
   * DO NOT remove the 404 behavior please.
   *
   * @param requestId
   * @param tenantId
   * @param brokerageAccountId
   * @constructor
   */
  public async GetBrokerageAccountById(
    requestId: string,
    tenantId: string,
    brokerageAccountId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBrokerageAccountById.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      brokerageAccountId,
    };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const tokenObject = await this.GuardTenantAndGetTenantToken(
        requestId,
        tenantId
      );
      const innerLoggerContext: string = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelAccountsApi.Get(
              requestId,
              tokenObject.token,
              brokerageAccountId
            );
          }
        );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}.`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}.`,
        `Error: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.HandleBrokerageAccountNotFoundError(
        error,
        requestId,
        loggingPayload
      );
      this.HandleWealthKernelIntegrationError(requestId, error, loggingPayload);
    }
  }

  public HandleBrokerageAccountNotFoundError(
    error: unknown,
    requestId: string,
    metadata: unknown
  ): void {
    if (ErrorUtils.isErrorFromAxios(error)) {
      const axiosError = ErrorUtils.castErrorAsAxiosError(error);
      if (axiosError.response?.status === 404) {
        throw this.GetBrokerageAccountNotFoundError(requestId, metadata);
      }
    }
  }

  public GetBrokerageAccountNotFoundError(
    requestId: string,
    metadata: unknown
  ): ErrorUtils.ColossusError {
    return new ErrorUtils.ColossusError(
      `The brokerage account account was not found.`,
      requestId,
      metadata,
      404,
      SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.BROKERAGE_ACCOUNT_NOT_FOUND
    );
  }

  public async GetPortfolioById(
    requestId: string,
    tenantId: string,
    brokeragePortfolioId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetPortfolioById.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      brokeragePortfolioId,
    };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const tokenObject = await this.GuardTenantAndGetTenantToken(
        requestId,
        tenantId
      );
      const innerLoggerContext: string = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelPortfoliosApi.Get(
              requestId,
              tokenObject.token,
              brokeragePortfolioId
            );
          }
        );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}.`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}.`,
        `Error: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.HandleBrokeragePortfolioNotFoundError(
        error,
        requestId,
        loggingPayload
      );
      this.HandleWealthKernelIntegrationError(requestId, error, loggingPayload);
    }
  }

  public HandleBrokeragePortfolioNotFoundError(
    error: unknown,
    requestId: string,
    metadata: unknown
  ): void {
    if (ErrorUtils.isErrorFromAxios(error)) {
      const axiosError = ErrorUtils.castErrorAsAxiosError(error);
      if (axiosError.response?.status === 404) {
        throw this.GetBrokeragePortfolioNotFoundError(requestId, metadata);
      }
    }
  }

  public GetBrokeragePortfolioNotFoundError(
    requestId: string,
    metadata: unknown
  ): ErrorUtils.ColossusError {
    return new ErrorUtils.ColossusError(
      `The brokerage portfolio account was not found.`,
      requestId,
      metadata,
      404,
      SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.BROKERAGE_PORTFOLIO_NOT_FOUND
    );
  }

  public async CreateAndCacheAuthenticationToken(
    requestId: string,
    tenantId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateAndCacheAuthenticationToken.name,
      requestId
    );
    const loggingPayload = {
      tenantId,
    };
    this.logger.debug(
      `${logPrefix} Start. LoggingPayload: ${JsonUtils.Stringify(
        loggingPayload
      )}`
    );
    try {
      await this.GuardWealthKernelTenant(requestId, tenantId);
      const { clientId, clientSecret } =
        await this.GetTenantWealthKernelCredentials(requestId, tenantId);
      const token = await this.wealthKernelAuthApi.GetToken(
        requestId,
        clientId,
        clientSecret
      );
      this.logger.debug(
        `${logPrefix} Token from API: ${JsonUtils.Stringify(token)}`
      );
      // Token TTL is in seconds, but we want to store it in milliseconds.
      const ttl = token.expires_in * 1000;
      const internalToken: BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto =
        {
          token: token.access_token,
          inceptionDateIsoString: new Date().toISOString(),
          tokenType:
            token.token_type as BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenTypeEnum,
          lifespanInSeconds: token.expires_in,
          scope: token.scope,
          rawData: token as unknown as Record<string, unknown>,
        };
      await this.cacheManager.SetAuthenticationTokenToCache(
        requestId,
        this.currentBrokerageType,
        tenantId,
        ttl,
        internalToken as unknown as Record<string, unknown>
      );
      const newToken = await this.GetAuthenticationTokenFromCache(
        requestId,
        tenantId
      );
      this.logger.debug(
        `${logPrefix} End. NewToken: ${JsonUtils.Stringify(newToken)}`
      );
      return newToken;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error encountered.`,
          `Input: ${JsonUtils.Stringify(loggingPayload)}`,
          `Error: ${JsonUtils.Stringify(error)}`,
        ].join(' ')
      );
      throw error;
    }
  }
}
