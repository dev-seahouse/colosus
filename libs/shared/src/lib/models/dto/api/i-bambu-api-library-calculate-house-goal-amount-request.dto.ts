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
