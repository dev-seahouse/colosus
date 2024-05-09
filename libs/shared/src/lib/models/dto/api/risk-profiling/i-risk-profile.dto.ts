export enum QuestionnaireTypeEnum {
  RISK_PROFILING_QUESTIONNAIRE = 'RISK_PROFILING',
}

export enum ScoringRulesEnum {
  MIN = 'MIN',
  MAX = 'MAX',
  AVG = 'AVERAGE',
}

export enum QuestionFormatEnum {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  NUMERIC_ENTRY = 'NUMERIC_ENTRY',
}

export interface IRiskProfileDto {
  id: string;
  lowerLimit: string;
  upperLimit: string;
  riskProfileName: string;
  riskProfileDescription: string;
  tenantId: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string;
  updatedBy?: string;
}

export interface IGetLatestQuestionnaireVersion {
  id: string;
  questionnaireVersion: number;
  questionnaireType: QuestionnaireTypeEnum.RISK_PROFILING_QUESTIONNAIRE;
  versionId: string;
}
