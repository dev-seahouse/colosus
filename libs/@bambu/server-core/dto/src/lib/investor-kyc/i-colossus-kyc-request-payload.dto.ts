import {
  IBrokerageIntegrationAccountDto,
  IBrokerageIntegrationAccountMutableDto,
  IBrokerageIntegrationPartyAddressCreationDto,
  IBrokerageIntegrationPartyAddressDto,
  IBrokerageIntegrationPartyCreationDto,
  IBrokerageIntegrationPartyDto,
} from '../brokerage-integration';

export interface IColossusKycRequestPayloadDto {
  party: Omit<IBrokerageIntegrationPartyCreationDto, 'clientReference'>;
  address: Omit<
    IBrokerageIntegrationPartyAddressCreationDto,
    'partyId' | 'clientReference'
  >;
  account: Omit<
    IBrokerageIntegrationAccountMutableDto,
    'clientReference' | 'owner' | 'name'
  >;
}

export interface IColossusKycResponsePayloadDto {
  party: IBrokerageIntegrationPartyDto;
  addresses: IBrokerageIntegrationPartyAddressDto[];
  accounts: IBrokerageIntegrationAccountDto[];
}
