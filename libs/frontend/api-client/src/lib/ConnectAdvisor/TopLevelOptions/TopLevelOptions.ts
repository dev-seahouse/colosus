import type { ConnectTenantDto } from '@bambu/shared';
import ConnectAdvisorBasePrivateApi from '../_Base/Base';

export type ConnectAdvisorGetTopLevelOptionsResponseDto =
  ConnectTenantDto.IConnectTenantSetTopLevelOptionsRequestDto;

export type ConnectAdvisorUpdateTopLevelOptionsRequestDto =
  ConnectTenantDto.IConnectTenantSetTopLevelOptionsRequestDto;

export class ConnectAdvisorTopLevelOptionsApi extends ConnectAdvisorBasePrivateApi {
  constructor(private readonly apiPath = '/top-level-options') {
    super();
  }

  /**
   * Function to get the top level options for an advisor.
   * - {@link http://localhost:9000/openapi#/Connect%20Advisor/ConnectAdvisorController_GetTopLevelOptions}.
   */
  public async getTopLevelOptions() {
    return await this.axios.get<ConnectAdvisorGetTopLevelOptionsResponseDto>(
      this.apiPath
    );
  }

  /**
   * Function to set the top level options for an advisor.
   * - {@link http://localhost:9000/openapi#/Connect%20Advisor/ConnectAdvisorController_SetTopLevelOptions}.
   */
  public async updateTopLevelOptions(
    req: ConnectAdvisorUpdateTopLevelOptionsRequestDto
  ) {
    return await this.axios.patch<ConnectAdvisorGetTopLevelOptionsResponseDto>(
      this.apiPath,
      req
    );
  }
}

export default ConnectAdvisorTopLevelOptionsApi;
