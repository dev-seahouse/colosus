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

export abstract class WealthKernelDirectDebitMandatesApiRepositoryServiceBase {
  public abstract List(
    requestId: string,
    token: string,
    input: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateListAllResponseDto>;

  public abstract Get(
    requestId: string,
    token: string,
    id: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto>;

  public abstract Create(
    requestId: string,
    token: string,
    idempotencyKey: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateMutableDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto>;

  public abstract Cancel(
    requestId: string,
    token: string,
    id: string
  ): Promise<void>;

  public abstract GetNextPossiblePaymentCollectionDate(
    requestId: string,
    token: string,
    id: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateNextPossibleConnectionDateDto>;

  public abstract GetMandatePdfPreview(
    requestId: string,
    token: string,
    bankAccountId: string
  ): Promise<ArrayBuffer>;

  public abstract RetrieveMandatePdf(
    requestId: string,
    token: string,
    mandateId: string
  ): Promise<ArrayBuffer>;
}

@Injectable()
export class WealthKernelDirectDebitMandatesApiRepositoryService
  implements WealthKernelDirectDebitMandatesApiRepositoryServiceBase
{
  private readonly logger = new Logger(
    WealthKernelDirectDebitMandatesApiRepositoryService.name
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
    input: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateListAllResponseDto> {
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
      }/direct-debits/mandates?${queryParams.toString()}`;
      const source = this.httpService.get<
        BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto[]
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
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto> {
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
      const url = `${this.baseUrl}/direct-debits/mandates/${id}`;
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto>(
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
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateMutableDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto> {
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
      const url = `${this.baseUrl}/direct-debits/mandates`;
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
      const innerContext = `${WealthKernelDirectDebitMandatesApiRepositoryService.name}.${this.Create.name}.${requestId}`;
      return await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto>(
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
    id: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Cancel.name,
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
      const url = `${this.baseUrl}/direct-debits/mandates/${id}/actions/cancel`;
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

  public async GetNextPossiblePaymentCollectionDate(
    requestId: string,
    token: string,
    id: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateNextPossibleConnectionDateDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetNextPossiblePaymentCollectionDate.name,
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
      const url = `${this.baseUrl}/direct-debits/mandates/${id}/next-possible-collection-date`;
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateNextPossibleConnectionDateDto>(
          url,
          {
            headers: {
              ...helpers.getDefaultOpsApiHeaders(this.apiVersion, token),
            },
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

  public async GetMandatePdfPreview(
    requestId: string,
    token: string,
    bankAccountId: string
  ): Promise<ArrayBuffer> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetMandatePdfPreview.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      token,
      bankAccountId,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const url: string = [
        this.baseUrl,
        '/direct-debits/mandate-pdf-preview',
        `?bankAccountId=${bankAccountId}`,
      ].join('');
      const source = this.httpService.get<ArrayBuffer>(url, {
        headers: {
          ...helpers.getDefaultOpsApiHeaders(this.apiVersion, token),
          Accept: 'application/pdf',
        },
        responseType: 'arraybuffer',
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

  public async RetrieveMandatePdf(
    requestId: string,
    token: string,
    mandateId: string
  ): Promise<ArrayBuffer> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.RetrieveMandatePdf.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      token,
      mandateId,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const url = `${this.baseUrl}/direct-debits/mandates/${mandateId}/pdf`;
      const source = this.httpService.get<ArrayBuffer>(url, {
        headers: {
          ...helpers.getDefaultOpsApiHeaders(this.apiVersion, token),
          Accept: 'application/pdf',
        },
        responseType: 'arraybuffer',
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
}
