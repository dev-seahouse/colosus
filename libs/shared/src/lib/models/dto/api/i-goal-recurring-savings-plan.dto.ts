export enum GoalRecurringSavingsPlanFrequencyEnum {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY', // This is the default
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export enum GoalRecurringSavingsPlanStatusEnum {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
}

export interface IGoalRecurringSavingsPlanMutableDto {
  amount: number;
  currency: string;
  frequency: GoalRecurringSavingsPlanFrequencyEnum;
  status: GoalRecurringSavingsPlanStatusEnum;
  data: Record<string, unknown> | null;
  goalId: string;
}

export interface IGoalRecurringSavingsPlanDto
  extends IGoalRecurringSavingsPlanMutableDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
