import { IWealthKernelConfigDto } from '@bambu/server-core/configuration';
import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { handleWealthKernelConnectorError } from './wealth-kernel-connector-repositories.utils';

export abstract class WealthKernelConnectorDirectDebitApiRepositoryServiceBase {
  public abstract ListMandates(
    requestId: string,
    tenantId: string,
    input: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateListAllResponseDto>;

  public abstract CreateMandate(
    requestId: string,
    tenantId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateMutableDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto>;

  public abstract GetMandatePdf(
    requestId: string,
    tenantId: string,
    mandateId: string
  ): Promise<ArrayBuffer>;

  public abstract CancelMandate(
    requestId: string,
    tenantId: string,
    mandateId: string
  ): Promise<void>;

  public abstract GetMandatePdfPreview(
    requestId: string,
    tenantId: string,
    bankAccountId: string
  ): Promise<ArrayBuffer>;

  public abstract GetNextPossiblePaymentDate(
    requestId: string,
    tenantId: string,
    mandateId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateNextPossibleConnectionDateDto>;

  public abstract CreatePayment(
    requestId: string,
    tenantId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentMutableDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreatePaymentResDto>;

  public abstract ListPayments(
    requestId: string,
    tenantId: string,
    input: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllResponseDto>;

  public abstract CancelPayment(
    requestId: string,
    tenantId: string,
    paymentId: string
  ): Promise<void>;

  public abstract CreateSubscription(
    requestId: string,
    tenantId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreateSubscriptionReqDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreateSubscriptionResDto>;

  public abstract ListSubscriptions(
    requestId: string,
    tenantId: string,
    input: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllResponseDto>;

  public abstract UpdateSubscription(
    requestId: string,
    tenantId: string,
    subscriptionId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpdateSubscriptionDto
  ): Promise<void>;

  public abstract ListUpcomingSubscriptions(
    requestId: string,
    tenantId: string,
    subscriptionId: string
  ): Promise<
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpcomingSubscriptionDto[]
  >;

  public abstract PauseSubscription(
    requestId: string,
    tenantId: string,
    subscriptionId: string
  ): Promise<void>;

  public abstract ResumeSubscription(
    requestId: string,
    tenantId: string,
    subscriptionId: string
  ): Promise<void>;

  public abstract CancelSubscription(
    requestId: string,
    tenantId: string,
    subscriptionId: string
  ): Promise<void>;

  public abstract GetMandateById(
    requestId: string,
    payload: {
      tenantId: string;
      mandateId: string;
    }
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto>;

  public abstract GetPaymentById(
    requestId: string,
    tenantId: string,
    paymentId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentDto>;

  public abstract GetSubscriptionById(
    requestId: string,
    tenantId: string,
    subscriptionId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitGetSubscriptionDto>;
}

@Injectable()
export class WealthKernelConnectorDirectDebitApiRepositoryService
  implements WealthKernelConnectorDirectDebitApiRepositoryServiceBase
{
  private readonly logger = new Logger(
    WealthKernelConnectorDirectDebitApiRepositoryService.name
  );
  private readonly baseUrl: string;

  constructor(
    private readonly config: ConfigService<IWealthKernelConfigDto>,
    private readonly httpService: HttpService
  ) {
    const wkConfig = this.config.getOrThrow('wealthKernelConfig', {
      infer: true,
    });
    const {
      connector: { baseUrl },
    } = wkConfig;

    this.baseUrl = baseUrl;
  }

  public async ListMandates(
    requestId: string,
    tenantId: string,
    input: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListMandates.name,
      requestId
    );
    try {
      this.logger.debug(`${logPrefix} Payload: ${JsonUtils.Stringify(input)}`);
      const queryParams = this.generateQueryStrings(
        tenantId,
        input as unknown as Record<string, unknown>
      );
      const url = `${
        this.baseUrl
      }/v1/direct-debit/mandate?${queryParams.toString()}`;
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateListAllResponseDto>(
          url
        );
      const response = await firstValueFrom(source);
      this.logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(response)}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          input,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  private generateQueryStrings(
    tenantId: string,
    additionalParameters?: Record<string, unknown>
  ): URLSearchParams {
    const queryParams = new URLSearchParams();
    queryParams.append('tenantId', tenantId);

    if (!additionalParameters) {
      return queryParams;
    }

    Object.keys(additionalParameters).forEach((key) => {
      const obj = additionalParameters as unknown as Record<string, unknown>;

      if (obj[key] !== undefined && obj[key] !== null) {
        queryParams.append(key, String(obj[key]));
      }
    });

    return queryParams;
  }

  public async GetMandateById(
    requestId: string,
    payload: {
      tenantId: string;
      mandateId: string;
    }
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetMandateById.name,
      requestId
    );
    this.logger.debug(
      `${logPrefix} Start. Input: ${JsonUtils.Stringify(payload)}`
    );
    try {
      const { mandateId, tenantId } = payload;
      const params: URLSearchParams = this.generateQueryStrings(tenantId);
      const url = `${
        this.baseUrl
      }/v1/direct-debit/mandate/${mandateId}?${params.toString()}`;
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto>(
          url
        );
      const response = await firstValueFrom(source);
      this.logger.debug(
        `${logPrefix} End. Result: ${JsonUtils.Stringify(response.data)}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          payload,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async CreateMandate(
    requestId: string,
    tenantId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateMutableDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateMandate.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      payload,
    };
    try {
      this.logger.debug(
        `${logPrefix} Payload: ${JsonUtils.Stringify(loggingPayload)}`
      );
      const params: URLSearchParams = this.generateQueryStrings(tenantId);
      const url = `${
        this.baseUrl
      }/v1/direct-debit/mandate?${params.toString()}`;
      const source =
        this.httpService.post<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto>(
          url,
          payload
        );
      const response = await firstValueFrom(source);
      this.logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(response)}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          payload,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async GetMandatePdf(
    requestId: string,
    tenantId: string,
    mandateId: string
  ): Promise<ArrayBuffer> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetMandatePdf.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      mandateId,
    };

    try {
      this.logger.debug(
        `${logPrefix} Payload: ${JsonUtils.Stringify(loggingPayload)}`
      );

      const queryParams = this.generateQueryStrings(tenantId);
      const url = `${this.baseUrl}/v1/direct-debit/mandate/${mandateId}/retrieve-mandate-pdf?${queryParams}`;
      const source = this.httpService.get<ArrayBuffer>(url);
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}.`);
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          tenantId,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async CancelMandate(
    requestId: string,
    tenantId: string,
    mandateId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CancelMandate.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      mandateId,
    };

    try {
      this.logger.debug(
        `${logPrefix} Payload: ${JsonUtils.Stringify(loggingPayload)}`
      );
      const queryParams = this.generateQueryStrings(tenantId);
      const url = `${this.baseUrl}/v1/direct-debit/mandate/${mandateId}/actions/cancel/?${queryParams}`;
      const source = this.httpService.post<void>(url);
      await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End.`);
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async GetMandatePdfPreview(
    requestId: string,
    tenantId: string,
    bankAccountId: string
  ): Promise<ArrayBuffer> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetMandatePdfPreview.name,
      requestId
    );

    const loggingPayload: Record<string, unknown> = {
      tenantId,
      bankAccountId,
    };

    try {
      this.logger.debug(
        `${logPrefix} Payload: ${JsonUtils.Stringify(loggingPayload)}`
      );

      const queryParams = this.generateQueryStrings(tenantId, {
        bankAccountId: bankAccountId,
      });
      const url = `${this.baseUrl}/v1/direct-debit/mandate/mandate-pdf-preview?${queryParams}`;
      const source = this.httpService.get<ArrayBuffer>(url);
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}.`);
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          tenantId,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async GetNextPossiblePaymentDate(
    requestId: string,
    tenantId: string,
    mandateId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateNextPossibleConnectionDateDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetNextPossiblePaymentDate.name,
      requestId
    );

    const loggingPayload: Record<string, unknown> = {
      tenantId,
      mandateId,
    };

    try {
      this.logger.debug(
        `${logPrefix} Payload: ${JsonUtils.Stringify(loggingPayload)}`
      );
      const queryParams = this.generateQueryStrings(tenantId);
      const url = `${this.baseUrl}/v1/direct-debit/mandate/${mandateId}/next-possible-collection-date?${queryParams}`;
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateNextPossibleConnectionDateDto>(
          url
        );
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End. ${response.data}`);
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async CreatePayment(
    requestId: string,
    tenantId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentMutableDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreatePaymentResDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreatePayment.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      payload,
    };
    try {
      this.logger.debug(
        `${logPrefix} Payload: ${JsonUtils.Stringify(loggingPayload)}`
      );
      const params: URLSearchParams = this.generateQueryStrings(tenantId);
      const url = `${
        this.baseUrl
      }/v1/direct-debit/payment?${params.toString()}`;
      const source =
        this.httpService.post<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreatePaymentResDto>(
          url,
          payload
        );
      const response = await firstValueFrom(source);
      this.logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(response)}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          payload,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async CancelPayment(
    requestId: string,
    tenantId: string,
    paymentId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CancelPayment.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      paymentId,
    };

    try {
      this.logger.debug(
        `${logPrefix} Payload: ${JsonUtils.Stringify(loggingPayload)}`
      );
      const queryParams = this.generateQueryStrings(tenantId);
      const url = `${this.baseUrl}/v1/direct-debit/payment/${paymentId}/actions/cancel/?${queryParams}`;
      const source = this.httpService.post<void>(url);
      await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End.`);
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async ListPayments(
    requestId: string,
    tenantId: string,
    input: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListPayments.name,
      requestId
    );
    try {
      this.logger.debug(`${logPrefix} Payload: ${JsonUtils.Stringify(input)}`);
      const queryParams = this.generateQueryStrings(
        tenantId,
        input as unknown as Record<string, unknown>
      );
      const url = `${
        this.baseUrl
      }/v1/direct-debit/payment?${queryParams.toString()}`;
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllResponseDto>(
          url
        );
      const response = await firstValueFrom(source);
      this.logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(response)}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async GetPaymentById(
    requestId: string,
    tenantId: string,
    paymentId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetPaymentById.name,
      requestId
    );
    const loggingPayload = { tenantId, paymentId };
    this.logger.debug(
      `${logPrefix} Start. Input: ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      const queryParams = this.generateQueryStrings(tenantId);
      const url = `${
        this.baseUrl
      }/v1/direct-debit/payment/${paymentId}?${queryParams.toString()}`;
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentDto>(
          url
        );
      const response = await firstValueFrom(source);
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          loggingPayload,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async CreateSubscription(
    requestId: string,
    tenantId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreateSubscriptionReqDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreateSubscriptionResDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateSubscription.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      payload,
    };
    try {
      this.logger.debug(
        `${logPrefix} Payload: ${JsonUtils.Stringify(loggingPayload)}`
      );
      const params: URLSearchParams = this.generateQueryStrings(tenantId);
      const url = `${
        this.baseUrl
      }/v1/direct-debit/subscription?${params.toString()}`;
      const source =
        this.httpService.post<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreateSubscriptionResDto>(
          url,
          payload
        );
      const response = await firstValueFrom(source);
      this.logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(response)}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          payload,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async ListSubscriptions(
    requestId: string,
    tenantId: string,
    input: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListSubscriptions.name,
      requestId
    );
    try {
      this.logger.debug(`${logPrefix} Payload: ${JsonUtils.Stringify(input)}`);
      const queryParams = this.generateQueryStrings(
        tenantId,
        input as unknown as Record<string, unknown>
      );
      const url = `${
        this.baseUrl
      }/v1/direct-debit/subscription?${queryParams.toString()}`;
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllResponseDto>(
          url
        );
      const response = await firstValueFrom(source);
      this.logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(response)}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          input,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async GetSubscriptionById(
    requestId: string,
    tenantId: string,
    subscriptionId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitGetSubscriptionDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetSubscriptionById.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      subscriptionId,
    };
    try {
      this.logger.debug(
        `${logPrefix} Payload: ${JsonUtils.Stringify(loggingPayload)}`
      );
      const queryParams = this.generateQueryStrings(tenantId);
      const url = `${
        this.baseUrl
      }/v1/direct-debit/subscription/${subscriptionId}?${queryParams.toString()}`;
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitGetSubscriptionDto>(
          url
        );
      const response = await firstValueFrom(source);
      this.logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(response.data)}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          subscriptionId,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async ListUpcomingSubscriptions(
    requestId: string,
    tenantId: string,
    subscriptionId: string
  ): Promise<
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpcomingSubscriptionDto[]
  > {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListUpcomingSubscriptions.name,
      requestId
    );

    const loggingPayload: Record<string, unknown> = {
      tenantId,
      subscriptionId,
    };

    try {
      this.logger.debug(
        `${logPrefix} Payload: ${JsonUtils.Stringify(loggingPayload)}`
      );

      const queryParam = this.generateQueryStrings(tenantId);
      const url = `${
        this.baseUrl
      }/v1/direct-debit/subscription/${subscriptionId}/upcoming-payments?${queryParam.toString()}`;
      const source = this.httpService.get(url);
      const response = await firstValueFrom(source);
      this.logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(response.data)}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          subscriptionId,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async UpdateSubscription(
    requestId: string,
    tenantId: string,
    subscriptionId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpdateSubscriptionDto
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CancelMandate.name,
      requestId
    );

    const loggingPayload: Record<string, unknown> = {
      tenantId,
      payload,
    };

    try {
      this.logger.debug(
        `${logPrefix}Start, Payload: ${JsonUtils.Stringify(loggingPayload)}`
      );
      const queryParams = this.generateQueryStrings(tenantId);
      const url = `${this.baseUrl}/v1/direct-debit/subscription/${subscriptionId}?${queryParams}`;
      const source = this.httpService.patch<void>(url, payload);
      await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End.`);
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          tenantId,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
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

    try {
      this.logger.debug(
        `${logPrefix} Start: ${JsonUtils.Stringify(subscriptionId)}`
      );
      const queryParams = this.generateQueryStrings(tenantId);
      const url = `${
        this.baseUrl
      }/v1/direct-debit/subscription/${subscriptionId}/actions/pause?${queryParams.toString()}`;
      const source = this.httpService.post<void>(url);
      await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End. `);
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
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

    try {
      this.logger.debug(
        `${logPrefix} Start: ${JsonUtils.Stringify(subscriptionId)}`
      );
      const queryParams = this.generateQueryStrings(tenantId);
      const url = `${
        this.baseUrl
      }/v1/direct-debit/subscription/${subscriptionId}/actions/cancel?${queryParams.toString()}`;
      const source = this.httpService.post<void>(url);
      await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End. `);
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async ResumeSubscription(
    requestId: string,
    tenantId: string,
    subscriptionId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ResumeSubscription.name,
      requestId
    );

    try {
      this.logger.debug(
        `${logPrefix} Start: ${JsonUtils.Stringify(subscriptionId)}`
      );
      const queryParams = this.generateQueryStrings(tenantId);
      const url = `${
        this.baseUrl
      }/v1/direct-debit/subscription/${subscriptionId}/actions/resume?${queryParams.toString()}`;
      const source = this.httpService.post<void>(url);
      await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End. `);
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }
}
