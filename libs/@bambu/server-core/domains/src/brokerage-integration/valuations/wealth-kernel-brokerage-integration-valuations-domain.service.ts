// noinspection ES6PreferShortImport

import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { WealthKernelValuationsApiRepositoryServiceBase } from '@bambu/server-core/repositories';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { Injectable, Logger } from '@nestjs/common';
import { WealthKernelIntegrationHelpersServiceBase } from '../brokerage-integration-domain-helpers';
import { BrokerageIntegrationValuationsDomainBaseService } from './brokerage-integration-valuations-domain-base.service';

@Injectable()
export class WealthKernelBrokerageIntegrationValuationsDomainService
  implements BrokerageIntegrationValuationsDomainBaseService
{
  private readonly logger: Logger = new Logger(
    WealthKernelBrokerageIntegrationValuationsDomainService.name
  );

  constructor(
    private readonly wealthKernelDomainHelpers: WealthKernelIntegrationHelpersServiceBase,
    private readonly wealthKernelValuationsApi: WealthKernelValuationsApiRepositoryServiceBase
  ) {}

  private getInnerLoggerContext(logPrefix: string): string {
    return `${WealthKernelBrokerageIntegrationValuationsDomainService.name}.${logPrefix}`;
  }

  public async GetPortfolioValuationsForParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokeragePartyAccountId: string,
    brokeragePortfolioId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllQueryParamsBaseDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationValuationListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetPortfolioValuationsForParty.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      brokeragePartyId,
      brokeragePartyAccountId,
      brokeragePortfolioId,
      queryParams,
    };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      await this.guardValuationRequest(
        requestId,
        tenantId,
        brokeragePartyId,
        brokeragePartyAccountId,
        brokeragePortfolioId
      );

      return await this.List(requestId, tenantId, {
        ...queryParams,
        portfolioId: brokeragePortfolioId,
      });
    } catch (error) {
      const errorMessage: string = [
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

  private async guardValuationRequest(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokeragePartyAccountId: string,
    brokeragePortfolioId: string
  ): Promise<void> {
    const [party, account, portfolio] = await Promise.all([
      this.wealthKernelDomainHelpers.GetPartyById(
        requestId,
        tenantId,
        brokeragePartyId
      ),
      this.wealthKernelDomainHelpers.GetBrokerageAccountById(
        requestId,
        tenantId,
        brokeragePartyAccountId
      ),
      this.wealthKernelDomainHelpers.GetPortfolioById(
        requestId,
        tenantId,
        brokeragePortfolioId
      ),
    ]);

    if (party.id !== account.owner) {
      throw this.wealthKernelDomainHelpers.GetBrokerageAccountNotFoundError(
        requestId,
        { party, account }
      );
    }

    if (account.id !== portfolio.accountId) {
      throw this.wealthKernelDomainHelpers.GetBrokeragePortfolioNotFoundError(
        requestId,
        { account, portfolio }
      );
    }
  }

  public async List(
    requestId: string,
    tenantId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationValuationListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationValuationListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.List.name,
      requestId
    );
    const loggingPayload = { tenantId, queryParams };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationValuationListAllResponseDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelValuationsApi.List(
              requestId,
              tokenObject.token,
              queryParams
            );
          }
        );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
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
