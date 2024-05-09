export enum EnumBambuApiLibraryCalculateRetirementGoalAmountRequestGender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum EnumBambuApiLibraryCalculateRetirementGoalAmountRequestPeriod {
  BEGINNING = 'beg',
  END = 'end',
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
