// noinspection ES6PreferShortImport

import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { WealthKernelPortfoliosApiRepositoryServiceBase } from '@bambu/server-core/repositories';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { SharedEnums } from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import { WealthKernelIntegrationHelpersServiceBase } from '../brokerage-integration-domain-helpers';
import { BrokerageIntegrationPortfoliosDomainBaseService } from './brokerage-integration-portfolios-domain-base.service';

@Injectable()
export class WealthKernelBrokerageIntegrationPortfoliosDomainService
  implements BrokerageIntegrationPortfoliosDomainBaseService
{
  private readonly logger = new Logger(
    WealthKernelBrokerageIntegrationPortfoliosDomainService.name
  );

  constructor(
    private readonly wealthKernelDomainHelpers: WealthKernelIntegrationHelpersServiceBase,
    private readonly wealthKernelPortfoliosApi: WealthKernelPortfoliosApiRepositoryServiceBase
  ) {}

  private getInnerLoggerContext(logPrefix: string): string {
    return `${WealthKernelBrokerageIntegrationPortfoliosDomainService.name}.${logPrefix}`;
  }

  public async Close(
    requestId: string,
    tenantId: string,
    brokeragePortfolioId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Close.name,
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
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      const innerLoggerContext: string = this.getInnerLoggerContext(logPrefix);
      await ErrorUtils.exponentialBackoff<void>(
        new Logger(innerLoggerContext),
        async () => {
          await this.wealthKernelPortfoliosApi.Close(
            requestId,
            tokenObject.token,
            brokeragePortfolioId
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
      this.handleBrokeragePortfolioNotFoundError(
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

  public async CloseForPartyAccount(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokeragePartyAccountId: string,
    brokeragePortfolioId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CloseForPartyAccount.name,
      requestId
    );

    const loggingPayload = {
      tenantId,
      brokeragePartyId,
      brokeragePartyAccountId,
      brokeragePortfolioId,
    };

    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}.`
    );

    await this.GetPortfolioForPartyAccount(
      requestId,
      tenantId,
      brokeragePartyId,
      brokeragePartyAccountId,
      brokeragePortfolioId
    );

    try {
      await this.Close(requestId, tenantId, brokeragePortfolioId);
      this.logger.debug(`${logPrefix} End.`);
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

  public async Create(
    requestId: string,
    tenantId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioMutableDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto> {
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
        creationIdempotencyKey = `GOAL-${tenantId}-${payload.clientReference}`;
      }
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelPortfoliosApi.Create(
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

  public async CreateForPartyAccount(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokeragePartyAccountId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioMutableDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateForPartyAccount.name,
      requestId
    );

    const loggingPayload = {
      tenantId,
      brokeragePartyId,
      brokeragePartyAccountId,
      payload,
      idempotencyKey,
    };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}.`
    );

    if (payload.accountId !== brokeragePartyAccountId) {
      throw new ErrorUtils.ColossusError(
        `The brokerage portfolio account id in the payload does not match requested brokerage account id specified.`,
        requestId,
        loggingPayload,
        400,
        SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.BAD_BROKERAGE_REQUEST
      );
    }

    await this.guardAcquisitionByPartyAccount(
      requestId,
      tenantId,
      brokeragePartyId,
      brokeragePartyAccountId
    );

    try {
      const response = await this.Create(
        requestId,
        tenantId,
        payload,
        idempotencyKey
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

  public async Get(
    requestId: string,
    tenantId: string,
    brokeragePortfolioId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Get.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      brokeragePortfolioId,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const response = await this.wealthKernelDomainHelpers.GetPortfolioById(
        requestId,
        tenantId,
        brokeragePortfolioId
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
      this.handleBrokeragePortfolioNotFoundError(
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

  private handleBrokeragePortfolioNotFoundError(
    error: unknown,
    requestId: string,
    metadata: unknown
  ): void {
    this.wealthKernelDomainHelpers.HandleBrokeragePortfolioNotFoundError(
      error,
      requestId,
      metadata
    );
  }

  public async GetPortfolioForPartyAccount(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokeragePartyAccountId: string,
    brokeragePortfolioId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetPortfolioForPartyAccount.name,
      requestId
    );
    const loggingPayload = {
      tenantId,
      brokeragePartyId,
      brokeragePartyAccountId,
      brokeragePortfolioId,
    };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}.`
    );

    await this.guardAcquisitionByPartyAccount(
      requestId,
      tenantId,
      brokeragePartyId,
      brokeragePartyAccountId
    );

    try {
      const response = await this.Get(
        requestId,
        tenantId,
        brokeragePortfolioId
      );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}.`);

      this.guardReturnedPortfolioAgainstPartyAccount(
        requestId,
        brokeragePartyAccountId,
        response
      );

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

  private guardReturnedPortfolioAgainstPartyAccount(
    requestId: string,
    brokeragePartyAccountId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto
  ): void {
    if (payload.accountId !== brokeragePartyAccountId) {
      throw this.wealthKernelDomainHelpers.GetBrokeragePortfolioNotFoundError(
        requestId,
        {
          brokeragePartyAccountId,
          payload,
        }
      );
    }
  }

  public async GetPortfoliosForPartyAccount(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokeragePartyAccountId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllQueryParamsBaseDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPortfoliosResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetPortfoliosForPartyAccount.name,
      requestId
    );
    const loggingPayload = {
      tenantId,
      brokeragePartyId,
      brokeragePartyAccountId,
      queryParams,
    };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}.`
    );

    await this.guardAcquisitionByPartyAccount(
      requestId,
      tenantId,
      brokeragePartyId,
      brokeragePartyAccountId
    );

    try {
      const response = await this.List(requestId, tenantId, {
        ...queryParams,
        accountId: brokeragePartyAccountId,
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

  private async guardAcquisitionByPartyAccount(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokeragePartyAccountId: string
  ): Promise<void> {
    const [party, account] = await Promise.all([
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
    ]);

    if (party.id !== account.owner) {
      throw new ErrorUtils.ColossusError(
        `The brokerage account does not belong to the party.`,
        requestId,
        { tenantId, brokeragePartyId, brokeragePartyAccountId },
        404,
        SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.BROKERAGE_ACCOUNT_NOT_FOUND
      );
    }
  }

  public async List(
    requestId: string,
    tenantId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPortfoliosQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPortfoliosResponseDto> {
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
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPortfoliosResponseDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelPortfoliosApi.List(
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

  public async Update(
    requestId: string,
    tenantId: string,
    brokeragePortfolioId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioMutableDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Update.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      brokeragePortfolioId,
      payload,
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
      const {
        mandate: { type },
      } = payload;

      const updatePayload = {
        type,
      };

      Object.keys(payload.mandate).forEach((key) => {
        const value = payload.mandate[key];

        if (value !== undefined && value !== null) {
          updatePayload[key] = value;
        }
      });

      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelPortfoliosApi.Update(
              requestId,
              tokenObject.token,
              brokeragePortfolioId,
              {
                mandate: updatePayload,
              }
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
      this.handleBrokeragePortfolioNotFoundError(
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

  public async UpdateForPartyAccount(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokeragePartyAccountId: string,
    brokeragePortfolioId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioMutableDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateForPartyAccount.name,
      requestId
    );
    const loggingPayload = {
      tenantId,
      brokeragePartyId,
      brokeragePartyAccountId,
      brokeragePortfolioId,
      payload,
    };
    this.logger.debug(`${logPrefix} Start. ${JsonUtils.Stringify(payload)}.`);

    // Ensures that the portfolio belongs to the party account
    await this.GetPortfolioForPartyAccount(
      requestId,
      tenantId,
      brokeragePartyId,
      brokeragePartyAccountId,
      brokeragePortfolioId
    );

    try {
      const response = await this.Update(
        requestId,
        tenantId,
        brokeragePortfolioId,
        payload
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
      this.handleBrokeragePortfolioNotFoundError(
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
}
