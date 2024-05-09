import type {
  InvestorBrokerageAccountStatusEnum,
  InvestorBrokerageAccountTypeEnum,
  InvestorBrokerageEmploymentStatusEnum,
  InvestorBrokerageIndustryEnum,
  InvestorBrokerageSourcesOfWealthEnum,
} from './Brokerage.enum';
import {
  InvestorBrokerageUkDirectDebitPaymentStatusEnum,
  InvestorBrokerUkDirectDebitMandateStatusEnum,
} from './Brokerage.enum';
import { IBrokerageIntegrationListAllBaseResponseDto } from '@bambu/shared';

export interface InvestorBrokerageAccountDto
  extends InvestorBrokerageAccountMutableDto {
  id: string;
  status: InvestorBrokerageAccountStatusEnum;
  addedAt: string;
}

export interface InvestorBrokerageAddressDto
  extends InvestorBrokerageAddressCreationDto {
  id: string; // Required field, with minLength: 1
  addedAt: string; // Required field, date-time format
}

export interface InvestorBrokeragePartyDto
  extends InvestorBrokerageCreationDto {
  identifiers: InvestorBrokerageIdentifierDto[];
  addedAt: string;
  version: number;
  id: string;
  tenantId: string;
}

export interface InvestorBrokerageIdentifierDto
  extends InvestorBrokerageIdentifierCreationDto {
  id: string;
}

export interface InvestorBrokerageAccountMutableDto {
  type: InvestorBrokerageAccountTypeEnum;
  clientReference?: string | null;
  name: string;
  productId: string;
  owner: string;
}

