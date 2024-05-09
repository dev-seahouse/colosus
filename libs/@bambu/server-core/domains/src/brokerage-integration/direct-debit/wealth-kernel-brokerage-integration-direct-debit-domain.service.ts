// noinspection ES6PreferShortImport

import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import {
  WealthKernelDirectDebitMandatesApiRepositoryServiceBase,
  WealthKernelDirectDebitPaymentsApiRepositoryBaseService,
  WealthKernelDirectDebitSubscriptionsApiRepositoryBaseService,
} from '@bambu/server-core/repositories';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { SharedEnums } from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { WealthKernelIntegrationHelpersServiceBase } from '../brokerage-integration-domain-helpers';
import { BrokerageIntegrationDirectDebitDomainBaseService } from './brokerage-integration-direct-debit-domain-base.service';

@Injectable()
export class WealthKernelBrokerageIntegrationDirectDebitDomainService
  implements BrokerageIntegrationDirectDebitDomainBaseService
{
  private readonly logger = new Logger(
    WealthKernelBrokerageIntegrationDirectDebitDomainService.name
  );

  constructor(
    private readonly wealthKernelDomainHelpers: WealthKernelIntegrationHelpersServiceBase,
    private readonly wealthKernelDirectDebitMandatesApi: WealthKernelDirectDebitMandatesApiRepositoryServiceBase,
    private readonly wealthKernelDirectDebitPaymentsApi: WealthKernelDirectDebitPaymentsApiRepositoryBaseService,
    private readonly wealthKernelDirectDebitSubscriptionsApi: WealthKernelDirectDebitSubscriptionsApiRepositoryBaseService
  ) {}

  private getInnerLoggerContext(logPrefix: string): string {
    return `${WealthKernelBrokerageIntegrationDirectDebitDomainService.name}.${logPrefix}`;
  }

  public async List(
    requestId: string,
    tenantId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateListAllResponseDto> {
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
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateListAllResponseDto>(
          new Logger(innerLoggerContext),
          async () => {
            return this.wealthKernelDirectDebitMandatesApi.List(
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

  public async GetMandatePdfPreview(
    requestId: string,
    tenantId: string,
    bankAccountId: string
  ): Promise<[ArrayBuffer, string]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.List.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = { tenantId, bankAccountId };
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
      const response = await ErrorUtils.exponentialBackoff<ArrayBuffer>(
        new Logger(innerLoggerContext),
        async () => {
          return await this.wealthKernelDirectDebitMandatesApi.GetMandatePdfPreview(
            requestId,
            tokenObject.token,
            bankAccountId
          );
        }
      );
      return [response, 'application/pdf'];
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
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateMutableDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Create.name,
      requestId
    );
    const loggingPayload = { tenantId, payload, idempotencyKey };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    let creationIdempotencyKey: string = idempotencyKey;
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
        const hashBaseline = [
          tenantId,
          payload.bankAccountId,
          payload.partyId,
          requestId,
        ].join('.');
        const hash = crypto
          .createHash('md5')
          .update(hashBaseline)
          .digest('hex');
        creationIdempotencyKey = `create-direct-debit-mandate-${hash}`;
      }
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelDirectDebitMandatesApi.Create(
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

  public async Get(
    requestId: string,
    tenantId: string,
    brokerageUkDirectDebitMandateId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Get.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      brokerageUkDirectDebitMandateId,
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
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelDirectDebitMandatesApi.Get(
              requestId,
              tokenObject.token,
              brokerageUkDirectDebitMandateId
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
      this.handleDirectDebitMandateNotFoundError(
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

  public async Cancel(
    requestId: string,
    tenantId: string,
    brokerageUkDirectDebitMandateId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Cancel.name,
      requestId
    );

    const loggingPayload: Record<string, unknown> = {
      tenantId,
      brokerageUkDirectDebitMandateId,
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
      await ErrorUtils.exponentialBackoff(
        new Logger(innerLoggerContext),
        async () => {
          return await this.wealthKernelDirectDebitMandatesApi.Cancel(
            requestId,
            tokenObject.token,
            brokerageUkDirectDebitMandateId
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
      this.handleDirectDebitMandateNotFoundError(
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

  public async RetrieveMandatePdf(
    requestId: string,
    tenantId: string,
    mandateId: string
  ): Promise<[ArrayBuffer, string]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.RetrieveMandatePdf.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = { tenantId, mandateId };
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
      const response = await ErrorUtils.exponentialBackoff<ArrayBuffer>(
        new Logger(innerLoggerContext),
        async () => {
          return await this.wealthKernelDirectDebitMandatesApi.RetrieveMandatePdf(
            requestId,
            tokenObject.token,
            mandateId
          );
        }
      );
      return [response, 'application/pdf'];
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

  public async GetNextPossiblePaymentCollectionDate(
    requestId: string,
    tenantId: string,
    mandateId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateNextPossibleConnectionDateDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetNextPossiblePaymentCollectionDate.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = { tenantId, mandateId };
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
      const response = await ErrorUtils.exponentialBackoff(
        new Logger(innerLoggerContext),
        async () => {
          return await this.wealthKernelDirectDebitMandatesApi.GetNextPossiblePaymentCollectionDate(
            requestId,
            tokenObject.token,
            mandateId
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

  private handleDirectDebitMandateNotFoundError(
    error: unknown,
    requestId: string,
    metadata: unknown
  ): void {
    if (ErrorUtils.isErrorFromAxios(error)) {
      const axiosError = ErrorUtils.castErrorAsAxiosError(error);
      if (axiosError.response?.status === 404) {
        throw this.getDirectDebitMandateNotFoundError(requestId, metadata);
      }
    }
  }

  private getDirectDebitMandateNotFoundError(
    requestId: string,
    metadata: unknown
  ): ErrorUtils.ColossusError {
    return new ErrorUtils.ColossusError(
      `The brokerage direct debit mandate was not found.`,
      requestId,
      metadata,
      404,
      SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.BROKERAGE_DIRECT_DEBIT_MANDATE_NOT_FOUND
    );
  }

  // Direct Debit Payments

  public async GetPayment(
    requestId: string,
    tenantId: string,
    brokerageUkDirectDebitpaymentId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Get.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      brokerageUkDirectDebitpaymentId,
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
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelDirectDebitPaymentsApi.Get(
              requestId,
              tokenObject.token,
              brokerageUkDirectDebitpaymentId
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
      this.handleDirectDebitPaymentNotFoundError(
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

  public async CreatePayment(
    requestId: string,
    tenantId: string,
    idempotencyKey: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreatePaymentReqDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreatePaymentResDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreatePayment.name,
      requestId
    );
    const loggingPayload = { tenantId, payload, idempotencyKey };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    let creationIdempotencyKey: string = idempotencyKey;
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
        const hashBaseline = [
          tenantId,
          payload.amount,
          payload.mandateId,
          requestId,
        ].join('.');
        const hash = crypto
          .createHash('md5')
          .update(hashBaseline)
          .digest('hex');
        creationIdempotencyKey = `create-direct-debit-payment-${hash}`;
      }
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreatePaymentResDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelDirectDebitPaymentsApi.Create(
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

  public async ListPayments(
    requestId: string,
    tenantId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllResponseDto> {
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
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllResponseDto>(
          new Logger(innerLoggerContext),
          async () => {
            return this.wealthKernelDirectDebitPaymentsApi.List(
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

  public async CancelPayment(
    requestId: string,
    tenantId: string,
    brokerageUkDirectDebitpaymentId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Cancel.name,
      requestId
    );

    const loggingPayload: Record<string, unknown> = {
      tenantId,
      brokerageUkDirectDebitpaymentId,
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
      await ErrorUtils.exponentialBackoff(
        new Logger(innerLoggerContext),
        async () => {
          return await this.wealthKernelDirectDebitPaymentsApi.Cancel(
            requestId,
            tokenObject.token,
            brokerageUkDirectDebitpaymentId
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
      this.handleDirectDebitPaymentNotFoundError(
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

  private handleDirectDebitPaymentNotFoundError(
    error: unknown,
    requestId: string,
    metadata: unknown
  ): void {
    if (ErrorUtils.isErrorFromAxios(error)) {
      const axiosError = ErrorUtils.castErrorAsAxiosError(error);
      if (axiosError.response?.status === 404) {
        throw this.getDirectDebitPaymentNotFoundError(requestId, metadata);
      }
    }
  }

  private getDirectDebitPaymentNotFoundError(
    requestId: string,
    metadata: unknown
  ): ErrorUtils.ColossusError {
    return new ErrorUtils.ColossusError(
      `The brokerage direct debit mandate was not found.`,
      requestId,
      metadata,
      404,
      SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.BROKERAGE_DIRECT_DEBIT_MANDATE_NOT_FOUND
    );
  }

  // Direct Debit Subscriptions

  public async GetSubscription(
    requestId: string,
    tenantId: string,
    subscriptionId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitGetSubscriptionDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetSubscription.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      subscriptionId,
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
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitGetSubscriptionDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelDirectDebitSubscriptionsApi.GetSubscription(
              requestId,
              tokenObject.token,
              subscriptionId
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
      this.handleDirectDebitSubscriptionNotFoundError(
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

  public async UpdateSubscription(
    requestId: string,
    tenantId: string,
    subscriptionId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpdateSubscriptionDto
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateSubscription.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      subscriptionId,
      payload,
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
      const response = await ErrorUtils.exponentialBackoff<void>(
        new Logger(innerLoggerContext),
        async () => {
          return await this.wealthKernelDirectDebitSubscriptionsApi.UpdateSubscription(
            requestId,
            tokenObject.token,
            subscriptionId,
            payload
          );
        }
      );
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}.`,
        `Error: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.handleDirectDebitSubscriptionNotFoundError(
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

  public async ListAllSubscriptions(
    requestId: string,
    tenantId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListAllSubscriptions.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      queryParams,
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
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllResponseDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelDirectDebitSubscriptionsApi.ListAllSubscriptions(
              requestId,
              tokenObject.token,
              queryParams
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
      this.handleDirectDebitSubscriptionNotFoundError(
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

  public async CreateSubscription(
    requestId: string,
    tenantId: string,
    idempotencyKey: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreateSubscriptionReqDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitGetSubscriptionDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateSubscription.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      payload,
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
      if (idempotencyKey === undefined || idempotencyKey === null) {
        const hashBaseline = [
          tenantId,
          payload.mandateId,
          payload.portfolioId,
          requestId,
        ].join('.');
        const hash = crypto
          .createHash('md5')
          .update(hashBaseline)
          .digest('hex');
        idempotencyKey = `create-direct-debit-subscription-${hash}`;
      }
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitGetSubscriptionDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelDirectDebitSubscriptionsApi.CreateSubscription(
              requestId,
              tokenObject.token,
              idempotencyKey,
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
        idempotencyKey,
        loggingPayload
      );
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  public async ListUpcomingSubscription(
    requestId: string,
    tenantId: string,
    subscriptionId: string
  ): Promise<
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpcomingSubscriptionDto[]
  > {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListUpcomingSubscription.name,
      requestId
    );
    const loggingPayload = { tenantId, subscriptionId };
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
      const response = await ErrorUtils.exponentialBackoff<
        BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpcomingSubscriptionDto[]
      >(new Logger(innerLoggerContext), async () => {
        return this.wealthKernelDirectDebitSubscriptionsApi.ListUpcomingSubscription(
          requestId,
          tokenObject.token,
          subscriptionId
        );
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

  public async PauseSubscription(
    requestId: string,
    tenantId: string,
    subscriptionId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.PauseSubscription.name,
      requestId
    );

    const loggingPayload: Record<string, unknown> = {
      tenantId,
      subscriptionId,
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
      await ErrorUtils.exponentialBackoff(
        new Logger(innerLoggerContext),
        async () => {
          return await this.wealthKernelDirectDebitSubscriptionsApi.PauseSubscription(
            requestId,
            tokenObject.token,
            subscriptionId
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
      this.handleDirectDebitSubscriptionNotFoundError(
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

  public async ResumeSubscription(
    requestId: string,
    tenantId: string,
    subscriptionId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.PauseSubscription.name,
      requestId
    );

    const loggingPayload: Record<string, unknown> = {
      tenantId,
      subscriptionId,
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
      await ErrorUtils.exponentialBackoff(
        new Logger(innerLoggerContext),
        async () => {
          return await this.wealthKernelDirectDebitSubscriptionsApi.ResumeSubscription(
            requestId,
            tokenObject.token,
            subscriptionId
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
      this.handleDirectDebitSubscriptionNotFoundError(
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

  public async CancelSubscription(
    requestId: string,
    tenantId: string,
    subscriptionId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CancelSubscription.name,
      requestId
    );

    const loggingPayload: Record<string, unknown> = {
      tenantId,
      subscriptionId,
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
      await ErrorUtils.exponentialBackoff(
        new Logger(innerLoggerContext),
        async () => {
          return await this.wealthKernelDirectDebitSubscriptionsApi.CancelSubscription(
            requestId,
            tokenObject.token,
            subscriptionId
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
      this.handleDirectDebitSubscriptionNotFoundError(
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

  private handleDirectDebitSubscriptionNotFoundError(
    error: unknown,
    requestId: string,
    metadata: unknown
  ): void {
    if (ErrorUtils.isErrorFromAxios(error)) {
      const axiosError = ErrorUtils.castErrorAsAxiosError(error);
      if (axiosError.response?.status === 404) {
        throw this.getDirectDebitSubscriptionNotFoundError(requestId, metadata);
      }
    }
  }
  private getDirectDebitSubscriptionNotFoundError(
    requestId: string,
    metadata: unknown
  ): ErrorUtils.ColossusError {
    return new ErrorUtils.ColossusError(
      `The brokerage direct debit subscription was not found.`,
      requestId,
      metadata,
      404,
      SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.BROKERAGE_DIRECT_DEBIT_MANDATE_NOT_FOUND
    );
  }
}
