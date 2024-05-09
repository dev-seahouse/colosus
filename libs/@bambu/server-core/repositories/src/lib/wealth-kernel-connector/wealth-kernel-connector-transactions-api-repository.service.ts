import { IWealthKernelConfigDto } from '@bambu/server-core/configuration';
import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { handleWealthKernelConnectorError } from './wealth-kernel-connector-repositories.utils';

export abstract class WealthKernelConnectorTransactionsApiRepositoryServiceBase {
  public abstract List(
    requestId: string,
    tenantId: string,
    input: BrokerageIntegrationServerDto.IBrokerageIntegrationTransactionsListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationTransactionsListAllResponseDto>;
}

@Injectable()
export class WealthKernelConnectorTransactionsApiRepositoryService
  implements WealthKernelConnectorTransactionsApiRepositoryServiceBase
{
  private readonly logger: Logger = new Logger(
    WealthKernelConnectorTransactionsApiRepositoryService.name
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
    input: BrokerageIntegrationServerDto.IBrokerageIntegrationTransactionsListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationTransactionsListAllResponseDto> {
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
        if (value !== undefined) {
          queryParams.append(key, value as string);
        }
      });
      const url = `${this.baseUrl}/v1/transactions?${queryParams.toString()}`;
      const response = await firstValueFrom(
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageIntegrationTransactionsListAllResponseDto>(
          url
        )
      );
      this.logger.debug(
        `${logPrefix} End: ${JsonUtils.Stringify(response.data)}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }
}
