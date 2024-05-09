export enum BambuApiLibraryGetProjectionsResponseHealthCheckStatus {
  SHORTFALL = 'SHORTFALL',
  SURPLUS = 'SURPLUS',
}

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
