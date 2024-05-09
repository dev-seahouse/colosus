import { IWealthKernelConfigDto } from '@bambu/server-core/configuration';
import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { handleWealthKernelConnectorError } from './wealth-kernel-connector-repositories.utils';

export abstract class WealthKernelConnectorPartiesApiRepositoryServiceBase {
  public abstract Create(
    requestId: string,
    tenantId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyCreationDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>;

  public abstract CreateAddressForParty(
    requestId: string,
    tenantId: string,
    partyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressCreationDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto>;

  public abstract CreateAccountForParty(
    requestId: string,
    tenantId: string,
    partyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationAccountMutableDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto>;

  public abstract GetParty(
    requestId: string,
    tenantId: string,
    id: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>;

  public abstract GetAddressesForParty(
    requestId: string,
    tenantId: string,
    partyId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressListAllResponseDto>;

  public abstract GetAccountsForParty(
    requestId: string,
    tenantId: string,
    partyId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllAccountsResponseDto>;

  public abstract GetBankAccountsForParty(
    requestId: string,
    tenantId: string,
    partyId: string,
    input?: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllQueryParamsBaseDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyBankAccountListAllResponseDto>;

  public abstract CreateBankAccountForParty(
    requestId: string,
    tenantId: string,
    partyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountMutableDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto>;

  public abstract GetBankAccountForPartyByBankAccountId(
    requestId: string,
    tenantId: string,
    partyId: string,
    bankAccountId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto>;

  public abstract CreatePortfolioForPartyAndAccount(
    requestId: string,
    tenantId: string,
    partyId: string,
    accountId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioMutableDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>;
}

@Injectable()
export class WealthKernelConnectorPartiesApiRepositoryService
  implements WealthKernelConnectorPartiesApiRepositoryServiceBase
{
  private readonly logger: Logger = new Logger(
    WealthKernelConnectorPartiesApiRepositoryService.name
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

  public async Create(
    requestId: string,
    tenantId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyCreationDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Create.name,
      requestId
    );
    try {
      this.logger.log(
        `${logPrefix} Payload: ${JsonUtils.Stringify({
          payload,
          tenantId,
        })}`
      );
      const response = await firstValueFrom(
        this.httpService.post<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>(
          `${this.baseUrl}/v1/parties?tenantId=${tenantId}`,
          payload
        )
      );
      this.logger.log(
        `${logPrefix} Response: ${JsonUtils.Stringify(response.data)}`
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          tenantId,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async GetParty(
    requestId: string,
    tenantId: string,
    id: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetParty.name,
      requestId
    );
    try {
      this.logger.debug(
        `${logPrefix} Payload: ${JsonUtils.Stringify({ id, tenantId })}.`
      );
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>(
          `${this.baseUrl}/v1/parties/${id}?tenantId=${tenantId}`
        );
      const response = await firstValueFrom(source);
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          tenantId,
          id,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async CreateAddressForParty(
    requestId: string,
    tenantId: string,
    partyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressCreationDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateAddressForParty.name,
      requestId
    );
    try {
      this.logger.log(
        `${logPrefix} Payload: ${JsonUtils.Stringify({
          payload,
          partyId,
          tenantId,
        })}`
      );
      const source =
        this.httpService.post<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto>(
          `${this.baseUrl}/v1/parties/${partyId}/addresses?tenantId=${tenantId}`,
          payload
        );
      const response = await firstValueFrom(source);
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          tenantId,
          partyId,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async GetAddressesForParty(
    requestId: string,
    tenantId: string,
    partyId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetAddressesForParty.name,
      requestId
    );
    try {
      this.logger.log(
        `${logPrefix} Payload: ${JsonUtils.Stringify({
          partyId,
          tenantId,
        })}`
      );
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressListAllResponseDto>(
          `${this.baseUrl}/v1/parties/${partyId}/addresses?tenantId=${tenantId}`
        );
      const response = await firstValueFrom(source);
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          tenantId,
          partyId,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async CreateAccountForParty(
    requestId: string,
    tenantId: string,
    partyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationAccountMutableDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateAccountForParty.name,
      requestId
    );
    try {
      this.logger.debug(
        `${logPrefix} Payload: ${JsonUtils.Stringify({
          payload,
          tenantId,
          partyId,
        })}`
      );
      const source =
        this.httpService.post<BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto>(
          `${this.baseUrl}/v1/parties/${partyId}/brokerage-accounts?tenantId=${tenantId}`,
          payload
        );
      const response = await firstValueFrom(source);
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          tenantId,
          partyId,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async GetAccountsForParty(
    requestId: string,
    tenantId: string,
    partyId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllAccountsResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetAccountsForParty.name,
      requestId
    );
    try {
      this.logger.log(
        `${logPrefix} Payload: ${JsonUtils.Stringify({
          partyId,
          tenantId,
        })}`
      );
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllAccountsResponseDto>(
          `${this.baseUrl}/v1/parties/${partyId}/brokerage-accounts?tenantId=${tenantId}`
        );
      const response = await firstValueFrom(source);
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          tenantId,
          partyId,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async GetBankAccountsForParty(
    requestId: string,
    tenantId: string,
    partyId: string,
    input?: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllQueryParamsBaseDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyBankAccountListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBankAccountsForParty.name,
      requestId
    );
    try {
      this.logger.log(
        `${logPrefix} Payload: ${JsonUtils.Stringify({
          partyId,
          tenantId,
        })}`
      );
      const queryParams = new URLSearchParams();
      queryParams.append('tenantId', tenantId);

      if (input) {
        Object.keys(input).forEach((key) => {
          const obj = input as unknown as Record<string, unknown>;
          const value = obj[key];
          if (value) {
            queryParams.append(key, value as string);
          }
        });
      }

      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyBankAccountListAllResponseDto>(
          `${
            this.baseUrl
          }/v1/parties/${partyId}/bank-accounts?${queryParams.toString()}`
        );
      const response = await firstValueFrom(source);
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          tenantId,
          partyId,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async CreateBankAccountForParty(
    requestId: string,
    tenantId: string,
    partyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountMutableDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateBankAccountForParty.name,
      requestId
    );
    try {
      this.logger.debug(
        `${logPrefix} Payload: ${JsonUtils.Stringify({
          payload,
          tenantId,
          partyId,
        })}`
      );
      const source =
        this.httpService.post<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto>(
          `${this.baseUrl}/v1/parties/${partyId}/bank-accounts?tenantId=${tenantId}`,
          payload
        );
      const response = await firstValueFrom(source);
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          tenantId,
          partyId,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async GetBankAccountForPartyByBankAccountId(
    requestId: string,
    tenantId: string,
    partyId: string,
    bankAccountId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBankAccountForPartyByBankAccountId.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      bankAccountId,
      partyId,
      tenantId,
    };
    try {
      this.logger.debug(
        `${logPrefix} Payload: ${JsonUtils.Stringify(loggingPayload)}`
      );
      const queryParams = new URLSearchParams();
      queryParams.append('tenantId', tenantId);
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto>(
          `${
            this.baseUrl
          }/v1/parties/${partyId}/bank-accounts/${bankAccountId}?${queryParams.toString()}`
        );
      const response = await firstValueFrom(source);
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          ...loggingPayload,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }

  public async CreatePortfolioForPartyAndAccount(
    requestId: string,
    tenantId: string,
    partyId: string,
    accountId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioMutableDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreatePortfolioForPartyAndAccount.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      partyId,
      accountId,
      payload,
      idempotencyKey,
    };
    try {
      this.logger.debug(
        `${logPrefix} Payload: ${JsonUtils.Stringify(loggingPayload)}`
      );
      const queryParams = new URLSearchParams();
      queryParams.append('tenantId', tenantId);
      const url = `${
        this.baseUrl
      }/v1/parties/${partyId}/brokerage-portfolios/${accountId}/portfolios?${queryParams.toString()}`;
      const source =
        this.httpService.post<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>(
          url,
          payload
        );
      const response = await firstValueFrom(source);
      return response.data;
    } catch (error) {
      this.logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify({
          error,
          ...loggingPayload,
        })}`
      );
      throw handleWealthKernelConnectorError(error, requestId);
    }
  }
}
