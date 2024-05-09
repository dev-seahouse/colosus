import { IBrokerageIntegrationListAllBaseResponseDto } from './i-brokerage-integration-list-all-base-response.dto';
import { IBrokerageIntegrationListAllQueryParamsBaseDto } from './i-brokerage-integration-list-all-query-params-base.dto';

export interface IBrokerageUkDirectDebitMandateMutableDto {
  partyId: string;
  bankAccountId: string;
}

export enum BrokerUkDirectDebitMandateStatusEnum {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  CANCELLED = 'Cancelled',
  FAILED = 'Failed',
}

export interface IBrokerageUkDirectDebitMandateDto
  extends IBrokerageUkDirectDebitMandateMutableDto {
  status: BrokerUkDirectDebitMandateStatusEnum;
  id: string;
  reference: string;
  reason: string | null;
}

export interface IBrokerageUkDirectDebitMandateListAllQueryParamsDto
  extends IBrokerageIntegrationListAllQueryParamsBaseDto {
  bankAccountId?: string;
  partyId?: string;
  reference?: string;
  status?: BrokerUkDirectDebitMandateStatusEnum;
}

export type IBrokerageUkDirectDebitMandateListAllResponseDto =
  IBrokerageIntegrationListAllBaseResponseDto<
    IBrokerageUkDirectDebitMandateDto[]
  >;

export interface IBrokerageUkDirectDebitMandateNextPossibleConnectionDateDto {
  date: string;
}
