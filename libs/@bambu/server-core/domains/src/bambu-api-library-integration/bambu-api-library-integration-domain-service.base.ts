import { IServerCoreIamClaimsDto } from '@bambu/server-core/dto';
import {
  BambuApiLibraryGetProjectionsResponseHealthCheckStatus,
  EnumBambuApiLibraryGetProjectionsRequestCompoundingValue,
  EnumBambuApiLibraryCalculateUniversityGoalAmountRequestSpecialisation,
  EnumBambuApiLibraryCalculateUniversityGoalAmountRequestUniversityType,
  EnumBambuApiLibraryCalculateRetirementGoalAmountRequestGender,
  EnumBambuApiLibraryCalculateRetirementGoalAmountRequestPeriod,
} from './bambi-api-library-integration-domain.enum';
import {
  IBambuApiLibraryCalculateRiskPayloadDto,
  IBambuApiLibraryCalculateRiskScoreResponseDto,
} from '@bambu/shared';

export interface IBambuApiLibraryGetProjectionsResponseProjectionItemsDto {
  date: string;
  goalAmountNet: number;
  projectionLowerAmt: number;
  projectionMiddleAmt: number;
  projectionTargetAmt: number;
  projectionUpperAmt: number;
}

export interface IBambuApiLibraryGetProjectionsResponsePerformanceTestDto {
  constantInfusionRecRunningTime: number;
  dynamicDecreasingInfusionRecRunningTime: number;
  dynamicIncreasingInfusionRecRunningTime: number;
  goalAmountRecRunningTime: number;
  goalYearRecRunningTime: number;
  initialInvestmentRecRunningTime: number;
}

export interface IBambuApiLibraryGetProjectionsResponseRecommendationsDto {
  constantInfusion: number[];
  dynamicDecreasingInfusion: number[];
  dynamicIncreasingInfusion: number[];
  endDate: string;
  goalAmount: number;
  initialInvestment: number;
}

