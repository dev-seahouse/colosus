import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';

export abstract class BrokerageIntegrationPartiesDomainBaseService {
  public abstract ListAvailableParties(
    requestId: string,
    tenantId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPartiesQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPartiesResponseDto>;
  public abstract GetPartyByBrokeragePartyId(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto | null>;
  public abstract CreateParty(
    requestId: string,
    tenantId: string,
    party: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyCreationDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>;
  public abstract UpdateParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    updatePayload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyUpdateDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>;
  public abstract AddIdentifierToParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyIdentifierCreationDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>;
  public abstract AddNationalityToParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    countryCode: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>;
  public abstract AddTaxResidencyToParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    countryCode: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>;
  public abstract UpdatePartyIdentifier(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokerageIdentifierId: string,
    updatePayload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyIdentifierDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>;
  public abstract ListAddresses(
    requestId: string,
    tenantId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressListAllParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressListAllResponseDto>;
  public abstract GetAddressByAddressId(
    requestId: string,
    tenantId: string,
    brokeragePartyAddressId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto>;
  public abstract CreateAddress(
    requestId: string,
    tenantId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressCreationDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto>;
  public abstract UpdateAddressByAddressId(
    requestId: string,
    tenantId: string,
    brokeragePartyAddressId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressCreationDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto>;
  public abstract GetAddressesForParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllQueryParamsBaseDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressListAllResponseDto>;
  public abstract GetAddressForParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokeragePartyAddressId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto>;
  public abstract CreatePartyAddress(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressCreationDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto>;
  public abstract UpdatePartyAddress(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokeragePartyAddressId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressCreationDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto>;
  public abstract ListBankAccounts(
    requestId: string,
    tenantId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyBankAccountListAllResponseDto>;
  public abstract GetBankAccount(
    requestId: string,
    tenantId: string,
    brokerageBankAccountId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto>;
  public abstract CreateBankAccount(
    requestId: string,
    tenantId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountMutableDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto>;
  public abstract DeactivateBankAccount(
    requestId: string,
    tenantId: string,
    brokerageBankAccountId: string
  ): Promise<void>;
  public abstract GetBankAccountsForParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllQueryParamsBaseDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyBankAccountListAllResponseDto>;
  public abstract GetBankAccountForParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokerageBankAccountId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto>;
  public abstract CreatePartyBankAccount(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountMutableDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto>;
  public abstract DeactivatePartyBankAccount(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokerageBankAccountId: string
  ): Promise<void>;
}
