import type {
  IBambuApiLibraryCalculateRiskScoreRequestDto,
  IGetRiskQuestionnaire,
  IQuestionnaireGrouping,
  IRiskCalculateResponseDto,
  IRiskProfileDto,
} from '@bambu/shared';
import ConnectInvestorBaseApi from '../_Base/Base';

export type ConnectGetInvestorRiskQuestionnaireResponseDto =
  IGetRiskQuestionnaire;

export type ConnectInvestorComputeRiskProfileScoreRequestDto =
  IBambuApiLibraryCalculateRiskScoreRequestDto;
export type ConnectInvestorComputeRiskProfileScoreResponseDto =
  IRiskCalculateResponseDto;

export interface ConnectInvestorRiskProfile extends IRiskProfileDto {
  riskProfileName: ConnectInvestorRiskProfileTypes;
}

export type ConnectInvestorGetInvestorRiskProfilesResponseDto =
  ConnectInvestorRiskProfile[];

export type ConnectInvestorRiskProfileTypes =
  | 'Very Conservative'
  | 'Conservative'
  | 'Balanced'
  | 'Growth'
  | 'Aggressive';

export type ConnectInvestorRiskQuestionnaireGroupingNames =
  | 'AGE'
  | 'GOAL'
  | 'FINANCIAL_KNOWLEDGE'
  | 'RISK_COMFORT_LEVEL'
  | 'FINANCIAL_HEALTH';

export type ConnectInvestorRiskQuestionnaireAnswer =
  ConnectInvestorComputeRiskProfileScoreRequestDto['answers'][number];

export type ConnectInvestorRiskQuestionnaireGrouping = IQuestionnaireGrouping;

export class ConnectInvestorRiskProfilingApi extends ConnectInvestorBaseApi {
  constructor(private readonly apiPath = '/risk-profiling') {
    super();
  }

  /**
   * Get risk profile questionnaire.
   * {@link http://localhost:9000/openapi#/Connect%20Investor/ConnectInvestorController_GetInvestorRiskQuestionnaire }
   */
  public async getInvestorRiskQuestionnaire() {
    // remove this await
    return await this.axios.get<ConnectGetInvestorRiskQuestionnaireResponseDto>(
      `${this.apiPath}/questionnaire`
    );
  }

  /**
   * Computes riskProfile score and gets risk profile type.
   * {@link http://localhost:9000/openapi#/Connect%20Investor/ConnectInvestorController_ComputeRiskProfileScore }
   */
  public async computeRiskProfileScore(
    req: ConnectInvestorComputeRiskProfileScoreRequestDto
  ) {
    return this.axios.post<ConnectInvestorComputeRiskProfileScoreResponseDto>(
      `${this.apiPath}/compute`,
      req
    );
  }

  /**
   * Gets risk profile types.
   * {@linkhttp://localhost:9000/openapi#/Connect%20Investor/ConnectInvestorController_GetInvestorRiskProfiles }
   */
  public async getInvestorRiskProfiles() {
    return this.axios.get<ConnectInvestorGetInvestorRiskProfilesResponseDto>(
      `${this.apiPath}/risk-profiles`
    );
  }
}

export default ConnectInvestorRiskProfilingApi;
