import { IWealthKernelConfigDto } from '@bambu/server-core/configuration';
import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export abstract class ApisServiceBase {
  public abstract GetTenants(
    requestId: string,
    pageIndex: number,
    pageSize: number
  ): Promise<string[]>;

  public abstract GetBrokerageAccountData(
    requestId: string,
    tenantId: string,
    accountId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllAccountsResponseDto>;
}

@Injectable()
export class ApisService implements ApisServiceBase {
  private readonly logger: Logger = new Logger(ApisService.name);
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

  public async GetTenants(
    requestId: string,
    pageIndex: number,
    pageSize: number
  ): Promise<string[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetTenants.name,
      requestId
    );
    const loggingPayload = {
      pageIndex,
      pageSize,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      const params = new URLSearchParams();
      params.append('page_index', pageIndex.toString());
      params.append('page_size', pageSize.toString());
      const url = `${
        this.baseUrl
      }/v1/authentication/tenants?${params.toString()}`;
      const source = this.httpService.get<string[]>(url);
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}.`);
      return response.data;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error encountered.`,
          `Error: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async GetBrokerageAccountData(
    requestId: string,
    tenantId: string,
    accountId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllAccountsResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBrokerageAccountData.name,
      requestId
    );
    const loggingPayload = { tenantId, accountId };
    try {
      this.logger.debug(
        `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}`
      );
      const params = new URLSearchParams();
      params.append('tenantId', tenantId);
      params.append('accountId', accountId);
      params.append('limit', String(100));
      const url = `${this.baseUrl}/v1/accounts?${params.toString()}`;
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllAccountsResponseDto>(
          url
        );
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}.`);
      return response.data;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error encountered.`,
          `Error: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }
}
