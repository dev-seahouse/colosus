import ConnectInvestorBaseApi from '../_Base/Base';
import type { ConnectAdvisorDto } from '@bambu/shared';

export interface ConnectInvestorGetAdvisorProfileResponseDto
  extends ConnectAdvisorDto.IConnectAdvisorProfileForAdvisorDto {
  incomeThreshold: number;
  retireeSavingsThreshold: number;
  advisorSubscriptionIds: 'CONNECT' | 'TRANSACT' | null;
  canPerformTransactActions: boolean;
}

export class ConnectInvestorAdvisorProfileApi extends ConnectInvestorBaseApi {
  constructor(private readonly apiPath = '/advisor-profile') {
    super();
  }

  /**
   * Retrieves some user information associated with the advisor.
   * - {@link http://localhost:9000/openapi#/Connect%20Investor/GetAdvisorProfile}.
   */
  public async getAdvisorProfile() {
    return await this.axios.get<ConnectInvestorGetAdvisorProfileResponseDto>(
      this.apiPath
    );
  }
}

export default ConnectInvestorAdvisorProfileApi;
