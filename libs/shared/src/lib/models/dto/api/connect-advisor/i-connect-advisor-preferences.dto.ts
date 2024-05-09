export interface IConnectAdvisorPreferencesMutableDto {
  tenantId: string;
  userId: string;
  minimumAnnualIncomeThreshold: number | null;
  minimumRetirementSavingsThreshold: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface IConnectAdvisorPreferencesDto
  extends IConnectAdvisorPreferencesMutableDto {
  id: string;
}

export type IConnectAdvisorPreferencesReadApiDto = Pick<
  IConnectAdvisorPreferencesDto,
  | 'minimumAnnualIncomeThreshold'
  | 'minimumRetirementSavingsThreshold'
  | 'createdAt'
  | 'updatedAt'
>;

export type IConnectAdvisorPreferencesUpdateApiDto = Pick<
  IConnectAdvisorPreferencesDto,
  'minimumAnnualIncomeThreshold' | 'minimumRetirementSavingsThreshold'
>;
