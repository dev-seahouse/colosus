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

  public abstract GetWkInvestmentModels(
    requestId: string,
    tenantId: string,
    limit: number,
    after?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationModelPortfolioDtoListAllResponseDto>;

  public abstract GetWkPortfolioByClientReference(
    requestId: string,
    tenantId: string,
    accountId: string,
    clientReference: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto | null>;

  public abstract UpdateWkPortfolioMandate(
    requestId: string,
    id: string,
    tenantId: string,
    mandate: BrokerageIntegrationServerDto.IMandateDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>;
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

  public async GetWkInvestmentModels(
    requestId: string,
    tenantId: string,
    limit: number,
    after?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationModelPortfolioDtoListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetWkInvestmentModels.name,
      requestId
    );
    try {
      this.logger.debug(
        `${logPrefix} Start. Getting WK investment models for tenant: ${tenantId}.`
      );
      const params = new URLSearchParams();
      params.append('tenantId', tenantId);
      params.append('limit', limit.toString());
      if (after) {
        params.append('after', after);
      }
      const url = `${this.baseUrl}/v1/model-portfolios?${params.toString()}`;
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageIntegrationModelPortfolioDtoListAllResponseDto>(
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

  public async GetWkPortfolioByClientReference(
    requestId: string,
    tenantId: string,
    accountId: string,
    clientReference: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto | null> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetWkPortfolioByClientReference.name,
      requestId
    );
    const loggingPayload = {
      tenantId,
      accountId,
      clientReference,
    };
    try {
      this.logger.debug(
        `${logPrefix} Start. Input: ${JsonUtils.Stringify(loggingPayload)}.`
      );
      const params = new URLSearchParams();
      params.append('tenantId', tenantId);
      params.append('clientReference', clientReference);
      params.append('accountId', accountId);
      params.append('limit', '1');
      const url = `${this.baseUrl}/v1/portfolios?${params.toString()}`;
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPortfoliosResponseDto>(
          url
        );
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}.`);
      if (
        !response?.data?.results ||
        !Array.isArray(response?.data?.results) ||
        response?.data?.results?.length < 1
      ) {
        return null;
      }
      return response.data.results[0];
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error encountered.`,
          `Error: ${JsonUtils.Stringify(error)}.`,
          `Input: ${JsonUtils.Stringify(loggingPayload)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async UpdateWkPortfolioMandate(
    requestId: string,
    id: string,
    tenantId: string,
    mandate: BrokerageIntegrationServerDto.IMandateDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateWkPortfolioMandate.name,
      requestId
    );
    const loggingPayload = {
      id,
      mandate,
    };
    try {
      this.logger.debug(
        `${logPrefix} Start. Input: ${JsonUtils.Stringify(loggingPayload)}.`
      );
      const params = new URLSearchParams();
      params.append('tenantId', tenantId);
      const putUrl = `${this.baseUrl}/v1/portfolios/${id}?${params.toString()}`;
      const source =
        this.httpService.put<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>(
          putUrl,
          mandate
        );
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}.`);
      return response.data;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error encountered.`,
          `Error: ${JsonUtils.Stringify(error)}.`,
          `Input: ${JsonUtils.Stringify(loggingPayload)}.`,
        ].join(' ')
      );
      throw error;
    }
  }
}
