import {
  IRiskProfileDto,
  IGetLatestQuestionnaireVersion,
  IGetRiskQuestionnaire,
} from '@bambu/shared';

export abstract class RiskProfilingDomainServiceBase {
  public abstract GetRiskProfiles(params: {
    tenantId: string;
    requestId: string;
  }): Promise<IRiskProfileDto[] | null>;

  public abstract GetLatestRiskQuestionnaireVersionNumber(params: {
    tenantId: string;
    requestId: string;
  }): Promise<IGetLatestQuestionnaireVersion | null>;

  public abstract GetRiskQuestionnaire(params: {
    tenantId: string;
    requestId: string;
  }): Promise<IGetRiskQuestionnaire>;
}
