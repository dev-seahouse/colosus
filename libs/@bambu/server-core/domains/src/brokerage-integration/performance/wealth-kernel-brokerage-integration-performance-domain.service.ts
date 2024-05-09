// noinspection ES6PreferShortImport

import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { WealthKernelPerformanceApiRepositoryServiceBase } from '@bambu/server-core/repositories';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { Injectable, Logger } from '@nestjs/common';
import { WealthKernelIntegrationHelpersServiceBase } from '../brokerage-integration-domain-helpers';
import { BrokerageIntegrationPerformanceDomainBaseService } from './brokerage-integration-performance-domain-base.service';

@Injectable()
export class WealthKernelBrokerageIntegrationPerformanceDomainService
  implements BrokerageIntegrationPerformanceDomainBaseService
{
  private readonly logger: Logger = new Logger(
    WealthKernelBrokerageIntegrationPerformanceDomainService.name
  );

  constructor(
    private readonly wealthKernelDomainHelpers: WealthKernelIntegrationHelpersServiceBase,
    private readonly wealthKernelPerformanceApi: WealthKernelPerformanceApiRepositoryServiceBase
  ) {}

  private getInnerLoggerContext(logPrefix: string): string {
    return `${WealthKernelBrokerageIntegrationPerformanceDomainService.name}.${logPrefix}`;
  }

  public async List(
    requestId: string,
    tenantId: string,
    input: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPerformanceQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPerformanceQueryResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.List.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      input,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      const innerLoggerContext: string = this.getInnerLoggerContext(logPrefix);
      const result =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPerformanceQueryResponseDto>(
          new Logger(innerLoggerContext),
          async () => {
            return this.wealthKernelPerformanceApi.List(
              requestId,
              tokenObject.token,
              input
            );
          }
        );

      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      throw error;
    }
  }
}
