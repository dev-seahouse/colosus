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
