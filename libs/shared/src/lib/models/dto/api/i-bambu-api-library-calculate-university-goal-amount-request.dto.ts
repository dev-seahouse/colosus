export enum EnumBambuApiLibraryCalculateUniversityGoalAmountRequestSpecialisation {
  GENERAL = 'General',
  MEDICINE = 'Medicine',
}

export enum EnumBambuApiLibraryCalculateUniversityGoalAmountRequestUniversityType {
  PUBLIC = 'Public',
  Private = 'Private',
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