export interface InvestorBrokerageAddressCreationDto {
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

export interface InvestorBrokerageCreationDto {
  type: string;
  title: string;
  forename: string;
  middlename: string | null;
  surname: string;
  previousSurname: string | null;
  countryOfBirth: string | null;
  emailAddress: string;
  telephoneNumber: string;
  dateOfBirth: string;
  dateOfDeath: string | null;
  taxResidencies: string[];
  nationalities: string[];
  employmentStatus: InvestorBrokerageEmploymentStatusEnum;
  industry: InvestorBrokerageIndustryEnum;
  sourcesOfWealth: InvestorBrokerageSourcesOfWealthEnum[];
  annualIncome: InvestorBrokerageAnnualIncomeDto;
  clientReference: string;
  identifiers: InvestorBrokerageIdentifierCreationDto[];
}

export interface InvestorBrokerageIdentifierCreationDto {
  type: string;
  value: string;
  issuer: string;
}

export interface InvestorBrokerageAnnualIncomeDto {
  amount: number;
  currency: string;
}

export interface InvestorBrokerageCreateBankAccountForPartyRequestDto {
  accountNumber: string;
  countryCode: string; // GB
  currency: string; // GBP
  name: string;
  sortCode: string;
}
export interface InvestorBrokerageBankAccForPartyItem {
  accountNumber: string; //"55779911",
  countryCode: string; //"GB",
  currency: string; //"GBP",
  name: string; //"C Kent & L Lane",
  sortCode: string; // "20-00-00",
  addedAt: string; //"2021-01-01T00:00:00.000Z",
  clientReference: string; // "1944a59713",
  deactivatedAt: string; // "2021-01-01T00:00:00.000Z",
  id: string; //"bnk-33wdqmffe22aq6",
  partyId: string; //"pty-33wds6i4i242wc"
}

export type InvestorBrokerageCreateBankAccountForPartyResponseDto =
  InvestorBrokerageBankAccForPartyItem;

export type InvestorBrokerageGetBankAccountsForPartyResponseDto =
  Array<InvestorBrokerageBankAccForPartyItem>;

export type InvestorBrokerageIntegrationPartyBankAccountListAllResponseDto =
  InvestorBrokerageIntegrationListAllBaseResponseDto<
    InvestorBrokerageBankAccForPartyItem[]
  >;

export interface InvestorBrokerageCreateDirectDebitMandateRequestDto {
  bankAccountId: string;
  partyId: string;
}

export interface InvestorBrokerageDirectDebitMandateItem {
  bankAccountId: string;
  partyId: string;
  id: string;
  reason: string;
  reference: string;
  status: InvestorBrokerUkDirectDebitMandateStatusEnum;
}

export interface InvestorBrokerageUkDirectDebitPaymentAmountDto {
  currency: string;
  amount: number;
}

export interface InvestorBrokerageUkDirectDebitPaymentMutableDto {
  amount: InvestorBrokerageUkDirectDebitPaymentAmountDto;
  mandateId: string;
  goalId: string;
  collectionDate?: string;
}

export interface InvestorBrokerageUkDirectDebitCreatePaymentReqDto
  extends InvestorBrokerageUkDirectDebitPaymentMutableDto {
  collectionDate?: string;
}

export interface InvestorBrokerageUkDirectDebitCreatePaymentResDto {
  id: string;
}

export interface InvestorBrokerageIntegrationListAllBaseResponseDto<T> {
  paginationToken: string | null;
  results: T;
}

export interface InvestorBrokerageUkDirectDebitPaymentDto
  extends InvestorBrokerageUkDirectDebitPaymentMutableDto {
  id: string;
  subscriptionId: string | null;
  createdAt: string;
  reason: string | null;
  status: InvestorBrokerageUkDirectDebitPaymentStatusEnum;
}

export type InvestorBrokerageUkDirectDebitPaymentListAllResponseDto =
  InvestorBrokerageIntegrationListAllBaseResponseDto<InvestorBrokerageUkDirectDebitPaymentDto>;

export type InvestorBrokerageGetDirectDebitMandatesResponseDto =
  Array<InvestorBrokerageDirectDebitMandateItem>;

export type InvestorBrokerageCreateDirectDebitMandateResponseDto =
  InvestorBrokerageDirectDebitMandateItem;

export type InvestorBrokerageDirectDebitMandateCancelRequestDto = {
  mandateId: string;
};

export type InvestorBrokerageDirectDebitMandateGetPdfRequestDto = {
  mandateId: string;
};

export type InvestorBrokerageDirectDebitMandateGetPdfPreviewRequestDto = {
  bankAccountId: string;
};

export type InvestorBrokerageGetNextPossiblePaymentRequestDto = {
  mandateId: string;
};

export type InvestorBrokerageGetNextPossiblePaymentResponseDto = {
  date: string;
};

export type InvestorBrokerageGetBankAccountByIdRequestDto = {
  bankAccountId: string;
};

export enum InvestorBrokerageUkDirectDebitSubscriptionIntervalEnum {
  MONTHYL = 'Monthly',
  YEARLY = 'Yearly',
}

export enum InvestorBrokerageUkDirectDebitSubscriptionStatusEnum {
  CREATED = 'Created',
  ACTIVE = 'Active',
  PAUSED = 'Paused',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled',
}

export interface InvestorBrokerageUkDirectDebitAmountDto {
  currency: string;
  amount: number;
}

export interface InvestorBrokerageUkDirectDebitCreateSubscriptionReqDto {
  mandateId: string;
  goalId: string;
  amount: InvestorBrokerageUkDirectDebitAmountDto;
  interval: InvestorBrokerageUkDirectDebitSubscriptionIntervalEnum;
  dayOfMonth?: number;
  month?: string;
  startDate?: string;
}

export interface InvestorBrokerageUkDirectDebitCreateSubscriptionResDto {
  id: string;
}

export interface InvestorBrokerageIntegrationMoneyDto {
  currency: string;
  amount: number;
}

export enum InvestorBrokerageIntegrationWithdrawalTypeEnum {
  SpecifiedAmount = 'SpecifiedAmount',
  Full = 'Full',
}

export interface InvestorBrokerageWithdrawalRequestDto {
  bankAccountId: string;
  consideration: InvestorBrokerageIntegrationMoneyDto;
  reference?: string | null;
  type: InvestorBrokerageIntegrationWithdrawalTypeEnum;
  closePortfolio: boolean;
  goalId: string;
}

export enum InvestorBrokerageIntegrationWithdrawalStatusEnum {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  SETTLED = 'Settled',
  CANCELLING = 'Cancelling',
  CANCELLED = 'Cancelled',
  REJECTED = 'Rejected',
}

export interface InvestorBrokerageIntegrationListAllQueryParamsBaseDto {
  after?: string;
  limit: number;
}

export interface InvestorBrokerageWithdrawalResponseDto {
  bankAccountId: string;
  consideration: InvestorBrokerageIntegrationMoneyDto;
  reference?: string | null;
  type: InvestorBrokerageIntegrationWithdrawalTypeEnum;
  goalId: string;
  status: InvestorBrokerageIntegrationWithdrawalStatusEnum;
  reason: string | null;
  id: string;
}

export interface InvestorBrokerageUkDirectDebitGetSubscriptionDto {
  id: string;
  mandateId: string;
  portfolioId: string;
  amount: InvestorBrokerageUkDirectDebitAmountDto;
  status: InvestorBrokerageUkDirectDebitSubscriptionStatusEnum;
  interval: InvestorBrokerageUkDirectDebitSubscriptionIntervalEnum;
  dayOfMonth: number;
  month: string;
  createdAt: string;
}

export interface InvestorBrokerageCancelDirectDebitSubscriptionRequestDto {
  subscriptionId: string;
}

/**
 * limit : 1-1000
 * mandateId & goalId:
 * These two keys are marked as optional but
 * one or both need to be in place.
 * If mandateId is put in then entries related to that mandate are returned,
 * if goalId is provided, we will return entries related to that goal.
 * If both are put in then entries will
 * be returned where both mandate and goal intersect.
 * Status: Available values : Created, Active, Paused, Failed, Cancelled
 */
export interface InvestorBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto
  extends InvestorBrokerageIntegrationListAllQueryParamsBaseDto {
  mandateId?: string;
  goalId?: string;
  status?: InvestorBrokerageUkDirectDebitSubscriptionStatusEnum;
}

export type InvestorBrokerageUkDirectDebitSubscriptionListAllResponseDto =
  IBrokerageIntegrationListAllBaseResponseDto<
    InvestorBrokerageUkDirectDebitGetSubscriptionDto[]
  >;
