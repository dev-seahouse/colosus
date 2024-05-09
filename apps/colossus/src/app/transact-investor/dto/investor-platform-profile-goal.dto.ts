// noinspection ES6PreferShortImport

import { GoalStatusEnum, IInvestorPlatformProfileGoalDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { GoalDetailedConnectPortfolioSummaryDto } from './goal-detailed-connect-portfolio-summary.dto';
import { GoalRecurringSavingsPlanDto } from './goal-recurring-savings-plan.dto';

export class InvestorPlatformProfileGoalDto
  implements IInvestorPlatformProfileGoalDto
{
  @ApiProperty({
    type: GoalRecurringSavingsPlanDto,
    isArray: true,
  })
  GoalRecurringSavingsPlans: GoalRecurringSavingsPlanDto[];

  @ApiProperty({
    type: 'object',
    nullable: true,
  })
  computedRiskProfile: Record<string, unknown>;

  @ApiProperty({
    type: 'string',
  })
  connectPortfolioSummaryId: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    type: 'string',
  })
  createdBy: string;

  @ApiProperty({
    type: 'object',
    nullable: true,
  })
  data: Record<string, unknown> | null = null;

  @ApiProperty({
    type: 'string',
  })
  goalDescription: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  goalEndDate: Date | null;

  @ApiProperty({
    type: 'string',
  })
  goalName: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  goalStartDate: Date | null;

  @ApiProperty({
    type: 'number',
  })
  goalTimeframe: number;

  @ApiProperty({
    type: 'number',
  })
  goalValue: number;

  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'number',
  })
  initialInvestment: number;

  @ApiProperty({
    type: 'string',
  })
  investorId: string;

  @ApiProperty({
    type: 'boolean',
  })
  sendLeadAppointmentEmail: boolean;

  @ApiProperty({
    type: 'boolean',
  })
  sendLeadGoalProjectionEmail: boolean;

  @ApiProperty({
    type: 'string',
    enum: GoalStatusEnum,
  })
  status: GoalStatusEnum;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;

  @ApiProperty({
    type: 'string',
  })
  updatedBy: string;

  @ApiProperty({
    type: GoalDetailedConnectPortfolioSummaryDto,
    nullable: true,
  })
  ConnectPortfolioSummary: GoalDetailedConnectPortfolioSummaryDto | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  portfolioValue?: number | null = null;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  portfolioValueCurrency?: string | null = null;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  portfolioValueDate?: string | null = null;
}
