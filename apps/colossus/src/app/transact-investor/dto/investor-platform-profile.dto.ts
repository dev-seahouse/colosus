import { IInvestorPlatformProfileDto, InvestorTypeEnum } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { InvestorPlatformProfileGoalDto } from './investor-platform-profile-goal.dto';
import { InvestorPlatformProfileInvestmentPlatformUsersDto } from './investor-platform-profile-investment-platform-users.dto';

export class InvestorPlatformProfileDto implements IInvestorPlatformProfileDto {
  @ApiProperty({
    type: InvestorPlatformProfileGoalDto,
    isArray: true,
  })
  Goals: InvestorPlatformProfileGoalDto[];

  @ApiProperty({
    type: InvestorPlatformProfileInvestmentPlatformUsersDto,
    isArray: true,
  })
  InvestorPlatformUsers: InvestorPlatformProfileInvestmentPlatformUsersDto[];

  @ApiProperty({
    type: 'number',
  })
  age: number;

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
    type: 'number',
    nullable: true,
  })
  currentSavings: number | null;

  @ApiProperty({
    type: 'object',
    nullable: true,
  })
  data: Record<string, unknown> | null;

  @ApiProperty({
    type: 'string',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  incomePerAnnum: number | null;

  @ApiProperty({
    type: 'boolean',
  })
  isEmployed: boolean;

  @ApiProperty({
    type: 'boolean',
  })
  isRetired: boolean;

  @ApiProperty({
    type: 'string',
  })
  leadReviewStatus: string;

  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  monthlySavings: number | null;

  @ApiProperty({
    type: 'string',
  })
  name: string;

  @ApiProperty({
    type: 'string',
  })
  phoneNumber: string;

  @ApiProperty({
    type: 'string',
  })
  tenantId: string;

  @ApiProperty({
    type: 'string',
    enum: InvestorTypeEnum,
  })
  type: InvestorTypeEnum;

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
    type: 'string',
    nullable: true,
  })
  zipCode: string | null;
}
