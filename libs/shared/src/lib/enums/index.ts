export * as ErrorCodes from './error-codes';
export * as PortfolioEnums from './portfolios';
export * as LeadsEnums from './leads';

export enum BambuGoProductIdEnum {
  CONNECT = 'CONNECT',
  TRANSACT = 'TRANSACT',
}

export enum EnumGenericDataSummaryFieldType {
  STRING = 'string',
  NUMBER = 'number',
  CURRENCY = 'currency',
}

export enum EnumGenericDataSummaryFieldFormat {
  DATE = 'date',
  DATE_TIME = 'date-time',
  EMAIL = 'email',
  PHONE = 'phone',
}

export enum EnumSortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SupportedBrokerageIntegrationEnum {
  WEALTH_KERNEL = 'WealthKernel',
}

export enum TenantTransactBrokerageStatusEnum {
  PENDING = 'PENDING',
  KYC_IN_PROGRESS = 'KYC_IN_PROGRESS',
  KYC_FAILED = 'KYC_FAILED',
  CONFIGURATION_IN_PROGRESS = 'CONFIGURATION_IN_PROGRESS',
  CONFIGURATION_FAILED = 'CONFIGURATION_FAILED',
  ACTIVE = 'ACTIVE',
  DEACTIVATED = 'DEACTIVATED',
}

export enum ApiKeyTypeEnum {
  BAMBU_API_LIB = 'BAMBU_API_LIB',
  WEALTH_KERNEL_API = 'WEALTH_KERNEL_API',
}

export enum BrokerageIntegrationWithdrawalTypeEnum {
  SpecifiedAmount = 'SpecifiedAmount',
  Full = 'Full',
}

export enum BrokerageIntegrationWithdrawalStatusEnum {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  SETTLED = 'Settled',
  CANCELLING = 'Cancelling',
  CANCELLED = 'Cancelled',
  REJECTED = 'Rejected',
}
