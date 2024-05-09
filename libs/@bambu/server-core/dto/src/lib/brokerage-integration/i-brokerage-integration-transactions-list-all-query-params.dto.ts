import { IBrokerageIntegrationListAllBaseResponseDto } from './i-brokerage-integration-list-all-base-response.dto';
import { IBrokerageIntegrationListAllQueryParamsBaseDto } from './i-brokerage-integration-list-all-query-params-base.dto';

export enum BrokerageIntegrationTransactionStatusEnum {
  MATCHED = 'Matched',
  SETTLED = 'Settled',
  CANCELLED = 'Cancelled',
}

export enum BrokerageIntegrationTransactionTypeEnum {
  ADJUSTMENT = 'Adjustment',
  BUY = 'Buy',
  SELL = 'Sell',
  DEPOSIT = 'Deposit',
  WITHDRAWAL = 'Withdrawal',
  CHARGE = 'Charge',
  CONSOLIDATION_IN = 'ConsolidationIn',
  CONSOLIDATION_OUT = 'ConsolidationOut',
  DIVIDEND = 'Dividend',
  FX_IN = 'FxIn',
  FX_OUT = 'FxOut',
  CASH_TRANSFER_IN = 'CashTransferIn',
  INTERNAL_CASH_TRANSFER_IN = 'InternalCashTransferIn',
  INTERNAL_CASH_TRANSFER_OUT = 'InternalCashTransferOut',
  INTERNAL_TRANSFER_IN = 'InternalTransferIn',
  INTERNAL_TRANSFER_OUT = 'InternalTransferOut',
  TRANSFER_IN = 'TransferIn',
  TRANSFER_OUT = 'TransferOut',
  REDEMPTION = 'Redemption',
}

export interface IBrokerageIntegrationTransactionsListAllQueryParamsDto
  extends IBrokerageIntegrationListAllQueryParamsBaseDto {
  endDate?: string;
  isin?: string;
  portfolioId?: string;
  settledOn?: string;
  startDate?: string;
  status?: BrokerageIntegrationTransactionStatusEnum;
  type?: BrokerageIntegrationTransactionTypeEnum;
  updatedSince?: string;
}

export interface IBrokerageIntegrationTransactionPriceDto {
  currency: string;
  amount: number;
}

export interface IBrokerageIntegrationTransactionDto {
  portfolioId: string;
  isin: string;
  type: BrokerageIntegrationTransactionTypeEnum;
  status: BrokerageIntegrationTransactionStatusEnum;
  price: IBrokerageIntegrationTransactionPriceDto;
  quantity: number;
  consideration: IBrokerageIntegrationTransactionPriceDto;
  charges: IBrokerageIntegrationTransactionPriceDto;
  date: string;
  timestamp: string | Date;
  settledOn: string;
  updatedAt: string | Date;
  bookCost: IBrokerageIntegrationTransactionPriceDto | null;
  id: string;
}

export type IBrokerageIntegrationTransactionsListAllResponseDto =
  IBrokerageIntegrationListAllBaseResponseDto<
    IBrokerageIntegrationTransactionDto[]
  >;
