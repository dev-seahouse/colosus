import { IBrokerageIntegrationListAllBaseResponseDto } from './i-brokerage-integration-list-all-base-response.dto';
import { IBrokerageIntegrationListAllQueryParamsBaseDto } from './i-brokerage-integration-list-all-query-params-base.dto';

export enum AccountTypeEnum {
  GIA = 'GIA',
  ISA = 'ISA',
  JISA = 'JISA',
  SIPP = 'SIPP',
}

export enum AccountStatusEnum {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  SUSPENDED = 'Suspended',
  CLOSING = 'Closing',
  CLOSED = 'Closed',
}

export interface IBrokerageIntegrationAccountMutableDto {
  type: AccountTypeEnum;
  clientReference?: string | null;
  name: string;
  productId: string;
  owner: string;
}

export interface IBrokerageIntegrationAccountDto
  extends IBrokerageIntegrationAccountMutableDto {
  id: string;
  status: AccountStatusEnum;
  addedAt: string;
}

export interface IBrokerageIntegrationListAllAccountsQueryParamsDto
  extends IBrokerageIntegrationListAllQueryParamsBaseDto {
  accountId?: string;
  child?: string;
  clientReference?: string;
  owner?: string;
  productId?: string;
  registeredContact?: string;
  status?: string;
  type?: string;
}

export type IBrokerageIntegrationListAllAccountsResponseDto =
  IBrokerageIntegrationListAllBaseResponseDto<
    IBrokerageIntegrationAccountDto[]
  >;
