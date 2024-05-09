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

export interface IWealthKernelPartiesListAllInputParamsDto {
  after?: string;
  limit: number;
  clientReference?: string;
  emailAddress?: string;
  name?: string;
  organizationType?: string;
  partyType?: string;
  surname?: string;
}

export abstract class WealthKernelPartiesApiRepositoryServiceBase {
  public abstract ListAllParties(
    requestId: string,
    token: string,
    input: IWealthKernelPartiesListAllInputParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPartiesResponseDto>;

  public abstract GetPartyById(
    requestId: string,
    token: string,
    partyId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>;

  public abstract CreateParty(
    requestId: string,
    token: string,
    idempotencyKey: string,
    party: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyCreationDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>;

  public abstract UpdateParty(
    requestId: string,
    token: string,
    partyId: string,
    updatePayload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyUpdateDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>;

  public abstract AddIdentifierToParty(
    requestId: string,
    token: string,
    partyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyIdentifierCreationDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>;

  public abstract AddNationalityToParty(
    requestId: string,
    token: string,
    partyId: string,
    countryCode: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>;

  public abstract AddTaxResidencyToParty(
    requestId: string,
    token: string,
    partyId: string,
    countryCode: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>;

  public abstract UpdatePartyIdentifier(
    requestId: string,
    token: string,
    partyId: string,
    identifierId: string,
    updatePayload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyIdentifierDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>;
}

@Injectable()
export class WealthKernelPartiesApiRepositoryService
  implements WealthKernelPartiesApiRepositoryServiceBase
{
  private readonly logger = new Logger(
    WealthKernelPartiesApiRepositoryService.name
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

  public async ListAllParties(
    requestId: string,
    token: string,
    input: IWealthKernelPartiesListAllInputParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPartiesResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListAllParties.name,
      requestId
    );
    const loggingPayload = {
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
      const url = `${this.baseUrl}/parties?${queryParams.toString()}`;
      const source = this.httpService.get<
        BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto[]
      >(url, {
        headers: {
          ...helpers.getDefaultOpsApiHeaders(this.apiVersion, token),
        },
      });
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
          `Input values: ${JsonUtils.Stringify(loggingPayload)}.`,
          `Error: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async GetPartyById(
    requestId: string,
    token: string,
    partyId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetPartyById.name,
      requestId
    );
    const loggingPayload = {
      token,
      partyId,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      const url = `${this.baseUrl}/parties/${partyId}`;
      const source =
        this.httpService.get<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>(
          url,
          {
            headers: {
              ...helpers.getDefaultOpsApiHeaders(this.apiVersion, token),
            },
          }
        );
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}`);
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

  public async CreateParty(
    requestId: string,
    token: string,
    idempotencyKey: string,
    party: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyCreationDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetPartyById.name,
      requestId
    );
    const loggingPayload = {
      token,
      idempotencyKey,
      party,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const url = `${this.baseUrl}/parties`;
      const headers: Record<string, string> = helpers.getDefaultOpsApiHeaders(
        this.apiVersion,
        token,
        idempotencyKey
      );
      const source = this.httpService.post<IWealthKernelCreationSuccessDto>(
        url,
        party,
        {
          headers,
        }
      );
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}.`);
      const {
        data: { id },
      } = response;
      const innerContext = `${WealthKernelPartiesApiRepositoryService.name}.${this.CreateParty.name}.${requestId}`;
      return await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>(
        new Logger(innerContext),
        async () => await this.GetPartyById(requestId, token, id)
      );
    } catch (error: unknown) {
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

  public async UpdateParty(
    requestId: string,
    token: string,
    partyId: string,
    updatePayload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyUpdateDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateParty.name,
      requestId
    );
    const loggingPayload = {
      token,
      partyId,
      updatePayload,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const url = `${this.baseUrl}/parties/${partyId}`;
      const headers: Record<string, string> = helpers.getDefaultOpsApiHeaders(
        this.apiVersion,
        token
      );
      const source = this.httpService.patch<void>(url, updatePayload, {
        headers,
      });
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}.`);
      return await this.GetPartyById(requestId, token, partyId);
    } catch (error: unknown) {
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

  public async AddIdentifierToParty(
    requestId: string,
    token: string,
    partyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyIdentifierCreationDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateParty.name,
      requestId
    );
    const loggingPayload = {
      token,
      partyId,
      payload,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const url = `${this.baseUrl}/parties/${partyId}/identifiers`;
      const headers: Record<string, string> = helpers.getDefaultOpsApiHeaders(
        this.apiVersion,
        token
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
      return await this.GetPartyById(requestId, token, partyId);
    } catch (error: unknown) {
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

  public async AddNationalityToParty(
    requestId: string,
    token: string,
    partyId: string,
    countryCode: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.AddNationalityToParty.name,
      requestId
    );
    const loggingPayload = {
      token,
      partyId,
      countryCode,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const url = `${this.baseUrl}/parties/${partyId}/nationalities`;
      const headers: Record<string, string> = helpers.getDefaultOpsApiHeaders(
        this.apiVersion,
        token
      );
      const source = this.httpService.post<IWealthKernelCreationSuccessDto>(
        url,
        {
          countryCode,
        },
        {
          headers,
        }
      );
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}.`);
      return await this.GetPartyById(requestId, token, partyId);
    } catch (error: unknown) {
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

  public async AddTaxResidencyToParty(
    requestId: string,
    token: string,
    partyId: string,
    countryCode: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.AddTaxResidencyToParty.name,
      requestId
    );
    const loggingPayload = {
      token,
      partyId,
      countryCode,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const url = `${this.baseUrl}/parties/${partyId}/tax-residencies`;
      const source = this.httpService.post<IWealthKernelCreationSuccessDto>(
        url,
        {
          countryCode,
        },
        {
          headers: helpers.getDefaultOpsApiHeaders(this.apiVersion, token),
        }
      );
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}.`);
      return await this.GetPartyById(requestId, token, partyId);
    } catch (error: unknown) {
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

  public async UpdatePartyIdentifier(
    requestId: string,
    token: string,
    partyId: string,
    identifierId: string,
    updatePayload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyIdentifierDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdatePartyIdentifier.name,
      requestId
    );
    const loggingPayload = {
      token,
      partyId,
      identifierId,
      updatePayload,
    };
    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const url = `${this.baseUrl}/parties/${partyId}/identifiers/${identifierId}`;
      const source = this.httpService.put<void>(url, updatePayload, {
        headers: helpers.getDefaultOpsApiHeaders(this.apiVersion, token),
      });
      const response = await firstValueFrom(source);
      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}.`);
      return await this.GetPartyById(requestId, token, partyId);
    } catch (error: unknown) {
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
