import { IBrokerageIntegrationListAllBaseResponseDto } from './i-brokerage-integration-list-all-base-response.dto';
import { IBrokerageIntegrationListAllQueryParamsBaseDto } from './i-brokerage-integration-list-all-query-params-base.dto';

export interface IBrokerageUkDirectDebitPaymentAmountDto {
  currency: string;
  amount: number;
}

export enum BrokerageUkDirectDebitPaymentStatusEnum {
  PENDING = 'Pending',
  COLLECTING = 'Collecting',
  COLLECTED = 'Collected',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  FAILED = 'Failed',
}

export interface IBrokerageUkDirectDebitPaymentMutableDto {
  amount: IBrokerageUkDirectDebitPaymentAmountDto;
  mandateId: string;
  portfolioId: string;
  collectionDate?: string;
}

export interface IBrokerageUkDirectDebitPaymentDto
  extends IBrokerageUkDirectDebitPaymentMutableDto {
  id: string;
  subscriptionId: string | null;
  status: BrokerageUkDirectDebitPaymentStatusEnum;
  createdAt: string;
  reason: string | null;
}

export type IBrokerageUkDirectDebitPaymentListAllResponseDto =
  IBrokerageIntegrationListAllBaseResponseDto<
    IBrokerageUkDirectDebitPaymentDto[]
  >;

export interface IBrokerageUkDirectDebitPaymentListAllQueryParamsDto
  extends IBrokerageIntegrationListAllQueryParamsBaseDto {
  mandateId?: string;
  portfolioId?: string;
  status?: BrokerageUkDirectDebitPaymentStatusEnum;
  subscriptionId?: string;
}

export interface IBrokerageUkDirectDebitCreatePaymentReqDto
  extends IBrokerageUkDirectDebitPaymentMutableDto {
  collectionDate?: string;
}

export interface IBrokerageUkDirectDebitCreatePaymentResDto {
  id: string;
}
