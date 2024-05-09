import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { InvestorCentralDbRepositoryServiceBase } from '@bambu/server-core/repositories';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { ApisServiceBase } from './apis/apis.service';

@Injectable()
export class AppService {
  private readonly logger: Logger = new Logger(AppService.name);

  constructor(
    private readonly apisService: ApisServiceBase,
    private readonly investorCentralDb: InvestorCentralDbRepositoryServiceBase
  ) {}

  public async Run(): Promise<void> {
    const requestId = crypto.randomUUID();
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Run.name,
      requestId
    );
    this.logger.log(`${logPrefix} Start.`);

    let pageIndex = 0;
    const pageSize = 100;
    let itemsPresent = true;

    do {
      const results = await this.getTenants(requestId, pageIndex, pageSize);
      const numberOfItems = results.length;

      if (numberOfItems < 1) {
        itemsPresent = false;
        break;
      }

      for (let i = 0; i < numberOfItems; i++) {
        await this.processTenant(requestId, results[i]);
      }

      pageIndex += 1;
    } while (itemsPresent === true);

    this.logger.log(`${logPrefix} End.`);
  }

  private async getTenants(
    requestId: string,
    pageIndex = 0,
    pageSize = 100
  ): Promise<string[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.getTenants.name,
      requestId
    );
    this.logger.debug(`${logPrefix} Start.`);
    try {
      const tenants: string[] = await this.apisService.GetTenants(
        requestId,
        pageIndex,
        pageSize
      );
      this.logger.debug(`${logPrefix} End.`);
      return tenants;
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      throw error;
    }
  }

  private async processTenant(
    requestId: string,
    tenantId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.processTenant.name,
      requestId
    );
    this.logger.log(`${logPrefix} Start. Processing tenant: ${tenantId}.`);

    let pageIndex = 0;
    const pageSize = 100;
    let itemsPresent = true;

    do {
      const dbRows =
        await this.investorCentralDb.GetInvestorPlatformUserAccountsForTenant(
          requestId,
          tenantId,
          pageIndex,
          pageSize
        );

      if (dbRows.length < 1) {
        itemsPresent = false;
        this.logger.log(
          `${logPrefix} No more items to process for tenant: ${tenantId}.`
        );
        break;
      }

      for (let i = 0; i < dbRows.length; i += 1) {
        const { partnerAccountNumber, id } = dbRows[i];
        const brokerageAccountData = await this.getBrokerageAccountData(
          requestId,
          tenantId,
          partnerAccountNumber
        );

        if (
          !brokerageAccountData ||
          !Array.isArray(brokerageAccountData.results) ||
          brokerageAccountData.results.length < 1
        ) {
          this.logger.log(
            `${logPrefix} No brokerage account data found for tenant: ${tenantId}, partnerAccountNumber: ${partnerAccountNumber}.`
          );
          continue;
        }

        const brokerageAccount = brokerageAccountData.results[0];
        const { status } = brokerageAccount;

        this.logger.log(
          `${logPrefix} Processing tenant: ${tenantId}, partnerAccountNumber: ${partnerAccountNumber}, status: ${status}.`
        );

        await this.investorCentralDb.UpdateInvestorPlatformUserAccountStatusForTenant(
          requestId,
          tenantId,
          id,
          status
        );
      }

      pageIndex += 1;
    } while (itemsPresent === true);

    this.logger.log(`${logPrefix} Start. Processed tenant: ${tenantId}.`);
  }

  private async getBrokerageAccountData(
    requestId: string,
    tenantId: string,
    accountId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllAccountsResponseDto | null> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.getBrokerageAccountData.name,
      requestId
    );
    const loggingPayload = { tenantId, accountId };
    try {
      this.logger.debug(
        `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}`
      );
      const result = await this.apisService.GetBrokerageAccountData(
        requestId,
        tenantId,
        accountId
      );
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(result)}.`);
      return result;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error encountered.`,
          `Error: ${JsonUtils.Stringify(error)}.`,
          `Input: ${JsonUtils.Stringify(loggingPayload)}.`,
        ].join(' ')
      );
      // we won't fail the code, we will just return null to proceed to other items.
      // throw error;
      return null;
    }
  }
}
