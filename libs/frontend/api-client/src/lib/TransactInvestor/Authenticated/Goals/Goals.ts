import type {
  IGoalDetailedDto,
  IInvestorPlatformProfileGoalDto,
  ITransactPortfolioHoldingsDto,
} from '@bambu/shared';
import type { InvestorBrokerageIntegrationListAllBaseResponseDto } from '../Brokerage/Brokerage.types';
import TransactInvestorBaseApi from '../../_Base/Base';

export type InvestorGetGoalDetailsApiRequestDto = {
  goalId: string;
};

export type InvestorGoalHoldingsResponseDto = ITransactPortfolioHoldingsDto[];

export interface InvestorGetGoalDetailsApiResponseDto extends IGoalDetailedDto {
  portfolioValue: number;
  portfolioCumulativeReturn: number;
}

export enum InvestorBrokerageIntegrationTransactionStatusEnum {
  MATCHED = 'Matched',
  SETTLED = 'Settled',
  CANCELLED = 'Cancelled',
}

interface InvestorBrokerageIntegrationListAllQueryParamsBaseDto {
  after?: string;
  limit: number;
}

export enum InvestorBrokerageIntegrationTransactionTypeEnum {
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

interface InvestorBrokerageIntegrationTransactionPriceDto {
  currency: string;
  amount: number;
}

export interface InvestorBrokerageIntegrationTransactionsListAllQueryParamsDto
  extends InvestorBrokerageIntegrationListAllQueryParamsBaseDto {
  endDate?: string;
  isin?: string;
  portfolioId?: string;
  settledOn?: string;
  startDate?: string;
  updatedSince?: string;
  status?: InvestorBrokerageIntegrationTransactionStatusEnum;
  type?: InvestorBrokerageIntegrationTransactionTypeEnum;
}

export interface InvestorGetGoalTransactionsApiRequestDto
  extends InvestorBrokerageIntegrationTransactionsListAllQueryParamsDto {
  goalId: string;
}

export interface InvestorBrokerageIntegrationTransactionDto {
  type: InvestorBrokerageIntegrationTransactionTypeEnum;
  status: InvestorBrokerageIntegrationTransactionStatusEnum;
  price: InvestorBrokerageIntegrationTransactionPriceDto;
  portfolioId: string;
  isin: string;
  quantity: number;
  consideration: InvestorBrokerageIntegrationTransactionPriceDto;
  charges: InvestorBrokerageIntegrationTransactionPriceDto;
  bookCost: InvestorBrokerageIntegrationTransactionPriceDto | null;
  date: string;
  timestamp: string | Date;
  settledOn: string;
  updatedAt: string | Date;
  id: string;
}

export type InvestorBrokerageIntegrationTransactionsListAllResponseDto =
  InvestorBrokerageIntegrationListAllBaseResponseDto<
    InvestorBrokerageIntegrationTransactionDto[]
  >;

export type InvestorGetGoalsForTenantInvestorRequestDto = {
  pageSize: number;
  pageIndex: number;
};
export type InvestorGetGoalsForTenantInvestorResponseDto =
  IInvestorPlatformProfileGoalDto[];

export class TransactInvestorAuthenticatedGoalsApi extends TransactInvestorBaseApi {
  constructor(private readonly apiPath = 'authenticated/goals') {
    super();
  }

  /**
   * Get investor goal details.
   * - {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_GetInvestorGoalDetails}
   */
  public async getInvestorGoalDetails({
    goalId,
  }: InvestorGetGoalDetailsApiRequestDto) {
    const encodedId = encodeURIComponent(goalId);
    return this.axios.get<InvestorGetGoalDetailsApiResponseDto>(
      this.apiPath + `/${encodedId}`
    );
  }

  /**
   * Get the holdings for a goal
   * - {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_GetHoldingsForGoal}
   */
  public async getInvestorGoalHoldings(goalId: string) {
    return this.axios.get<InvestorGoalHoldingsResponseDto>(
      this.apiPath + `/${goalId}/holdings`
    );
  }

  /**
   * Get investor goals transactions
   * - {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_GetTransactionsForGoal}
   */

  public async getTransactionsForGoal(
    args: InvestorGetGoalTransactionsApiRequestDto
  ) {
    const { goalId, ...rest } = args;
    return this.axios.get<InvestorBrokerageIntegrationTransactionsListAllResponseDto>(
      this.apiPath + `/${goalId}/transactions`,
      {
        params: rest,
      }
    );
  }

  /**
   * get goals for tenant investor
   * http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_GetGoalsForTenantInvestor
   */
  public async getGoalsForTenantInvestor(
    args: InvestorGetGoalsForTenantInvestorRequestDto
  ) {
    return this.axios.get<InvestorGetGoalsForTenantInvestorResponseDto>(
      this.apiPath + `/`,
      {
        params: args,
      }
    );
  }
}
