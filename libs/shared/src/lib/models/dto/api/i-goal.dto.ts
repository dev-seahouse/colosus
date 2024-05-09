export enum GoalStatusEnum {
  PENDING = 'PENDING',
  CREATED = 'CREATED',
  ACTIVE = 'ACTIVE',
  CLOSING = 'CLOSING',
  CLOSED = 'CLOSED',
}

export interface IGoalMutableDto {
  goalName: string;
  goalDescription: string;
  goalValue: number;
  goalTimeframe: number;
  initialInvestment: number;
  goalStartDate: Date | null;
  goalEndDate: Date | null;
  status: GoalStatusEnum;
  computedRiskProfile: Record<string, unknown>;
  sendLeadAppointmentEmail: boolean;
  sendLeadGoalProjectionEmail: boolean;
  investorId: string;
  connectPortfolioSummaryId: string;
  recommendedMonthlyContribution?: number;
  data: Record<string, unknown> | null;
}

export interface IGoalDto extends IGoalMutableDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
