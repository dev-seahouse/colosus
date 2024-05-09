import { IBrokerageIntegrationListAllBaseResponseDto } from './i-brokerage-integration-list-all-base-response.dto';
import { IBrokerageIntegrationListAllQueryParamsBaseDto } from './i-brokerage-integration-list-all-query-params-base.dto';

export interface IBrokerageIntegrationPartyAddressCreationDto {
  partyId: string; // Required field, with minLength: 1, maxLength: 50
  clientReference: string | null; // Optional field, with minLength: 1, maxLength: 50
  line1: string; // Required field, with minLength: 1, maxLength: 100
  line2: string | null; // Optional field, with minLength: 1, maxLength: 100
  line3: string | null; // Optional field, with minLength: 1, maxLength: 100
  city: string; // Required field, with minLength: 1, maxLength: 100
  region: string | null; // Optional field, with minLength: 1, maxLength: 100
  countryCode: string; // Required field, Must be ISO3166 two-letter country code, with pattern: '^[A-Z]', minLength: 2, maxLength: 2
  postalCode: string; // Required field, with pattern: '^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$', minLength: 1
  startDate: string | null; // Optional field, date format
  endDate: string | null; // Optional field, date format
}

export interface IBrokerageIntegrationPartyAddressDto
  extends IBrokerageIntegrationPartyAddressCreationDto {
  id: string; // Required field, with minLength: 1
  addedAt: string; // Required field, date-time format
}

export type IBrokerageIntegrationPartyAddressListAllResponseDto =
  IBrokerageIntegrationListAllBaseResponseDto<
    IBrokerageIntegrationPartyAddressDto[]
  >;

export interface IBrokerageIntegrationPartyAddressListAllParamsDto
  extends IBrokerageIntegrationListAllQueryParamsBaseDto {
  partyId?: string; // Optional field, with minLength: 1
}
