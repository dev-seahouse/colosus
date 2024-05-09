// noinspection ES6PreferShortImport

import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { WealthKernelTransactionsApiRepositoryServiceBase } from '@bambu/server-core/repositories';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { Injectable, Logger } from '@nestjs/common';
import { WealthKernelIntegrationHelpersServiceBase } from '../brokerage-integration-domain-helpers';
import { BrokerageIntegrationTransactionsDomainBaseService } from './brokerage-integration-transactions-domain-base.service';

@Injectable()
export class WealthKernelBrokerageIntegrationTransactionsDomainService
  implements BrokerageIntegrationTransactionsDomainBaseService
{
  private readonly Logger: Logger = new Logger(
    WealthKernelBrokerageIntegrationTransactionsDomainService.name
  );

  constructor(
    private readonly wealthKernelDomainHelpers: WealthKernelIntegrationHelpersServiceBase,
    private readonly wealthKernelTransactionsApi: WealthKernelTransactionsApiRepositoryServiceBase
  ) {}

  private getInnerLoggerContext(logPrefix: string): string {
    return `${WealthKernelBrokerageIntegrationTransactionsDomainService.name}.${logPrefix}`;
  }

  public async List(
    requestId: string,
    tenantId: string,
    input: BrokerageIntegrationServerDto.IBrokerageIntegrationTransactionsListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationTransactionsListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.List.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      input,
    };
    this.Logger.debug(
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
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationTransactionsListAllResponseDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelTransactionsApi.List(
              requestId,
              tokenObject.token,
              input
            );
          }
        );
      this.Logger.debug(
        `${logPrefix} Completed. ${JsonUtils.Stringify(response)}.`
      );
      return response;
    } catch (error) {
      this.Logger.error(`${logPrefix} Failed. ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async Get(
    requestId: string,
    tenantId: string,
    transactionId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationTransactionDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Get.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      transactionId,
    };
    this.Logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      const innerLoggerContext: string = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationTransactionDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelTransactionsApi.Get(
              requestId,
              tokenObject.token,
              transactionId
            );
          }
        );
      this.Logger.debug(
        `${logPrefix} Completed. ${JsonUtils.Stringify(response)}.`
      );
      return response;
    } catch (error) {
      this.Logger.error(`${logPrefix} Failed. ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }
}
