import {
  GoalRecurringSavingsPlanFrequencyEnum,
  GoalRecurringSavingsPlanStatusEnum,
  IGoalRecurringSavingsPlanDto,
} from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';

export class GoalRecurringSavingsPlanDto
  implements IGoalRecurringSavingsPlanDto
{
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  amount: number;

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
    type: 'string',
  })
  currency: string;

  @ApiProperty({
    type: 'object',
    nullable: true,
  })
  data: Record<string, unknown> | null = null;

  @ApiProperty({
    type: 'string',
    enum: GoalRecurringSavingsPlanFrequencyEnum,
  })
  frequency: GoalRecurringSavingsPlanFrequencyEnum;

  @ApiProperty({
    type: 'string',
  })
  goalId: string;

  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    enum: GoalRecurringSavingsPlanStatusEnum,
  })
  status: GoalRecurringSavingsPlanStatusEnum;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;

  @ApiProperty({
    type: 'string',
  })
  updatedBy: string;
}
