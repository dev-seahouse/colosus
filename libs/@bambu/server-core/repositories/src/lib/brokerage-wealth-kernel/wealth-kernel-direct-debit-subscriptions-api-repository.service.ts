import { IWealthKernelConfigDto } from '@bambu/server-core/configuration';
import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IWealthKernelCreationSuccessDto } from './i-wealth-kernel-creation-success.dto';
import * as helpers from './wealth-kernel-api-repository.helpers';

export abstract class WealthKernelDirectDebitSubscriptionsApiRepositoryBaseService {
  public abstract GetSubscription(
    requestId: string,
    token: string,
    subscriptionId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitGetSubscriptionDto>;

  public abstract UpdateSubscription(
    requestId: string,
    token: string,
    subscriptionId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpdateSubscriptionDto
  ): Promise<void>;

  public abstract ListAllSubscriptions(
    requestId: string,
    token: string,
    input: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllResponseDto>;

  public abstract CreateSubscription(
    requestId: string,
    token: string,
    idempotencyKey: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreateSubscriptionReqDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitGetSubscriptionDto>;

  public abstract ListUpcomingSubscription(
    requestId: string,
    token: string,
    subscriptionId: string
  ): Promise<
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpcomingSubscriptionDto[]
  >;

  public abstract PauseSubscription(
    requestId: string,
    token: string,
    subscriptionId: string
  ): Promise<void>;

  public abstract ResumeSubscription(
    requestId: string,
    token: string,
    subscriptionId: string
  ): Promise<void>;

  public abstract CancelSubscription(
    requestId: string,
    token: string,
    subscriptionId: string
  ): Promise<void>;
}

@Injectable()
export class WealthKernelDirectDebitSubscriptionsApiRepositoryService
  implements WealthKernelDirectDebitSubscriptionsApiRepositoryBaseService
{
  private readonly logger = new Logger(
    WealthKernelDirectDebitSubscriptionsApiRepositoryService.name
  );

  private readonly baseUrl: string;
  private readonly apiVersion: string;

  constructor(
    private readonly config: ConfigService<IWealthKernelConfigDto>,
    private readonly httpService: HttpService
  ) {
    const wkConfig = this.config.getOrThrow('wealthKernelConfig', {
      infer: true,
    });
    const { opsApiBaseUrl, apiVersionHeader } = wkConfig;

    this.baseUrl = opsApiBaseUrl;
    this.apiVersion = apiVersionHeader;
  }

  public async GetSubscription(
    requestId: string,
    token: string,
    subscriptionId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitGetSubscriptionDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetSubscription.name,
      requestId
    );

    const loggingPayload: Record<string, unknown> = {
      token,
      subscriptionId,
    };

    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const url = `${this.baseUrl}/direct-debits/subscriptions/${subscriptionId}`;
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitGetSubscriptionDto>(
          url,
          {
            headers: helpers.getDefaultOpsApiHeaders(this.apiVersion, token),
          }
        );
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}.`);
      return response.data;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error encountered.`,
          `Input values: ${JsonUtils.Stringify(loggingPayload)}.`,
          `Error: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async CreateSubscription(
    requestId: string,
    token: string,
    idempotencyKey: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreateSubscriptionReqDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitGetSubscriptionDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateSubscription.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      token,
      idempotencyKey,
      payload,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );

    try {
      const url = `${this.baseUrl}/direct-debits/subscriptions`;
      const headers = helpers.getDefaultOpsApiHeaders(
        this.apiVersion,
        token,
        idempotencyKey
      );
      const source = this.httpService.post<IWealthKernelCreationSuccessDto>(
        url,
        payload,
        {
          headers,
        }
      );
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}.`);
      const {
        data: { id },
      } = response;
      const innerContext = `${WealthKernelDirectDebitSubscriptionsApiRepositoryService.name}.${this.CreateSubscription.name}.${requestId}`;
      return await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitGetSubscriptionDto>(
        new Logger(innerContext),
        async () => {
          return this.GetSubscription(requestId, token, id);
        },
        8,
        1000,
        [],
        [404]
      );
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error encountered.`,
          `Input values: ${JsonUtils.Stringify(loggingPayload)}.`,
          `Error: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async UpdateSubscription(
    requestId: string,
    token: string,
    subscriptionId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpdateSubscriptionDto
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateSubscription.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      token,
      subscriptionId,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );

    try {
      const url = `${this.baseUrl}/direct-debits/subscriptions/${subscriptionId}`;
      const headers = helpers.getDefaultOpsApiHeaders(this.apiVersion, token);
      const source = this.httpService.patch<void>(url, payload, {
        headers,
      });
      await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End:`);
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error encountered.`,
          `Input values: ${JsonUtils.Stringify(loggingPayload)}.`,
          `Error: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async ListAllSubscriptions(
    requestId: string,
    token: string,
    input: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListAllSubscriptions.name,
      requestId
    );

    const loggingPayload: Record<string, unknown> = { token, input };

    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const queryParams = new URLSearchParams();
      Object.keys(input).forEach((key) => {
        const obj = input as unknown as Record<string, unknown>;
        if (obj[key] !== undefined && obj[key] !== null) {
          queryParams.append(key, String(obj[key]));
        }
      });

      const url = `${
        this.baseUrl
      }/direct-debits/subscriptions?${queryParams.toString()}`;
      const source = this.httpService.get<
        BrokerageIntegrationServerDto.IBrokerageUkDirectDebitGetSubscriptionDto[]
      >(url, {
        headers: helpers.getDefaultOpsApiHeaders(this.apiVersion, token),
      });

      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}.`);
      const results = response.data;

      const paginationToken = response.headers['pagination-last'] || null;
      return {
        paginationToken,
        results,
      };
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error encountered.`,
          `Input values: ${JsonUtils.Stringify(loggingPayload)}.`,
          `Error: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async ListUpcomingSubscription(
    requestId: string,
    token: string,
    subscriptionId: string
  ): Promise<
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpcomingSubscriptionDto[]
  > {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListUpcomingSubscription.name,
      requestId
    );

    const loggingPayload: Record<string, unknown> = {
      token,
      subscriptionId,
    };

    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );

