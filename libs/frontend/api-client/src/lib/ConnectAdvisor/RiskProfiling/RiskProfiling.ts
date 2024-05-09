import type { IGetRiskQuestionnaire, IRiskProfileDto } from '@bambu/shared';
import ConnectAdvisorBasePrivateApi from '../_Base/Base';

export type ConnectAdvisorGetRiskProfilesResponseDto = IRiskProfileDto[];
export type ConnectAdvisorGetQuestionnaireResponseDto = IGetRiskQuestionnaire;

export class ConnectAdvisorRiskProfilingApi extends ConnectAdvisorBasePrivateApi {
  constructor(private readonly apiPath = '/risk-profiling') {
    super();
  }

  /**
   * Get risk profiles.
   * {@link http://localhost:9000/openapi#/Connect%20Advisor/ConnectAdvisorController_GetRiskProfiles }
   */
  public async getRiskProfiles() {
    return await this.axios.get<ConnectAdvisorGetRiskProfilesResponseDto>(
      `${this.apiPath}/risk-profiles`
    );
  }

  /**
   *  {@link http://localhost:9000/openapi#/Connect%20Advisor/ConnectAdvisorController_GetRiskQuestionnaire }
   */
  public async getRiskQuestionnaire() {
    return await this.axios.get<ConnectAdvisorGetQuestionnaireResponseDto>(
      `${this.apiPath}/questionnaire`
    );
  }
}

export default ConnectAdvisorRiskProfilingApi;
