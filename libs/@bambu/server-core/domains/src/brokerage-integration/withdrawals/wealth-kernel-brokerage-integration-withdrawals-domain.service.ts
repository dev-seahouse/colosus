// noinspection ES6PreferShortImport

import { WealthKernelWithdrawalsApiServiceBase } from '@bambu/server-core/repositories';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import {
  IBrokerageIntegrationListAllWithdrawalsQueryParamsDto,
  IBrokerageIntegrationListAllWithdrawalsQueryResponseDto,
  IBrokerageIntegrationWithdrawalDto,
  IBrokerageIntegrationWithdrawalMutableDto,
} from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import { WealthKernelIntegrationHelpersServiceBase } from '../brokerage-integration-domain-helpers';
import { BrokerageIntegrationWithdrawalsDomainBaseService } from './brokerage-integration-withdrawals-domain-base.service';

@Injectable()
export class WealthKernelBrokerageIntegrationWithdrawalsDomainService
  implements BrokerageIntegrationWithdrawalsDomainBaseService
{
  private readonly logger = new Logger(
    WealthKernelBrokerageIntegrationWithdrawalsDomainService.name
  );

  constructor(
    private readonly wealthKernelWithdrawalsApiService: WealthKernelWithdrawalsApiServiceBase,
    private readonly wealthKernelDomainHelpers: WealthKernelIntegrationHelpersServiceBase
  ) {}

  private getInnerLoggerContext(logPrefix: string): string {
    return `${WealthKernelBrokerageIntegrationWithdrawalsDomainService.name}.${logPrefix}`;
  }

  public async List(
    requestId: string,
    tenantId: string,
    queryParams: IBrokerageIntegrationListAllWithdrawalsQueryParamsDto
  ): Promise<IBrokerageIntegrationListAllWithdrawalsQueryResponseDto> {
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
        await ErrorUtils.exponentialBackoff<IBrokerageIntegrationListAllWithdrawalsQueryResponseDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelWithdrawalsApiService.List(
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

  public async Get(
    requestId: string,
    tenantId: string,
    brokerageWithdrawalId: string
  ): Promise<IBrokerageIntegrationWithdrawalDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Get.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      brokerageWithdrawalId,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<IBrokerageIntegrationWithdrawalDto>(
          new Logger(innerLoggerContext),
          async () => {
            return this.wealthKernelWithdrawalsApiService.Get(
              requestId,
              tokenObject.token,
              brokerageWithdrawalId
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
      this.handleWithdrawalNotFoundError(error, requestId, loggingPayload);
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  private handleWithdrawalNotFoundError(
    error: unknown,
    requestId: string,
    metadata: unknown
  ): void {
    if (ErrorUtils.isErrorFromAxios(error)) {
      const axiosError = ErrorUtils.castErrorAsAxiosError(error);
      if (axiosError.response?.status === 404) {
        throw this.getWithdrawalNotFoundError(requestId, metadata);
      }
    }
  }

  private getWithdrawalNotFoundError(
    requestId: string,
    metadata: unknown
  ): ErrorUtils.ColossusError {
    return new ErrorUtils.ColossusError(
      `The brokerage withdrawal request was not found.`,
      requestId,
      metadata,
      404
    );
  }

  public async Create(
    requestId: string,
    tenantId: string,
    payload: IBrokerageIntegrationWithdrawalMutableDto,
    idempotencyKey?: string
  ): Promise<IBrokerageIntegrationWithdrawalDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Create.name,
      requestId
    );
    const loggingPayload = { tenantId, payload, idempotencyKey };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}.`
    );
    let creationIdempotencyKey = idempotencyKey;
    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      if (
        creationIdempotencyKey === undefined ||
        creationIdempotencyKey === null
      ) {
        creationIdempotencyKey = `WITHDRAWAL-${tenantId}-${requestId}`;
      }
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<IBrokerageIntegrationWithdrawalDto>(
          new Logger(innerLoggerContext),
          async () => {
            return this.wealthKernelWithdrawalsApiService.Create(
              requestId,
              tokenObject.token,
              creationIdempotencyKey,
              payload
            );
          }
        );
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}.`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}.`,
        `Error: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.wealthKernelDomainHelpers.HandleWealthKernelApiInputError(
        requestId,
        error,
        loggingPayload
      );
      this.wealthKernelDomainHelpers.HandleWealthKernelIdempotentInputError(
        error,
        requestId,
        creationIdempotencyKey,
        loggingPayload
      );
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }
}
