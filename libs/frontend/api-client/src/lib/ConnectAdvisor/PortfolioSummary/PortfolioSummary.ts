import type { ConnectPortfolioSummaryDto } from '@bambu/shared';
import ConnectAdvisorBasePrivateApi from '../_Base/Base';

export type ConnectAdvisorPortfolioRequestDto =
  ConnectPortfolioSummaryDto.IConnectPortfolioSummaryDto;
export interface ConnectAdvisorGetPortfoliosResponseDto {
  portfolioSummaries: ConnectPortfolioSummaryDto.IConnectPortfolioSummaryDto[];
}

export type ConnectAdvisorGetPortfolioByKeyResponseDto =
  ConnectPortfolioSummaryDto.IConnectPortfolioSummaryDto;

export class ConnectAdvisorPortfolioSummaryApi extends ConnectAdvisorBasePrivateApi {
  constructor(private readonly apiPath = '/portfolio-summary') {
    super();
  }

  /**
   * Get portfolio summaries for advisor.
   * - {@link http://localhost:9000/openapi#/Connect/GetPortfolioSummaries}.
   */
  public async getPortfolios() {
    return await this.axios.get<ConnectAdvisorGetPortfoliosResponseDto>(
      `${this.apiPath}`
    );
  }

  /**
   * Set a portfolio summary.
   * - {@link http://localhost:9000/openapi#/Connect/SetPortfolioSummary}.
   */
  public async updateConnectPortfolio(req: ConnectAdvisorPortfolioRequestDto) {
    return await this.axios.post(`${this.apiPath}`, req);
  }
}
export default ConnectAdvisorPortfolioSummaryApi;
