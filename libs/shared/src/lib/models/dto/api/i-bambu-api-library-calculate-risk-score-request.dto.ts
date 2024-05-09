export interface IBambuApiLibraryCalculateRiskScoreRequestAnswerDto {
  questionGroupingId: string;
  questionId: string;
  answerId: string;
  answerScoreNumber: number | null;
}

export interface IBambuApiLibraryCalculateRiskScoreRequestDto {
  questionnaireId: string;
  questionnaireVersion: number;
  answers: IBambuApiLibraryCalculateRiskScoreRequestAnswerDto[];
}

export interface IQuestionScoreDetailsDto {
  questionCategoryName: string;
  questionId: string;
  questionScore: string;
  questionWeight: string;
  questionScoreDetails?: IQuestionScoreDetailsDto[];
}

export interface IOverallScoreDetailsDto {
  questionCategoryName: string;
  questionId: string;
  questionScore: string;
  questionWeight: string;
  questionScoreDetails: IQuestionScoreDetailsDto[];
}

export interface IBambuApiLibraryCalculateRiskScoreResponseDto {
  overallScoreDetails: IOverallScoreDetailsDto[];
  overallScore: string;
}

export interface IQuestionDetailsDto {
  questionId: string;
  questionCategoryName: string;
  questionWeight: string;
  questionAnswer?: string | null;
  questionCapFlag?: boolean;
  questionRoundFlag?: boolean;
  questionRoundDownFlag?: boolean;
  questionRoundUpFlag?: boolean;
  questionNormalisationFactor1?: string;
  questionNormalisationFactor2?: string;
  questionDetails?: IQuestionDetailsDto[];
}

export interface IBambuApiLibraryCalculateRiskPayloadDto {
  nbRiskBuckets: string;
  roundFlag: boolean;
  questionnaire: IQuestionDetailsDto[];
}

export interface IQuestionDetailsDto {
  questionId: string;
  questionCategoryName: string;
  questionWeight: string;
  questionAnswer?: string | null;
  questionFloorFlag?: boolean;
  questionRoundFlag?: boolean;
  questionRoundUpFlag?: boolean;
  questionRoundDownFlag?: boolean;
  questionNormalisationFactor1?: string;
  questionNormalisationFactor2?: string;
  questionDetails?: IQuestionDetailsDto[];
}

export interface IBambuApiLibraryQuestionnairePayloadDto
  extends IQuestionDetailsDto {
  questionDetails?: IQuestionDetailsDto[];
}

export interface IRiskCalculateResponseDto {
  questionnaireId: string;
  questionnaireVersion: number;
  questionnairePayload: IBambuApiLibraryCalculateRiskScoreRequestAnswerDto[];
  riskProfileComputationResult: IOverallScoreDetailsDto[];
  riskProfileScore: string;
  modelRiskProfile: Record<string, unknown>;
  modelPortfolioId: string;
}