    try {
      const url = `${this.baseUrl}/direct-debits/subscriptions/${subscriptionId}/upcoming-payments`;
      const source = this.httpService.get<
        BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpcomingSubscriptionDto[]
      >(url, {
        headers: helpers.getDefaultOpsApiHeaders(this.apiVersion, token),
      });
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}.`);
      return response.data;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error encountered.`,
          `Input values: ${JsonUtils.Stringify(loggingPayload)}.`,
          `Error: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async CancelSubscription(
    requestId: string,
    token: string,
    subscriptionId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CancelSubscription.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      token,
      subscriptionId,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );

    try {
      const url = `${this.baseUrl}/direct-debits/subscriptions/${subscriptionId}/actions/cancel`;
      const headers: Record<string, string> = helpers.getDefaultOpsApiHeaders(
        this.apiVersion,
        token
      );
      const source = this.httpService.post<void>(url, undefined, {
        headers,
      });
      await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End.`);
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error encountered.`,
          `Input values: ${JsonUtils.Stringify(loggingPayload)}.`,
          `Error: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async PauseSubscription(
    requestId: string,
    token: string,
    subscriptionId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.PauseSubscription.name,
      requestId
    );

    const loggingPayload: Record<string, unknown> = {
      token,
      subscriptionId,
    };

    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );

    try {
      const url = `${this.baseUrl}/direct-debits/subscriptions/${subscriptionId}/actions/pause`;
      const headers: Record<string, string> = helpers.getDefaultOpsApiHeaders(
        this.apiVersion,
        token
      );

      const source = this.httpService.post<void>(url, undefined, {
        headers,
      });

      await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End.`);
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error encountered.`,
          `Input values: ${JsonUtils.Stringify(loggingPayload)}.`,
          `Error: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async ResumeSubscription(
    requestId: string,
    token: string,
    subscriptionId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.PauseSubscription.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      token,
      subscriptionId,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );

    try {
      const url = `${this.baseUrl}/direct-debits/subscriptions/${subscriptionId}/actions/resume`;
      const headers: Record<string, string> = helpers.getDefaultOpsApiHeaders(
        this.apiVersion,
        token
      );

      const source = this.httpService.post<void>(url, undefined, {
        headers,
      });

      await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End.`);
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error encountered.`,
          `Input values: ${JsonUtils.Stringify(loggingPayload)}.`,
          `Error: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }
}
