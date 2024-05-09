import { IWealthKernelConfigDto } from '@bambu/server-core/configuration';
import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { handleWealthKernelConnectorError } from './wealth-kernel-connector-repositories.utils';

export abstract class WealthKernelConnectorPortfoliosApiRepositoryServiceBase {
  public abstract List(
    requestId: string,
    tenantId: string,
    input: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPortfoliosQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPortfoliosResponseDto>;
}

@Injectable()
export class WealthKernelConnectorPortfoliosApiRepositoryService
  implements WealthKernelConnectorPortfoliosApiRepositoryServiceBase
{
  private readonly logger = new Logger(
    WealthKernelConnectorPortfoliosApiRepositoryService.name
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
    input: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPortfoliosQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPortfoliosResponseDto> {
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
      const url = `${this.baseUrl}/v1/portfolios?${queryParams.toString()}`;
      this.logger.debug(`${logPrefix} url: ${url}`);
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPortfoliosResponseDto>(
          url
        );
      const response = await firstValueFrom(source);
      this.logger.debug(
        `${logPrefix} response: ${JsonUtils.Stringify(response)}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }
}
