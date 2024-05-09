import { IBrokerageIntegrationListAllBaseResponseDto } from './i-brokerage-integration-list-all-base-response.dto';
import { IBrokerageIntegrationListAllQueryParamsBaseDto } from './i-brokerage-integration-list-all-query-params-base.dto';

export enum BrokerageUkDirectDebitSubscriptionStatusEnum {
  CREATED = 'Created',
  ACTIVE = 'Active',
  PAUSED = 'Paused',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled',
}

export enum BrokerageUkDirectDebitSubscriptionIntervalEnum {
  MONTHYL = 'Monthly',
  YEARLY = 'Yearly',
}

export interface IBrokerageUkDirectDebitAmountDto {
  currency: string;
  amount: number;
}

export interface IBrokerageUkDirectDebitGetSubscriptionDto {
  id: string;
  mandateId: string;
  portfolioId: string;
  amount: IBrokerageUkDirectDebitAmountDto;
  status: BrokerageUkDirectDebitSubscriptionStatusEnum;
  interval: BrokerageUkDirectDebitSubscriptionIntervalEnum;
  dayOfMonth: number;
  month: string;
  createdAt: string;
}

export type IBrokerageUkDirectDebitSubscriptionListAllResponseDto =
  IBrokerageIntegrationListAllBaseResponseDto<
    IBrokerageUkDirectDebitGetSubscriptionDto[]
  >;

export interface IBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto
  extends IBrokerageIntegrationListAllQueryParamsBaseDto {
  mandateId?: string;
  portfolioId?: string;
  status?: BrokerageUkDirectDebitSubscriptionStatusEnum;
}

export interface IBrokerageUkDirectDebitCreateSubscriptionReqDto {
  mandateId: string;
  portfolioId: string;
  amount: IBrokerageUkDirectDebitAmountDto;
  interval: BrokerageUkDirectDebitSubscriptionIntervalEnum;
  dayOfMonth?: number;
  month?: string;
  startDate?: string;
}

export interface IBrokerageUkDirectDebitCreateSubscriptionResDto {
  id: string;
}

export interface IBrokerageUkDirectDebitUpcomingSubscriptionDto {
  amount: IBrokerageUkDirectDebitAmountDto;
  collectionDate: string;
}

export interface IBrokerageUkDirectDebitUpdateSubscriptionDto {
  amount: IBrokerageUkDirectDebitAmountDto;
}
