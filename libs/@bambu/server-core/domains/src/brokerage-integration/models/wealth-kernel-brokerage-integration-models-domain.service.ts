// noinspection ES6PreferShortImport

import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { WealthKernelModelsApiRepositoryServiceBase } from '@bambu/server-core/repositories';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { SharedEnums } from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import { WealthKernelIntegrationHelpersServiceBase } from '../brokerage-integration-domain-helpers';
import { BrokerageIntegrationModelsDomainBaseService } from './brokerage-integration-models-domain-base.service';

@Injectable()
export class WealthKernelBrokerageIntegrationModelsDomainService
  implements BrokerageIntegrationModelsDomainBaseService
{
  private readonly logger: Logger = new Logger(
    WealthKernelBrokerageIntegrationModelsDomainService.name
  );

  constructor(
    private readonly wealthKernelDomainHelpers: WealthKernelIntegrationHelpersServiceBase,
    private readonly wealthKernelModelsApi: WealthKernelModelsApiRepositoryServiceBase
  ) {}

  private getInnerLoggerContext(logPrefix: string): string {
    return `${WealthKernelBrokerageIntegrationModelsDomainService.name}.${logPrefix}`;
  }

  public async Get(
    requestId: string,
    tenantId: string,
    brokerageModelId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationModelPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Get.name,
      requestId
    );
    const loggingPayload = { tenantId, brokerageModelId };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationModelPortfolioDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelModelsApi.Get(
              requestId,
              tokenObject.token,
              brokerageModelId
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
      this.handleModelNotFoundError(error, requestId, loggingPayload);
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  private handleModelNotFoundError(
    error: unknown,
    requestId: string,
    metadata: unknown
  ): void {
    if (ErrorUtils.isErrorFromAxios(error)) {
      const axiosError = ErrorUtils.castErrorAsAxiosError(error);
      if (axiosError.response?.status === 404) {
        throw this.getModelNotFoundError(requestId, metadata);
      }
    }
  }

  private getModelNotFoundError(
    requestId: string,
    metadata: unknown
  ): ErrorUtils.ColossusError {
    return new ErrorUtils.ColossusError(
      `The brokerage model portfolio was not found.`,
      requestId,
      metadata,
      404,
      SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.BROKERAGE_MODEL_PORTFOLIO_NOT_FOUND
    );
  }

  public async List(
    requestId: string,
    tenantId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationModelPortfolioDtoListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationModelPortfolioDtoListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.List.name,
      requestId
    );
    const loggingPayload = { tenantId, queryParams };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationModelPortfolioDtoListAllResponseDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelModelsApi.List(
              requestId,
              tokenObject.token,
              queryParams
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
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }
}
