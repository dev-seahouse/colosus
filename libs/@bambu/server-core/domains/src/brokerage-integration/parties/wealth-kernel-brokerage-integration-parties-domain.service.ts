// noinspection ES6PreferShortImport

import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import {
  WealthKernelAddressesApiRepositoryServiceBase,
  WealthKernelBankAccountsApiRepositoryServiceBase,
  WealthKernelPartiesApiRepositoryServiceBase,
} from '@bambu/server-core/repositories';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { SharedEnums } from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import { WealthKernelIntegrationHelpersServiceBase } from '../brokerage-integration-domain-helpers';
import { BrokerageIntegrationPartiesDomainBaseService } from './brokerage-integration-parties-domain-base.service';
import * as crypto from 'crypto';

@Injectable()
export class WealthKernelBrokerageIntegrationPartiesDomainService
  implements BrokerageIntegrationPartiesDomainBaseService
{
  private readonly logger = new Logger(
    WealthKernelBrokerageIntegrationPartiesDomainService.name
  );

  constructor(
    private readonly wealthKernelDomainHelpers: WealthKernelIntegrationHelpersServiceBase,
    private readonly wealthKernelPartiesApi: WealthKernelPartiesApiRepositoryServiceBase,
    private readonly wealthKernelAddressesApi: WealthKernelAddressesApiRepositoryServiceBase,
    private readonly wealthKernelBankAccountsApi: WealthKernelBankAccountsApiRepositoryServiceBase
  ) {}

  public async ListAvailableParties(
    requestId: string,
    tenantId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPartiesQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPartiesResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListAvailableParties.name,
      requestId
    );

    const loggingPayload = { tenantId, queryParams };

    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );

    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );

      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);

      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPartiesResponseDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelPartiesApi.ListAllParties(
              requestId,
              tokenObject.token,
              queryParams
            );
          }
        );

      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);

      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');

      this.logger.error(errorMessage);

      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  private getInnerLoggerContext(logPrefix: string): string {
    return [
      WealthKernelBrokerageIntegrationPartiesDomainService.name,
      logPrefix,
    ].join('.');
  }

  public async GetPartyByBrokeragePartyId(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto | null> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetPartyByBrokeragePartyId.name,
      requestId
    );

    const loggingPayload = { tenantId, brokeragePartyId };

    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );

    try {
      const response = await this.wealthKernelDomainHelpers.GetPartyById(
        requestId,
        tenantId,
        brokeragePartyId
      );

      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);

      return response;
    } catch (error: unknown) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');

      this.logger.error(errorMessage);

      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  private handlePartyNotFoundError(
    error: unknown,
    requestId: string,
    loggingPayload: unknown
  ) {
    this.wealthKernelDomainHelpers.HandlePartyNotFoundError(
      error,
      requestId,
      loggingPayload
    );
  }

  public async CreateParty(
    requestId: string,
    tenantId: string,
    party: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyCreationDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateParty.name,
      requestId
    );

    const loggingPayload = { tenantId, party, idempotencyKey };

    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );

    let creationIdempotencyKey = idempotencyKey;

    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );

      if (!creationIdempotencyKey) {
        creationIdempotencyKey = `PARTY-${tenantId}-${party.clientReference}`;
      }

      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);

      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelPartiesApi.CreateParty(
              requestId,
              tokenObject.token,
              creationIdempotencyKey,
              party
            );
          }
        );

      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);

      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);

      this.wealthKernelDomainHelpers.HandleWealthKernelIdempotentInputError(
        error,
        requestId,
        creationIdempotencyKey,
        loggingPayload
      );
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  public async UpdateParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    updatePayload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyUpdateDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateParty.name,
      requestId
    );

    const loggingPayload = { tenantId, brokeragePartyId, updatePayload };

    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );

    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );

      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelPartiesApi.UpdateParty(
              requestId,
              tokenObject.token,
              brokeragePartyId,
              updatePayload
            );
          }
        );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error: unknown) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');

      this.logger.error(errorMessage);

      this.handlePartyNotFoundError(error, requestId, loggingPayload);

      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  public async AddIdentifierToParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyIdentifierCreationDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.AddIdentifierToParty.name,
      requestId
    );
    const loggingPayload = { tenantId, brokeragePartyId, payload };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelPartiesApi.AddIdentifierToParty(
              requestId,
              tokenObject.token,
              brokeragePartyId,
              payload
            );
          }
        );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);

      this.handlePartyNotFoundError(error, requestId, loggingPayload);

      this.wealthKernelDomainHelpers.HandleWealthKernelApiInputError(
        requestId,
        error,
        loggingPayload
      );

      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  public async AddNationalityToParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    countryCode: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.AddNationalityToParty.name,
      requestId
    );

    // noinspection DuplicatedCode
    const loggingPayload = { tenantId, brokeragePartyId, countryCode };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );

    if (
      countryCode === null ||
      countryCode === undefined ||
      typeof countryCode !== 'string' ||
      countryCode.length !== 2
    ) {
      throw new ErrorUtils.ColossusError(
        `Invalid country code. Country code must be a string that 2 characters long, without leading or trailing spaces.`,
        requestId,
        { ...loggingPayload },
        400,
        SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.BAD_BROKERAGE_REQUEST
      );
    }

    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelPartiesApi.AddNationalityToParty(
              requestId,
              tokenObject.token,
              brokeragePartyId,
              countryCode
            );
          }
        );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.handlePartyNotFoundError(error, requestId, loggingPayload);
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  public async AddTaxResidencyToParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    countryCode: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.AddTaxResidencyToParty.name,
      requestId
    );
    // noinspection DuplicatedCode
    const loggingPayload = { tenantId, brokeragePartyId, countryCode };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );
    if (
      countryCode === null ||
      countryCode === undefined ||
      typeof countryCode !== 'string' ||
      countryCode.length !== 2
    ) {
      throw new ErrorUtils.ColossusError(
        `Invalid country code. Country code must be a string that 2 characters long, without leading or trailing spaces.`,
        requestId,
        { ...loggingPayload },
        400,
        SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.BAD_BROKERAGE_REQUEST
      );
    }
    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelPartiesApi.AddTaxResidencyToParty(
              requestId,
              tokenObject.token,
              brokeragePartyId,
              countryCode
            );
          }
        );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error: unknown) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.handlePartyNotFoundError(error, requestId, loggingPayload);
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  public async UpdatePartyIdentifier(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokerageIdentifierId: string,
    updatePayload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyIdentifierDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdatePartyIdentifier.name,
      requestId
    );
    const loggingPayload = {
      tenantId,
      brokeragePartyId,
      brokerageIdentifierId,
      updatePayload,
    };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelPartiesApi.UpdatePartyIdentifier(
              requestId,
              tokenObject.token,
              brokeragePartyId,
              brokerageIdentifierId,
              updatePayload
            );
          }
        );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.handlePartyNotFoundError(error, requestId, loggingPayload);
      this.wealthKernelDomainHelpers.HandleWealthKernelApiInputError(
        requestId,
        error,
        loggingPayload
      );
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  public async ListAddresses(
    requestId: string,
    tenantId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressListAllParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListAddresses.name,
      requestId
    );
    const loggingPayload = { tenantId, queryParams };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressListAllResponseDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelAddressesApi.List(
              requestId,
              tokenObject.token,
              queryParams
            );
          }
        );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  public async GetAddressByAddressId(
    requestId: string,
    tenantId: string,
    brokeragePartyAddressId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetAddressByAddressId.name,
      requestId
    );
    const loggingPayload = { tenantId, brokeragePartyAddressId };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelAddressesApi.Get(
              requestId,
              tokenObject.token,
              brokeragePartyAddressId
            );
          }
        );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.handlePartyAddressNotFoundError(error, requestId, loggingPayload);
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  private handlePartyAddressNotFoundError(
    error: unknown,
    requestId: string,
    loggingPayload: unknown
  ) {
    if (ErrorUtils.isErrorFromAxios(error)) {
      const axiosError = ErrorUtils.castErrorAsAxiosError(error);

      if (axiosError.response?.status === 404) {
        throw this.getPartyAddressNotFoundError(requestId, loggingPayload);
      }
    }
  }

  private getPartyAddressNotFoundError(
    requestId: string,
    metadata: unknown
  ): ErrorUtils.ColossusError {
    return new ErrorUtils.ColossusError(
      `The address was not found.`,
      requestId,
      metadata,
      404,
      SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.TENANT_PARTY_ADDRESS_NOT_FOUND
    );
  }

  public async CreateAddress(
    requestId: string,
    tenantId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressCreationDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateAddress.name,
      requestId
    );
    const loggingPayload = { tenantId, payload, idempotencyKey };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );
    let creationIdempotencyKey = idempotencyKey;
    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      if (!creationIdempotencyKey) {
        creationIdempotencyKey = `ADDRESS-${tenantId}-${payload.clientReference}`;
      }
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto>(
          new Logger(innerLoggerContext),
          async () => {
            return this.wealthKernelAddressesApi.Create(
              requestId,
              tokenObject.token,
              creationIdempotencyKey,
              payload
            );
          }
        );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.wealthKernelDomainHelpers.HandleWealthKernelApiInputError(
        requestId,
        error,
        loggingPayload
      );
      this.wealthKernelDomainHelpers.HandleWealthKernelIdempotentInputError(
        error,
        requestId,
        creationIdempotencyKey,
        loggingPayload
      );
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  public async UpdateAddressByAddressId(
    requestId: string,
    tenantId: string,
    brokeragePartyAddressId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressCreationDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateAddressByAddressId.name,
      requestId
    );
    const loggingPayload = { tenantId, brokeragePartyAddressId, payload };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto>(
          new Logger(innerLoggerContext),
          async () => {
            return await this.wealthKernelAddressesApi.Update(
              requestId,
              tokenObject.token,
              brokeragePartyAddressId,
              payload
            );
          }
        );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.handlePartyAddressNotFoundError(error, requestId, loggingPayload);
      this.wealthKernelDomainHelpers.HandleWealthKernelApiInputError(
        requestId,
        error,
        loggingPayload
      );
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  public async GetAddressesForParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllQueryParamsBaseDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetAddressesForParty.name,
      requestId
    );
    const loggingPayload = { tenantId, queryParams, brokeragePartyId };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      // Calling this function to make sure the party exists
      await this.GetPartyByBrokeragePartyId(
        requestId,
        tenantId,
        brokeragePartyId
      );

      const response = await this.ListAddresses(requestId, tenantId, {
        ...queryParams,
        partyId: brokeragePartyId,
      });
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  public async GetAddressForParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokeragePartyAddressId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetAddressForParty.name,
      requestId
    );
    const loggingPayload = {
      tenantId,
      brokeragePartyId,
      brokeragePartyAddressId,
    };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );

    try {
      // Calling this function to make sure the party exists
      await this.GetPartyByBrokeragePartyId(
        requestId,
        tenantId,
        brokeragePartyId
      );

      const response = await this.GetAddressByAddressId(
        requestId,
        tenantId,
        brokeragePartyAddressId
      );

      this.guardAgainstPartyAddressRetrievalMismatchError(
        requestId,
        brokeragePartyId,
        response
      );

      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  private guardAgainstPartyAddressRetrievalMismatchError(
    requestId: string,
    brokeragePartyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto
  ): void {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.guardAgainstPartyAddressRetrievalMismatchError.name,
      requestId
    );

    if (brokeragePartyId !== payload?.partyId) {
      const message = `The party is requesting somebody else's address.`;
      const metadata: Record<string, unknown> = { brokeragePartyId, payload };

      this.logger.error(
        `${logPrefix} ${message} Data: ${JsonUtils.Stringify(metadata)}.`
      );

      throw this.getPartyAddressNotFoundError(requestId, {
        ...metadata,
        message,
      });
    }
  }

  public async CreatePartyAddress(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressCreationDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreatePartyAddress.name,
      requestId
    );
    const loggingPayload = {
      tenantId,
      brokeragePartyId,
      payload,
      idempotencyKey,
    };
    try {
      this.guardPartyAddressWritePayload(requestId, brokeragePartyId, payload, {
        loggingPayload,
      });
      // Calling this function to make sure the party exists
      await this.GetPartyByBrokeragePartyId(
        requestId,
        tenantId,
        brokeragePartyId
      );
      const response = await this.CreateAddress(
        requestId,
        tenantId,
        payload,
        idempotencyKey
      );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  private guardPartyAddressWritePayload(
    requestId: string,
    brokeragePartyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressCreationDto,
    metadata: unknown
  ): void {
    if (payload.partyId !== brokeragePartyId) {
      throw new ErrorUtils.ColossusError(
        `The party id in the payload does not match the brokerage party id.`,
        requestId,
        metadata,
        400,
        SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.BAD_BROKERAGE_REQUEST
      );
    }
  }

  public async UpdatePartyAddress(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokeragePartyAddressId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressCreationDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdatePartyAddress.name,
      requestId
    );
    const loggingPayload = {
      tenantId,
      brokeragePartyId,
      brokeragePartyAddressId,
      payload,
    };
    try {
      this.guardPartyAddressWritePayload(requestId, brokeragePartyId, payload, {
        loggingPayload,
      });
      // Calling this function to make sure the party exists
      await this.GetPartyByBrokeragePartyId(
        requestId,
        tenantId,
        brokeragePartyId
      );
      // calling this to make sure the address exists for user
      await this.ensureAddressUpdateRequestIsValid(
        requestId,
        tenantId,
        brokeragePartyId,
        brokeragePartyAddressId
      );

      const response = await this.UpdateAddressByAddressId(
        requestId,
        tenantId,
        brokeragePartyAddressId,
        payload
      );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  private async ensureAddressUpdateRequestIsValid(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokeragePartyAddressId: string
  ): Promise<void> {
    const result = await this.ListAddresses(requestId, tenantId, {
      partyId: brokeragePartyId,
      limit: 250,
    });

    const address = result.results.find(
      (x) => x.id === brokeragePartyAddressId
    );

    if (address) {
      return;
    }

    throw this.getPartyAddressNotFoundError(requestId, {
      tenantId,
      brokeragePartyId,
      brokeragePartyAddressId,
    });
  }

  public async ListBankAccounts(
    requestId: string,
    tenantId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyBankAccountListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListBankAccounts.name,
      requestId
    );
    const loggingPayload = { tenantId, queryParams };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyBankAccountListAllResponseDto>(
          new Logger(innerLoggerContext),
          async () => {
            return this.wealthKernelBankAccountsApi.List(
              requestId,
              tokenObject.token,
              queryParams
            );
          }
        );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  public async GetBankAccount(
    requestId: string,
    tenantId: string,
    brokerageBankAccountId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBankAccount.name,
      requestId
    );
    const loggingPayload = { tenantId, brokerageBankAccountId };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto>(
          new Logger(innerLoggerContext),
          async () => {
            return this.wealthKernelBankAccountsApi.Get(
              requestId,
              tokenObject.token,
              brokerageBankAccountId
            );
          }
        );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.handleBankAccountNotFoundError(error, requestId, loggingPayload);
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  private handleBankAccountNotFoundError(
    error: unknown,
    requestId: string,
    metadata: unknown
  ): void {
    if (ErrorUtils.isErrorFromAxios(error)) {
      const axiosError = ErrorUtils.castErrorAsAxiosError(error);

      if (axiosError.response?.status === 404) {
        throw this.getBankAccountNotFoundError(requestId, metadata);
      }
    }
  }

  private getBankAccountNotFoundError(
    requestId: string,
    metadata: unknown
  ): ErrorUtils.ColossusError {
    return new ErrorUtils.ColossusError(
      `The bank account was not found.`,
      requestId,
      metadata,
      404,
      SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.BANK_ACCOUNT_NOT_FOUND
    );
  }

  public async CreateBankAccount(
    requestId: string,
    tenantId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountMutableDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateBankAccount.name,
      requestId
    );
    const loggingPayload = { tenantId, payload, idempotencyKey };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );
    let creationIdempotencyKey = idempotencyKey;
    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      if (!creationIdempotencyKey) {
        const hashBaseline = [
          tenantId,
          payload.clientReference,
          requestId,
        ].join('.');
        const hash = crypto
          .createHash('md5')
          .update(hashBaseline)
          .digest('hex');
        creationIdempotencyKey = `BANK-${hash}`;
        // creationIdempotencyKey = `BANK-${tenantId}-${requestId}-${payload.clientReference}`;
      }
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      const response =
        await ErrorUtils.exponentialBackoff<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto>(
          new Logger(innerLoggerContext),
          async () => {
            return this.wealthKernelBankAccountsApi.Create(
              requestId,
              tokenObject.token,
              creationIdempotencyKey,
              payload
            );
          }
        );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.wealthKernelDomainHelpers.HandleWealthKernelApiInputError(
        requestId,
        error,
        loggingPayload
      );
      this.wealthKernelDomainHelpers.HandleWealthKernelIdempotentInputError(
        error,
        requestId,
        creationIdempotencyKey,
        loggingPayload
      );
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  public async DeactivateBankAccount(
    requestId: string,
    tenantId: string,
    brokerageBankAccountId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.DeactivateBankAccount.name,
      requestId
    );
    const loggingPayload = { tenantId, brokerageBankAccountId };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      const tokenObject =
        await this.wealthKernelDomainHelpers.GuardTenantAndGetTenantToken(
          requestId,
          tenantId
        );
      const innerLoggerContext = this.getInnerLoggerContext(logPrefix);
      await ErrorUtils.exponentialBackoff<void>(
        new Logger(innerLoggerContext),
        async () => {
          return this.wealthKernelBankAccountsApi.Deactivate(
            requestId,
            tokenObject.token,
            brokerageBankAccountId
          );
        }
      );
      this.logger.debug(`${logPrefix} End.`);
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.handleBankAccountNotFoundError(error, requestId, loggingPayload);
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  public async GetBankAccountsForParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllQueryParamsBaseDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyBankAccountListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBankAccountsForParty.name,
      requestId
    );
    const loggingPayload = { tenantId, queryParams, brokeragePartyId };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      // Calling this function to make sure the party exists
      await this.GetPartyByBrokeragePartyId(
        requestId,
        tenantId,
        brokeragePartyId
      );
      const response = await this.ListBankAccounts(requestId, tenantId, {
        ...queryParams,
        partyId: brokeragePartyId,
      });
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  public async GetBankAccountForParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokerageBankAccountId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBankAccountForParty.name,
      requestId
    );
    const loggingPayload = {
      tenantId,
      brokerageBankAccountId,
      brokeragePartyId,
    };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      await this.GetPartyByBrokeragePartyId(
        requestId,
        tenantId,
        brokeragePartyId
      );
      const response = await this.GetBankAccount(
        requestId,
        tenantId,
        brokerageBankAccountId
      );
      this.guardAgainstBankAccountRetrievalMismatchError(
        requestId,
        brokeragePartyId,
        response
      );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  private guardAgainstBankAccountRetrievalMismatchError(
    requestId: string,
    brokeragePartyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto
  ): void {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.guardAgainstBankAccountRetrievalMismatchError.name,
      requestId
    );

    if (brokeragePartyId !== payload?.partyId) {
      const message = `The party is requesting somebody else's bank account.`;
      const metadata: Record<string, unknown> = { brokeragePartyId, payload };

      this.logger.error(
        `${logPrefix} ${message} Data: ${JsonUtils.Stringify(metadata)}.`
      );

      throw this.getBankAccountNotFoundError(requestId, {
        ...metadata,
        message,
      });
    }
  }

  public async CreatePartyBankAccount(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountMutableDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreatePartyBankAccount.name,
      requestId
    );
    const loggingPayload = { tenantId, payload, idempotencyKey };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );
    if (payload.partyId !== brokeragePartyId) {
      throw new ErrorUtils.ColossusError(
        `The party id in the payload does not match the brokerage party id.`,
        requestId,
        loggingPayload,
        400,
        SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.BAD_BROKERAGE_REQUEST
      );
    }
    try {
      // Calling this function to make sure the party exists
      await this.GetPartyByBrokeragePartyId(
        requestId,
        tenantId,
        brokeragePartyId
      );
      const response = await this.CreateBankAccount(
        requestId,
        tenantId,
        payload,
        idempotencyKey
      );
      this.logger.debug(`${logPrefix} End. ${JsonUtils.Stringify(response)}`);
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }

  public async DeactivatePartyBankAccount(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokerageBankAccountId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.DeactivatePartyBankAccount.name,
      requestId
    );
    const loggingPayload = {
      tenantId,
      brokerageBankAccountId,
      brokeragePartyId,
    };
    this.logger.debug(
      `${logPrefix} Start. ${JsonUtils.Stringify(loggingPayload)}`
    );
    try {
      // call this to ensure this guy actually owns the account
      await this.GetBankAccountForParty(
        requestId,
        tenantId,
        brokeragePartyId,
        brokerageBankAccountId
      );
      await this.DeactivateBankAccount(
        requestId,
        tenantId,
        brokerageBankAccountId
      );
      this.logger.debug(`${logPrefix} End.`);
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.logger.error(errorMessage);
      this.wealthKernelDomainHelpers.HandleWealthKernelIntegrationError(
        requestId,
        error,
        loggingPayload
      );
    }
  }
}
