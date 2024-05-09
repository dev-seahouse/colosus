import { QuestionnaireTypeEnum } from './i-risk-profile.dto';

export interface IGetRiskQuestionnaire {
  id: string;
  questionnaireType: QuestionnaireTypeEnum.RISK_PROFILING_QUESTIONNAIRE;
  questionnaireName: string;
  activeVersion: number;
  Questionnaire: IQuestionnaireGrouping[];
}

export interface IQuestionnaireGrouping {
  id: string;
  groupingType: string;
  groupingName: string;
  groupingWeight: string;
  scoringRules: string;
  sortKey: number;
  additionalConfiguration?: unknown;
  Questions: IQuestion[];
}

export interface IQuestion {
  id: string;
  question: string;
  questionType: string;
  questionFormat: string;
  questionWeight: string;
  sortKey: number;
  additionalConfiguration?: unknown;
  Answers: IAnswer[];
}

export interface IAnswer {
  id: string;
  answer: string;
  sortKey: number;
  score: string;
  additionalConfiguration: unknown;
}
