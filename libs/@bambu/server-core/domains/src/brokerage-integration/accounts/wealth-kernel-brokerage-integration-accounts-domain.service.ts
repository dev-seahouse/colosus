// noinspection ES6PreferShortImport

import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { WealthKernelAccountsApiRepositoryServiceBase } from '@bambu/server-core/repositories';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { SharedEnums } from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import { WealthKernelIntegrationHelpersServiceBase } from '../brokerage-integration-domain-helpers';
import { BrokerageIntegrationAccountsDomainBaseService } from './brokerage-integration-accounts-domain-base.service';

@Injectable()
export class WealthKernelBrokerageIntegrationAccountsDomainService
  implements BrokerageIntegrationAccountsDomainBaseService
{
  private readonly logger = new Logger(
    WealthKernelBrokerageIntegrationAccountsDomainService.name
  );

  constructor(
    private readonly wealthKernelDomainHelpers: WealthKernelIntegrationHelpersServiceBase,
    private readonly wealthKernelAccountsApi: WealthKernelAccountsApiRepositoryServiceBase
  ) {}

  private getInnerLoggerContext(logPrefix: string): string {
    return `${WealthKernelBrokerageIntegrationAccountsDomainService.name}.${logPrefix}`;
  }

  public async Close(
    requestId: string,
    tenantId: string,
    brokerageAccountId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Close.name,
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
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      const innerLoggerContext: string = this.getInnerLoggerContext(logPrefix);

      await ErrorUtils.exponentialBackoff<void>(
        new Logger(innerLoggerContext),
        async () => {
          return this.wealthKernelAccountsApi.Close(
            requestId,
            tokenObject.token,
            brokerageAccountId
          );
        }
      );
      this.logger.debug(`${logPrefix} End.`);
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}.`,
        `Error: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.handleBrokerageAccountNotFoundError(
        error,
        requestId,
        loggingPayload
      );
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  public async CloseAccountForParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokerageAccountId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CloseAccountForParty.name,
      requestId
    );

    const loggingPayload: Record<string, unknown> = {
      tenantId,
      brokeragePartyId,
      brokerageAccountId,
    };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}.`
    );

    // Checks if the user is present
    await this.GetAccountForParty(
      requestId,
      tenantId,
      brokeragePartyId,
      brokerageAccountId
    );

    try {
      await this.Close(requestId, tenantId, brokerageAccountId);
      this.logger.debug(`${logPrefix} End.`);
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}.`,
        `Error: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.handleBrokerageAccountNotFoundError(
        error,
        requestId,
        loggingPayload
      );
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  public async Create(
    requestId: string,
    tenantId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationAccountMutableDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto> {
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
      if (!creationIdempotencyKey) {
        creationIdempotencyKey = `ACCOUNT-${tenantId}-${payload.clientReference}`;
      }
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto>(
          new Logger(innerLoggerContext),
          async () => {
            return this.wealthKernelAccountsApi.Create(
              requestId,
              tokenObject.token,
              creationIdempotencyKey,
              payload
            );
          }
        );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}.`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
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

  public async CreateAccountForParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationAccountMutableDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateAccountForParty.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      brokeragePartyId,
      payload,
      idempotencyKey,
    };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}.`
    );

    if (brokeragePartyId !== payload.owner) {
      throw new ErrorUtils.ColossusError(
        `The brokerage account owner does not match the brokerage party id.`,
        requestId,
        loggingPayload,
        400,
        SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.BAD_BROKERAGE_REQUEST
      );
    }

    // Checks if the user is present
    await this.wealthKernelDomainHelpers.GetPartyById(
      requestId,
      tenantId,
      brokeragePartyId
    );
    try {
      const response = await this.Create(
        requestId,
        tenantId,
        payload,
        idempotencyKey
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
    brokerageAccountId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Get.name,
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
      const response =
        await this.wealthKernelDomainHelpers.GetBrokerageAccountById(
          requestId,
          tenantId,
          brokerageAccountId
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

  private handleBrokerageAccountNotFoundError(
    error: unknown,
    requestId: string,
    metadata: unknown
  ): void {
    return this.wealthKernelDomainHelpers.HandleBrokerageAccountNotFoundError(
      error,
      requestId,
      metadata
    );
  }

  private getBrokerageAccountNotFoundError(
    requestId: string,
    metadata: unknown
  ): ErrorUtils.ColossusError {
    return this.wealthKernelDomainHelpers.GetBrokerageAccountNotFoundError(
      requestId,
      metadata
    );
  }

  public async GetAccountForParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokerageAccountId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetAccountForParty.name,
      requestId
    );

    const loggingPayload: Record<string, unknown> = {
      tenantId,
      brokeragePartyId,
      brokerageAccountId,
    };

    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}.`
    );

    try {
      // Check if the party is valid
      await this.wealthKernelDomainHelpers.GetPartyById(
        requestId,
        tenantId,
        brokeragePartyId
      );
      const response = await this.Get(requestId, tenantId, brokerageAccountId);
      this.ensureRetrievedBrokerageAccountBelongsToParty(
        requestId,
        brokeragePartyId,
        response
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

  public ensureRetrievedBrokerageAccountBelongsToParty(
    requestId: string,
    brokeragePartyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto
  ): void {
    if (payload.owner !== brokeragePartyId) {
      throw this.getBrokerageAccountNotFoundError(requestId, {
        brokeragePartyId,
        payload,
      });
    }
  }

  public async GetAccountsForParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllQueryParamsBaseDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllAccountsResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetAccountsForParty.name,
      requestId
    );

    const loggingPayload: Record<string, unknown> = {
      tenantId,
      brokeragePartyId,
      queryParams,
    };

    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}.`
    );

    try {
      // Check if the party is valid
      await this.wealthKernelDomainHelpers.GetPartyById(
        requestId,
        tenantId,
        brokeragePartyId
      );
      const response = await this.List(requestId, tenantId, {
        ...queryParams,
        owner: brokeragePartyId,
      });
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

  public async List(
    requestId: string,
    tenantId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllAccountsQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllAccountsResponseDto> {
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
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllAccountsResponseDto>(
          new Logger(innerLoggerContext),
          async () => {
            return this.wealthKernelAccountsApi.List(
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
