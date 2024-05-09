import { IWealthKernelConfigDto } from '@bambu/server-core/configuration';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
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
import { handleWealthKernelConnectorError } from './wealth-kernel-connector-repositories.utils';

export abstract class WealthKernelConnectorWithdrawalsApiRepositoryServiceBase {
  public abstract List(
    requestId: string,
    tenantId: string,
    input: IBrokerageIntegrationListAllWithdrawalsQueryParamsDto
  ): Promise<IBrokerageIntegrationListAllWithdrawalsQueryResponseDto>;

  public abstract Create(
    requestId: string,
    tenantId: string,
    payload: IBrokerageIntegrationWithdrawalMutableDto
  ): Promise<IBrokerageIntegrationWithdrawalDto>;
}

@Injectable()
export class WealthKernelConnectorWithdrawalsApiRepositoryService
  implements WealthKernelConnectorWithdrawalsApiRepositoryServiceBase
{
  private readonly logger = new Logger(
    WealthKernelConnectorWithdrawalsApiRepositoryService.name
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

  public async List(
    requestId: string,
    tenantId: string,
    input: IBrokerageIntegrationListAllWithdrawalsQueryParamsDto
  ): Promise<IBrokerageIntegrationListAllWithdrawalsQueryResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.List.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
      input,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('tenantId', tenantId);
      Object.keys(input).forEach((key) => {
        const obj = input as unknown as Record<string, unknown>;
        const value = obj[key];
        if (value) {
          queryParams.append(key, value as string);
        }
      });
      const url = `${this.baseUrl}/v1/withdrawals?${queryParams.toString()}`;
      this.logger.debug(`${logPrefix} url: ${url}`);
      const response = await firstValueFrom(
        this.httpService.get<IBrokerageIntegrationListAllWithdrawalsQueryResponseDto>(
          url
        )
      );
      this.logger.debug(
        `${logPrefix} response: ${JsonUtils.Stringify(response)}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async Create(
    requestId: string,
    tenantId: string,
    payload: IBrokerageIntegrationWithdrawalMutableDto
  ): Promise<IBrokerageIntegrationWithdrawalDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Create.name,
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
      const urlParams = new URLSearchParams();
      urlParams.append('tenantId', tenantId);
      const url = `${this.baseUrl}/v1/withdrawals?${urlParams.toString()}`;
      this.logger.debug(`${logPrefix} url: ${url}`);
      const response = await firstValueFrom(
        this.httpService.post<IBrokerageIntegrationWithdrawalDto>(url, payload)
      );
      this.logger.debug(
        `${logPrefix} response: ${JsonUtils.Stringify(response)}`
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
}