export interface IBambuApiLibraryGetProjectionsResponseDto {
  difference: number;
  goalProbability: string; //'0.558095';
  healthCheckStatus: BambuApiLibraryGetProjectionsResponseHealthCheckStatus;
  matchGoalProb: boolean;
  performanceTest: IBambuApiLibraryGetProjectionsResponsePerformanceTestDto;
  projections: IBambuApiLibraryGetProjectionsResponseProjectionItemsDto[];
  recommendations: IBambuApiLibraryGetProjectionsResponseRecommendationsDto;
  runningTime: string;
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

export interface IBambuApiLibraryGetCountryRatesResponseDto {
  id: number;
  countryCode: string;
  inflationRateShortTerm: number | null;
  inflationRateLongTerm: number;
  savingsAccountInterestRate: number | null;
  retirementAgeMale: number | null;
  retirementAgeFemale: number | null;
  lifeExpectancyMale: number;
  lifeExpectancyFemale: number;
  annualWageGrowthShortTerm: number;
  annualWageGrowthLongTerm: number;
  averageSavingsRate: number;
  dateCreated: string;
}

export interface IBambuApiLibraryGetCountriesResponseDto {
  code: string;
  internationalDialingCode: string;
  currencyCode: string;
  flag: string;
  cioc: string;
  name: string;
  demonym: string;
  cca2: string;
  cca3: string;
  ccn3: string;
  id: string;
}

export interface IBambuApiLibraryGetCountriesResponseDto {
  code: string;
  internationalDialingCode: string;
  currencyCode: string;
  flag: string;
  cioc: string;
  name: string;
  demonym: string;
  cca2: string;
  cca3: string;
  ccn3: string;
  id: string;
}

export interface IBambuApiLibraryCalculateUniversityGoalAmountResponseDto {
  goalYear: number;
  yearsToGoal: number;
  maxYearsToGoal: number;
  educationCost: number;
  universityCost: number;
  currency: string;
}

export interface IBambuApiLibraryCalculateUniversityGoalAmountResponseDto {
  goalYear: number;
  yearsToGoal: number;
  maxYearsToGoal: number;
  educationCost: number;
  universityCost: number;
  currency: string;
}

export interface IBambuApiLibraryCalculateUniversityGoalAmountResponseDto {
  goalYear: number;
  yearsToGoal: number;
  maxYearsToGoal: number;
  educationCost: number;
  universityCost: number;
  currency: string;
}

export interface IBambuApiLibraryCalculateUniversityGoalAmountRequestDto {
  age: number;
  ageOfUni: number;
  maxGoalYear: number;
  universityType: EnumBambuApiLibraryCalculateUniversityGoalAmountRequestUniversityType;
  specialisation: EnumBambuApiLibraryCalculateUniversityGoalAmountRequestSpecialisation;
  country: string;
  inflationRate: number;
  currentYear: number;
  state: string;
  residencyType: string;
}

export interface IBambuApiLibraryCalculateRetirementGoalAmountResponseRetirementAssetsDto {
  totalSocialSecurityBenefits: number;
  totalPension: number;
  totalRetirementSavings: number;
  totalAssets: number;
}

export interface IBambuApiLibraryCalculateRetirementGoalAmountResponseDto {
  goalAmount: number;
  totalRetirementExpenditure: number;
  workingPeriod: number;
  yearsToDecumulate: number;
  retirementAssets: IBambuApiLibraryCalculateRetirementGoalAmountResponseRetirementAssetsDto;
}

export interface IBambuApiLibraryCalculateRetirementGoalAmountRequestAdditionalSourceDto {
  retirementSavings: number;
  socialSecurityBenefit: number;
  pension: number;
  colaRate: number;
}

export interface IBambuApiLibraryCalculateRetirementGoalAmountRequestDto {
  annualRetirementIncome: number;
  age: number;
  retirementAge: number;
  gender: EnumBambuApiLibraryCalculateRetirementGoalAmountRequestGender;
  lifeExpectancyMale: number;
  lifeExpectancyFemale: number;
  annualisedSavingsAcctIntR: number;
  annualisedInflationRate: number;
  compoundsPerYear: number;
  period: EnumBambuApiLibraryCalculateRetirementGoalAmountRequestPeriod;
  country: string;
  additionalSource?: IBambuApiLibraryCalculateRetirementGoalAmountRequestAdditionalSourceDto;
  calculateTax?: boolean;
}

export interface IBambuApiLibraryCalculateHouseGoalAmountResponseDto {
  yearsToGoal: number;
  houseCostInflationAdj: number;
  currency: string;
  downPaymentAmt: number;
}
export interface IBambuApiLibraryCalculateHouseGoalAmountRequestDto {
  downPaymentYear: number;
  country: string;
  region: string;
  city: string;
  location: string;
  district: string;
  houseType: string;
  roomType: string;
  downPaymentPct: number;
  inflationRate: number;
  currentYear: number;
}

export abstract class BambuApiLibraryIntegrationDomainServiceBase {
  abstract GetProjection(
    requestId: string,
    input: IBambuApiLibraryGetProjectionsRequestDto,
    investorClaims: IServerCoreIamClaimsDto | null
  ): Promise<IBambuApiLibraryGetProjectionsResponseDto>;

  abstract GetCountries(
    requestId: string,
    investorClaims: IServerCoreIamClaimsDto,
    countryAlpha2Code: string | null
  ): Promise<IBambuApiLibraryGetCountriesResponseDto[]>;

  abstract GetCountryRates(
    requestId: string,
    investorClaims: IServerCoreIamClaimsDto,
    countryAlpha2Code: string | null
  ): Promise<IBambuApiLibraryGetCountryRatesResponseDto[]>;

  abstract GetHouseGoalAmount(
    requestId: string,
    input: IBambuApiLibraryCalculateHouseGoalAmountRequestDto,
    investorClaims: IServerCoreIamClaimsDto
  ): Promise<IBambuApiLibraryCalculateHouseGoalAmountResponseDto>;

  abstract CalculateUniversityGoalAmount(
    requestId: string,
    input: IBambuApiLibraryCalculateUniversityGoalAmountRequestDto,
    investorClaims: IServerCoreIamClaimsDto
  ): Promise<IBambuApiLibraryCalculateUniversityGoalAmountResponseDto>;

  abstract CalculateRetirementGoalAmount(
    requestId: string,
    input: IBambuApiLibraryCalculateRetirementGoalAmountRequestDto,
    investorClaims: IServerCoreIamClaimsDto
  ): Promise<IBambuApiLibraryCalculateRetirementGoalAmountResponseDto>;

  public abstract ShouldWeUseBambuMasterKeyForEverything(): boolean;

  abstract CalculateRiskScore(
    requestId: string,
    input: IBambuApiLibraryCalculateRiskPayloadDto,
    investorClaims: IServerCoreIamClaimsDto
  ): Promise<IBambuApiLibraryCalculateRiskScoreResponseDto>;
}
