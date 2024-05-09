// noinspection ES6PreferShortImport

import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import {
  TenantApiKeyCentralDbRepository,
  TenantCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { SharedEnums } from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import { WealthKernelIntegrationHelpersServiceBase } from './../brokerage-integration-domain-helpers';
import {
  BrokerageIntegrationAuthenticationDomainBaseService,
  IGetTenantIdsForBrokerageParamsDto,
} from './brokerage-integration-authentication-domain-base.service';

@Injectable()
export class WealthKernelBrokerageIntegrationAuthenticationDomainService
  implements BrokerageIntegrationAuthenticationDomainBaseService
{
  private readonly logger = new Logger(
    WealthKernelBrokerageIntegrationAuthenticationDomainService.name
  );
  private readonly currentBrokerageType =
    SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL;

  constructor(
    private readonly tenantCentralDb: TenantCentralDbRepositoryService,
    private readonly wealthKernelDomainHelpers: WealthKernelIntegrationHelpersServiceBase,
    private readonly tenantApiKeyCentralDb: TenantApiKeyCentralDbRepository
  ) {}

  async GetAuthenticationTokenFromCache(
    requestId: string,
    tenantId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto | null> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetAuthenticationTokenFromCache.name,
      requestId
    );

    this.logger.debug(`${logPrefix} Start.`);

    const token =
      await this.wealthKernelDomainHelpers.GetAuthenticationTokenFromCache(
        requestId,
        tenantId
      );

    this.logger.debug(`${logPrefix} End.`);

    return token;
  }

  async InitializeAuthenticationToken(
    requestId: string,
    tenantId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.InitializeAuthenticationToken.name,
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
      return await this.wealthKernelDomainHelpers.CreateAndCacheAuthenticationToken(
        requestId,
        tenantId
      );
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

  async GetTenantIdsForBrokerage(
    requestId: string,
    input: IGetTenantIdsForBrokerageParamsDto
  ): Promise<string[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetTenantIdsForBrokerage.name,
      requestId
    );

    this.logger.debug(
      `${logPrefix} Start. Input: ${JsonUtils.Stringify(input)}`
    );

    try {
      const { pageIndex, pageSize } = input;

      // const result = await this.tenantCentralDb.FindActiveTenantsForBrokerage(
      //   requestId,
      //   {
      //     brokerage: this.currentBrokerageType,
      //     pageIndex,
      //     pageSize,
      //   }
      // );
      //
      // const tenantIds = result.map((tenant) => tenant.id);
      const result = await this.tenantApiKeyCentralDb.GetApiKeyEntriesByType(
        requestId,
        SharedEnums.ApiKeyTypeEnum.WEALTH_KERNEL_API,
        pageIndex,
        pageSize
      );

      const tenantIds = result.map((tenant) => tenant.tenantId);

      this.logger.debug(
        `${logPrefix} End. TenantIds: ${JsonUtils.Stringify({
          tenantIds,
          result,
        })}`
      );

      return tenantIds;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error encountered.`,
          `Input: ${JsonUtils.Stringify(input)}`,
          `Error: ${JsonUtils.Stringify(error)}`,
        ].join(' ')
      );

      throw error;
    }
  }
}
