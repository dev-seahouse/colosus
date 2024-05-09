import type { ConnectAdvisorDto } from '@bambu/shared';

import ConnectAdvisorBasePrivateApi from '../_Base/Base';

export type ConnectAdvisorGetPreferencesResponseDto =
  ConnectAdvisorDto.IConnectAdvisorPreferencesReadApiDto;

export type ConnectAdvisorUpdatePreferencesResponseDto =
  ConnectAdvisorGetPreferencesResponseDto;

export type ConnectAdvisorUpdatePreferencesRequestDto =
  ConnectAdvisorDto.IConnectAdvisorPreferencesUpdateApiDto;

export class ConnectAdvisorPreferencesApi extends ConnectAdvisorBasePrivateApi {
  constructor(private readonly apiPath = 'preferences') {
    super();
  }

  /**
   * Returns leads filter setting for advisor
   * {@link http://localhost:9000/openapi#/Connect%20Advisor/ConnectAdvisorController_GetAdvisorPreferences }
   */
  public async getPreferences() {
    return await this.axios.get<ConnectAdvisorGetPreferencesResponseDto>(
      `${this.apiPath}`
    );
  }

  /**
   * Updates leads filter setting for advisor
   * {@link http://localhost:9000/openapi#/Connect%20Advisor/ConnectAdvisorController_GetAdvisorPreferences }
   */
  public async updatePreferences(
    req: ConnectAdvisorUpdatePreferencesRequestDto
  ) {
    return await this.axios.put<ConnectAdvisorUpdatePreferencesResponseDto>(
      `${this.apiPath}`,
      req
    );
  }
}

export default ConnectAdvisorPreferencesApi;
