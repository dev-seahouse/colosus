import { LeadsEnums } from '../../../../enums';

export interface IConnectLeadsProjectedReturnsDto {
  target: number;
  low: number;
  high: number;
}

export interface IConnectLeadsItemDto {
  name: string;
  email: string;
  phoneNumber?: string | null;
  zipCode?: string | null;
  age: number;
  incomePerAnnum?: number | null;
  currentSavings?: number | null;
  isRetired: boolean;
  goalDescription: string;
  goalName: string;
  goalValue: number;
  goalTimeframe: number;
  riskAppetite: string;
  notes?: string;
  initialInvestment: number;
  monthlyContribution: number;
  projectedReturns: IConnectLeadsProjectedReturnsDto;
  computedRiskProfile?: Record<string, unknown> | null;
  sendGoalProjectionEmail: boolean;
  sendAppointmentEmail: boolean;
  status?: LeadsEnums.EnumLeadStatus;
  monthlySavings: number | null;
  recommendedMonthlyContribution?: number;
  riskProfileComplaince?: Record<string, unknown>;
}

export interface IConnectLeadsAdvisorDto
  extends Omit<IConnectLeadsItemDto, 'status'> {
  id: string;
  tenantId: string;
  status: LeadsEnums.EnumLeadStatus;
  createdBy: string;
  createdAt: string | Date;
  updatedBy: string;
  updatedAt: string | Date;
}

export interface IConnectLeadAdvisorUpdateApiDto {
  status: LeadsEnums.EnumLeadStatus;
}

export interface IConnectLeadsAdvisorUpdateDto
  extends IConnectLeadAdvisorUpdateApiDto {
  id: string;
  timeStamp: Date;
  tenantId: string;
  userId: string;
}

export interface IConnectLeadsDto {
  data?: IConnectLeadsAdvisorDto[];
  pageCount?: number;
  filteredCount?: number;
  allTotalCount?: number;
  transactTotalCount?: number;
  qualifiedTotalCount?: number;
}
