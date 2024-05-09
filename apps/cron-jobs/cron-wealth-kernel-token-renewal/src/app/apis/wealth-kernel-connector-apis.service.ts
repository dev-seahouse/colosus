import { IWealthKernelConfigDto } from '@bambu/server-core/configuration';
import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

export abstract class WealthKernelConnectorApisServiceBase {
  abstract GetTenants(
    requestId: string,
    pageIndex: number,
    pageSize: number
  ): Promise<string[]>;

  abstract GetTenantToken(
    requestId: string,
    tenantId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto>;

  abstract SetTenantToken(
    requestId: string,
    tenantId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto>;
}

@Injectable()
export class WealthKernelConnectorApisService
  implements WealthKernelConnectorApisServiceBase
{
  private readonly logger: Logger = new Logger(
    WealthKernelConnectorApisService.name
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

  async GetTenants(
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
          `Input values: ${JsonUtils.Stringify(loggingPayload)}.`,
          `Error: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );

      throw error;
    }
  }

  async GetTenantToken(
    requestId: string,
    tenantId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto | null> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetTenants.name,
      requestId
    );
    const loggingPayload = {
      tenantId,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      const params = new URLSearchParams();
      params.append('tenant_id', tenantId.toString());
      const url = `${
        this.baseUrl
      }/v1/authentication/token?${params.toString()}`;
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto>(
          url
        );
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}.`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.isAxiosError && axiosError.response?.status === 404) {
        return null;
      }

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

  async SetTenantToken(
    requestId: string,
    tenantId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.SetTenantToken.name,
      requestId
    );
    const loggingPayload = {
      tenantId,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      const url = `${this.baseUrl}/v1/authentication/token`;
      const source =
        this.httpService.post<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto>(
          url,
          { tenantId }
        );
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}.`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.isAxiosError && axiosError.response?.status === 404) {
        return null;
      }
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
