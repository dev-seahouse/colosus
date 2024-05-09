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

export abstract class WealthKernelPortfoliosApiRepositoryServiceBase {
  public abstract List(
    requestId: string,
    token: string,
    input: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPortfoliosQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPortfoliosResponseDto>;

  public abstract Get(
    requestId: string,
    token: string,
    id: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>;

  public abstract Create(
    requestId: string,
    token: string,
    idempotencyKey: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioMutableDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>;

  public abstract Update(
    requestId: string,
    token: string,
    portfolioId: string,
    payload: Pick<
      BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioMutableDto,
      'mandate'
    >
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>;

  public abstract Close(
    requestId: string,
    token: string,
    id: string
  ): Promise<void>;
}

@Injectable()
export class WealthKernelPortfoliosApiRepositoryService
  implements WealthKernelPortfoliosApiRepositoryServiceBase
{
  private readonly logger: Logger = new Logger(
    WealthKernelPortfoliosApiRepositoryServiceBase.name
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

  public async List(
    requestId: string,
    token: string,
    input: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPortfoliosQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPortfoliosResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.List.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      token,
      input,
    };
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
      const url = `${this.baseUrl}/portfolios?${queryParams.toString()}`;
      const source = this.httpService.get<
        BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto[]
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

  public async Get(
    requestId: string,
    token: string,
    id: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Get.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      token,
      id,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const url = `${this.baseUrl}/portfolios/${id}`;
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>(
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

  public async Create(
    requestId: string,
    token: string,
    idempotencyKey: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioMutableDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto> {
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
      const url = `${this.baseUrl}/portfolios`;
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
      const innerContext = `${WealthKernelPortfoliosApiRepositoryService.name}.${this.Create.name}.${requestId}`;
      return await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>(
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

  /**
   * This was a result of misunderstanding the API documentation.
   *
   * I assumed this is a general update API, it is not.
   * It is only meant to update the mandate of the portfolio.
   *
   * The good thing is that there is no general update API, so it still fits.
   * Only mandates can be updated.
   *
   * Should this change, we will need to refactor this.
   * @param requestId
   * @param token
   * @param portfolioId
   * @param payload
   * @constructor
   */
  public async Update(
    requestId: string,
    token: string,
    portfolioId: string,
    payload: Pick<
      BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioMutableDto,
      'mandate'
    >
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Update.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      token,
      portfolioId,
      payload,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const url = `${this.baseUrl}/portfolios/${portfolioId}/mandate`;
      const headers = helpers.getDefaultOpsApiHeaders(this.apiVersion, token);
      const source = this.httpService.put<void>(
        url,
        {
          ...payload.mandate,
        },
        {
          headers,
        }
      );
      await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End.`);
      /**
       * Doing this because it seems like 404 happens sometimes when trying to get the account after creation.
       * But it will succeed later. At times, it will work at the 1st try.
       *
       * Not sure how often this will happen as I do not have time to test it all but this should be a good enough.
       */
      // return await this.Get(requestId, token, id);
      const innerContext = `${WealthKernelPortfoliosApiRepositoryService.name}.${this.Create.name}.${requestId}`;
      return await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>(
        new Logger(innerContext),
        async () => {
          return this.Get(requestId, token, portfolioId);
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
  public async Close(
    requestId: string,
    token: string,
    id: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Close.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      token,
      id,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const url = `${this.baseUrl}/portfolios/${id}/actions/close`;
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
