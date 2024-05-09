import { ConnectLeadsDto, SharedEnums } from '@bambu/shared';

export class LeadMutable
  implements Omit<ConnectLeadsDto.IConnectLeadsItemDto, 'projectedReturns'>
{
  age: number;
  currentSavings?: number | null;
  email: string;
  goalDescription: string;
  goalName: string;
  goalTimeframe: number;
  goalValue: number;
  incomePerAnnum?: number | null;
  initialInvestment: number;
  isRetired: boolean;
  monthlyContribution: number;
  name: string;
  notes?: string;
  phoneNumber?: string | null;
  riskAppetite: string;
  sendGoalProjectionEmail: boolean;
  sendAppointmentEmail: boolean;
  zipCode?: string | null;
  projectedReturns: Record<string, unknown>;
  computedRiskProfile?: Record<string, unknown> | null;
  status?: SharedEnums.LeadsEnums.EnumLeadStatus;
  monthlySavings: number | null = null;
}

export class Lead
  implements Omit<ConnectLeadsDto.IConnectLeadsAdvisorDto, 'projectedReturns'>
{
  age: number;
  createdAt: string | Date;
  createdBy: string;
  currentSavings: number | null;
  email: string;
  goalDescription: string;
  goalName: string;
  goalTimeframe: number;
  goalValue: number;
  id: string;
  incomePerAnnum: number | null;
  initialInvestment: number;
  isRetired: boolean;
  monthlyContribution: number;
  name: string;
  notes: string;
  phoneNumber: string;
  riskAppetite: string;
  sendGoalProjectionEmail: boolean;
  sendAppointmentEmail: boolean;
  status: SharedEnums.LeadsEnums.EnumLeadStatus;
  tenantId: string;
  updatedAt: string | Date;
  updatedBy: string;
  zipCode?: string;
  projectedReturns: Record<string, unknown>;
  monthlySavings: number | null = null;
}
