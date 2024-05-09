import ConnectInvestorBaseApi from '../_Base/Base';
import type { ConnectPortfolioDetailsDto } from '@bambu/shared';

export type GetInvestorPortfolioByIdType = {
  id: string;
};

export type ConnectInvestorGetInvestorPortfolioDetailsResponseDto =
  ConnectPortfolioDetailsDto.IConnectPortfolioDetailsDto;

export class ConnectInvestorPortfolioDetailsApi extends ConnectInvestorBaseApi {
  // TODO: This BE API is not yet set up
  constructor(private readonly apiPath = '/investor-portfolios') {
    super();
  }

  /**
   * Gets the portfolio details for a specified portfolio for an investor.
   */
  public async getInvestorPortfolio(req: GetInvestorPortfolioByIdType) {
    return await this.axios.get<ConnectInvestorGetInvestorPortfolioDetailsResponseDto>(
      // TODO: This is not yet set up on the BE
      `${this.apiPath}/${req.id}/details`
    );
  }
}

export default ConnectInvestorPortfolioDetailsApi;
