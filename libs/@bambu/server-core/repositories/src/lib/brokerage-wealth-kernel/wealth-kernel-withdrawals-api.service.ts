import { IWealthKernelConfigDto } from '@bambu/server-core/configuration';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import {
  IBrokerageIntegrationListAllWithdrawalsQueryParamsDto,
  IBrokerageIntegrationListAllWithdrawalsQueryResponseDto,
  IBrokerageIntegrationWithdrawalDto,
  IBrokerageIntegrationWithdrawalMutableDto,
} from '@bambu/shared';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IWealthKernelCreationSuccessDto } from './i-wealth-kernel-creation-success.dto';
import * as helpers from './wealth-kernel-api-repository.helpers';

export abstract class WealthKernelWithdrawalsApiServiceBase {
  public abstract List(
    requestId: string,
    token: string,
    input: IBrokerageIntegrationListAllWithdrawalsQueryParamsDto
  ): Promise<IBrokerageIntegrationListAllWithdrawalsQueryResponseDto>;

  public abstract Get(
    requestId: string,
    token: string,
    id: string
  ): Promise<IBrokerageIntegrationWithdrawalDto>;

  public abstract Create(
    requestId: string,
    token: string,
    idempotencyKey: string,
    payload: IBrokerageIntegrationWithdrawalMutableDto
  ): Promise<IBrokerageIntegrationWithdrawalDto>;
}

@Injectable()
export class WealthKernelWithdrawalsApiService
  implements WealthKernelWithdrawalsApiServiceBase
{
  private readonly logger = new Logger(WealthKernelWithdrawalsApiService.name);
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

  public async List(
    requestId: string,
    token: string,
    input: IBrokerageIntegrationListAllWithdrawalsQueryParamsDto
  ): Promise<IBrokerageIntegrationListAllWithdrawalsQueryResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.List.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      token,
      input,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      const queryParams = new URLSearchParams();
      Object.keys(input).forEach((key) => {
        const obj = input as unknown as Record<string, unknown>;
        if (obj[key] !== undefined && obj[key] !== null) {
          queryParams.append(key, String(obj[key]));
        }
      });
      const url = `${this.baseUrl}/withdrawals?${queryParams.toString()}`;
      const source = this.httpService.get<IBrokerageIntegrationWithdrawalDto[]>(
        url,
        {
          headers: helpers.getDefaultOpsApiHeaders(this.apiVersion, token),
        }
      );
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}`);
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
          `Input values: ${JsonUtils.Stringify(input)}.`,
          `Error: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }
  public async Get(
    requestId: string,
    token: string,
    id: string
  ): Promise<IBrokerageIntegrationWithdrawalDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Get.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      token,
      id,
    };
    try {
      this.logger.debug(
        `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}`
      );
      const url = `${this.baseUrl}/withdrawals/${id}`;
      const source = this.httpService.get<IBrokerageIntegrationWithdrawalDto>(
        url,
        {
          headers: helpers.getDefaultOpsApiHeaders(this.apiVersion, token),
        }
      );
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}`);
      return response.data;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error encountered.`,
          `Input values: ${JsonUtils.Stringify({ id })}.`,
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
    payload: IBrokerageIntegrationWithdrawalMutableDto
  ): Promise<IBrokerageIntegrationWithdrawalDto> {
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
      const url = `${this.baseUrl}/withdrawals`;
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
      const innerContext = `${WealthKernelWithdrawalsApiService.name}.${this.Create.name}.${requestId}`;
      return await ErrorUtils.exponentialBackoff<IBrokerageIntegrationWithdrawalDto>(
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
          `Input values: ${JsonUtils.Stringify(payload)}.`,
          `Error: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }
}
