export enum EnumBambuApiLibraryGetProjectionsRequestCompoundingValue {
  YEARLY = 'yearly',
  SEMI_ANNUALLY = 'semiAnnually',
  QUARTERLY = 'quarterly',
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
}

export interface IBambuApiLibraryGetProjectionsRequestShortfallRecommendationDto {
  initialInvestment: boolean;
  constantInfusion: boolean;
  dynamicIncreasingInfusion: boolean;
  dynamicDecreasingInfusion: boolean;
  goalAmount: boolean;
  goalYear: boolean;
}

export interface IBambuApiLibraryGetProjectionsRequestAvailablePortfolioDto {
  modelPortfolioId: string;
  discreteExpectedMean: number;
  discreteExpectedStandardDeviation: number;
}

export interface IBambuApiLibraryGetProjectionsRequestSurplusRecommendationDto {
  glidePath: IBambuApiLibraryGetProjectionsRequestGlidePathDto;
}

export interface IBambuApiLibraryGetProjectionsRequestGlidePathDto {
  glidePath: boolean;
  portfolioDerisking: boolean;
  // YYYY-MM-DD
  deriskStartDate: string;
  // YYYY-MM-DD
  deriskEndDate: string;
}

export interface IBambuApiLibraryGetProjectionsRequestInputDto {
  // YYYY-MM-DD
  startDate: string;
  // YYYY-MM-DD
  endDate: string;
  compounding: EnumBambuApiLibraryGetProjectionsRequestCompoundingValue;
  confidenceInterval: number;
  grossInitialInvestment: number;
  currentWealth: number;
  frontEndFees: number;
  backEndFees: number;
  managementFees: number[];
  grossGoalAmount: number;
  modelPortfolioIdList: any[];
  infusions: number[];
  targetProbability: number;
}

export interface IBambuApiLibraryGetProjectionsRequestRecommendationSelectionDto {
  shortfallRecommendation: IBambuApiLibraryGetProjectionsRequestShortfallRecommendationDto;
  surplusRecommendation: IBambuApiLibraryGetProjectionsRequestSurplusRecommendationDto;
}

/**
 * This is the main DTO for use by the caller/client.
 * The sub-objects are split out so the client can have more flexibility in DTO construction.
 */
export interface IBambuApiLibraryGetProjectionsRequestDto {
  recommendationSelection: IBambuApiLibraryGetProjectionsRequestRecommendationSelectionDto;
  availablePortfolios: IBambuApiLibraryGetProjectionsRequestAvailablePortfolioDto[];
  inputs: IBambuApiLibraryGetProjectionsRequestInputDto;
}
