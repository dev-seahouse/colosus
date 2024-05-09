import ConnectInvestorBaseApi from '../_Base/Base';
import type { ConnectTenantDto } from '@bambu/shared';

export interface ConnectInvestorGetGoalTypesResponseDto {
  goalTypes: ReadonlyArray<ConnectTenantDto.IConnectTenantGoalTypeDto>;
}

export class ConnectInvestorGoalTypesApi extends ConnectInvestorBaseApi {
  constructor(private readonly apiPath = '/goal-types') {
    super();
  }

  public async getInvestorGoalTypes() {
    return await this.axios.get<ConnectInvestorGetGoalTypesResponseDto>(
      this.apiPath
    );
  }
}

export default ConnectInvestorGoalTypesApi;
