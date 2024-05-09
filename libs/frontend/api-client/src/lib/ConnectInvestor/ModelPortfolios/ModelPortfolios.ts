import ConnectInvestorBaseApi from '../_Base/Base';
import type { ConnectPortfolioSummaryDto } from '@bambu/shared';

export type ConnectInvestorGetModelPortfoliosSummaryResponseDto =
  ConnectPortfolioSummaryDto.IConnectPortfolioSummaryDto[];

export class ConnectInvestorAdvisorModelPortfoliosApi extends ConnectInvestorBaseApi {
  constructor(private readonly apiPath = '/model-portfolios') {
    super();
  }

  /**
   * Gets model portfolio summary.
   * - {@link http://localhost:9000/openapi#/Connect%20Investor/ConnectInvestorController_GetInvestorModelPortfolioSummary}.
   */
  public async getModelPortfoliosSummary() {
    return await this.axios.get<ConnectInvestorGetModelPortfoliosSummaryResponseDto>(
      `${this.apiPath}/summary`
    );
  }
}

export default ConnectInvestorAdvisorModelPortfoliosApi;
