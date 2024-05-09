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
