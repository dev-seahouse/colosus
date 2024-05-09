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

export abstract class WealthKernelDirectDebitPaymentsApiRepositoryBaseService {
  public abstract Get(
    requestId: string,
    token: string,
    paymentId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentDto>;

  public abstract List(
    requestId: string,
    token: string,
    input: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllResponseDto>;

  public abstract Create(
    requestId: string,
    token: string,
    idempotencyKey: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreatePaymentReqDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreatePaymentResDto>;

  public abstract Cancel(
    requestId: string,
    token: string,
    paymentId: string
  ): Promise<void>;
}

@Injectable()
export class WealthKernelDirectDebitPaymentsApiRepositoryService
  implements WealthKernelDirectDebitPaymentsApiRepositoryBaseService
{
  private readonly logger = new Logger(
    WealthKernelDirectDebitPaymentsApiRepositoryService.name
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

  public async Get(
    requestId: string,
    token: string,
    paymentId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Get.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      token,
      paymentId,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const url = `${this.baseUrl}/direct-debits/payments/${paymentId}`;
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentDto>(
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

  public async List(
    requestId: string,
    token: string,
    input: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.List.name,
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
      }/direct-debits/payments?${queryParams.toString()}`;
      const source = this.httpService.get<
        BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentDto[]
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

  public async Create(
    requestId: string,
    token: string,
    idempotencyKey: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreatePaymentReqDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreatePaymentResDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Create.name,
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
      const url = `${this.baseUrl}/direct-debits/payments`;
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
      /**
       * Doing this because it seems like 404 happens sometimes when trying to get the account after creation.
       * But it will succeed later. At times, it will work at the 1st try.
       *
       * Not sure how often this will happen as I do not have time to test it all but this should be a good enough.
       */
      // return await this.Get(requestId, token, id);
      const innerContext = `${WealthKernelDirectDebitPaymentsApiRepositoryService.name}.${this.Create.name}.${requestId}`;
      return await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreatePaymentResDto>(
        new Logger(innerContext),
        async () => {
          return this.Get(requestId, token, id);
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

  public async Cancel(
    requestId: string,
    token: string,
    paymentId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Cancel.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      token,
      paymentId,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const url = `${this.baseUrl}/direct-debits/payments/${paymentId}/actions/cancel`;
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
