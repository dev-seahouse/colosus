import ConnectAdvisorBasePrivateApi from '../_Base/Base';
import type { ConnectTenantDto } from '@bambu/shared';

export interface ConnectAdvisorGetGoalTypesResponseDto {
  goalTypes: ReadonlyArray<ConnectTenantDto.IConnectTenantGoalTypeForTenantDto>;
}

export interface ConnectAdvisorSetGoalTypesRequestDto {
  /* An array of enabled goal type UUIDs sorted by display order */
  goalTypeIds: ReadonlyArray<string>;
}

export class ConnectAdvisorGoalTypesApi extends ConnectAdvisorBasePrivateApi {
  constructor(private readonly apiPath = 'goal-types') {
    super();
  }

  /**
   * Retrieves list of goal types and whether each is of them is enabled/disabled
   * - {@link http://localhost:9000/openapi#/Connect/GetGoalTypes}
   */
  public async getGoalTypes() {
    return await this.axios.get<ConnectAdvisorGetGoalTypesResponseDto>(
      `${this.apiPath}`
    );
  }

  /**
   * Enables or disables a goal type
   * - ${@link http://localhost:9000/openapi#/Connect/SetGoalTypes}
   */

  public async setGoalTypes(req: ConnectAdvisorSetGoalTypesRequestDto) {
    return await this.axios.post<never>(`${this.apiPath}`, req);
  }
}

export default ConnectAdvisorGoalTypesApi;
