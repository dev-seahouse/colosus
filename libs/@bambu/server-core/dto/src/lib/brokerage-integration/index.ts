/**
 * TODO: We need to move this to a shared library
 */

export enum IBrokerageAuthenticationTokenTypeEnum {
  BEARER = 'Bearer',
}

export interface IBrokerageAuthenticationTokenDto {
  token: string;
  lifespanInSeconds: number;
  inceptionDateIsoString: string;
  tokenType: IBrokerageAuthenticationTokenTypeEnum;
  scope: string;
  rawData: Record<string, unknown>;
}

export * from './brokerage-integration-bank-account-list-all-response.dto';
export * from './brokerage-integration-bank-account-mutable.dto';
export * from './brokerage-integration-bank-account.dto';
export * from './brokerage-integration-list-all-parties-query-params.dto';
export * from './brokerage-integration-list-all-parties-response.dto';
export * from './brokerage-integration-list-all-query-params-base.dto';
export * from './brokerage-integration-party-address-creation.dto';
export * from './brokerage-integration-party-address-list-all-params.dto';
export * from './brokerage-integration-party-address-list-all-response.dto';
export * from './brokerage-integration-party-address.dto';
export * from './brokerage-integration-party-annual-income.dto';
export * from './brokerage-integration-party-creation.dto';
export * from './brokerage-integration-party-identifier.dto';
export * from './brokerage-integration-party-update.dto';
export * from './brokerage-integration-party.dto';
export * from './brokerage-integration-transaction-price.dto';
export * from './brokerage-integration-transaction.dto';
export * from './brokerage-integration-transactions-list-all-query-params.dto';
export * from './brokerage-integration-transactions-list-all-response.dto';
export * from './i-brokerage-integration-account.dto';
export * from './i-brokerage-integration-bank-account-list-all-query-params.dto';
export * from './i-brokerage-integration-bank-account-mutable.dto';
export * from './i-brokerage-integration-bank-account.dto';
export * from './i-brokerage-integration-list-all-base-response.dto';
export * from './i-brokerage-integration-list-all-query-params-base.dto';
export * from './i-brokerage-integration-model-portfolio.dto';
export * from './i-brokerage-integration-party-address.dto';
export * from './i-brokerage-integration-party-bank-account-list-all-response.dto';
export * from './i-brokerage-integration-party.dto';
export * from './i-brokerage-integration-portfolio.dto';
export * from './i-brokerage-integration-transactions-list-all-query-params.dto';
export * from './i-brokerage-integration-uk-direct-debit-payment.dto';
export * from './i-brokerage-integration-uk-direct-debit-subscription.dto';
export * from './i-brokerage-integration-valuation.dto';
export * from './i-brokerage-uk-direct-debit-mandate.dto';
export * from './i-brokerage-integration-performance.dto';
export * from './i-brokerage-integration-list-all-performance-query-response.dto';
export * from './i-brokerage-integration-list-all-performance-query-params.dto';
export * from './brokerage-integration-money.dto';
export * from './brokerage-integration-withdrawal-mutable.dto';
export * from './brokerage-integration-withdrawal-shared.dto';
export * from './brokerage-integration-withdrawal.dto';
export * from './brokerage-integration-list-all-withdrawals-query-params.dto';
export * from './brokerage-integration-list-all-withdrawals-query-response.dto';
export * from './brokerage-integration-list-all-withdrawals-query-params-common.dto';
export * from './colossus-list-all-withdrawals-query-params.dto';
export * from './brokerage-integration-withdrawal-mutable-shared.dto';
export * from './colossus-withdrawal-mutable.dto';
