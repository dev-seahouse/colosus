import type { IGetModelPortfolioByIdResponseDto } from '@bambu/shared';
import TransactInvestorBaseApi from '../_Base/Base';

export type TransactModelPortfolioResponseDto =
  IGetModelPortfolioByIdResponseDto;

export class TransactInvestorModelPortfoliosApi extends TransactInvestorBaseApi {
  constructor(private readonly apiPath = '/model-portfolios') {
    super();
  }

  /**
   * Logs an investor in on the Transact platform. It should perform the same action as the core /login endpoint, but with an inferred realmId.
   * - {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_GetTransactModelPortfolioById}.
   */
  public async getModelPortfolioById(id: string) {
    return this.axios.get<IGetModelPortfolioByIdResponseDto>(
      `${this.apiPath}/${id}`
    );
  }
}

export default TransactInvestorModelPortfoliosApi;
