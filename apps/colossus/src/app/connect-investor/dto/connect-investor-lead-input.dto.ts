import { ConnectLeadsDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class ConnectLeadsInputProjectedReturnsDto
  implements ConnectLeadsDto.IConnectLeadsProjectedReturnsDto
{
  @ApiProperty({
    type: 'number',
    format: 'float',
    description: 'The high projected returns.',
    example: 9394967,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  high: number;

  @ApiProperty({
    type: 'number',
    format: 'float',
    example: 967,
    description: 'The low projected returns.',
  })
  @IsNumber()
  @IsNotEmpty()
  low: number;

  @ApiProperty({
    type: 'number',
    format: 'float',
    example: 967,
    description: 'The target projected returns.',
  })
  @IsNumber()
  @IsNotEmpty()
  target: number;
}

export class ConnectInvestorLeadInputDto
  implements ConnectLeadsDto.IConnectLeadsItemDto
{
  @ApiProperty({
    type: 'string',
    description: 'The name of the lead.',
    required: true,
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'email',
    description: 'The email of the lead.',
    required: true,
    example: 'john.doe@email.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'The phone number of the lead.',
    required: true,
    example: '1234567890',
  })
  @IsString()
  phoneNumber?: string | null;

  @ApiProperty({
    type: 'string',
    description: 'The zip code of the lead.',
    required: true,
    example: '12345',
  })
  @IsString()
  @IsOptional()
  zipCode?: string | null;

  @ApiProperty({
    type: 'number',
    description: 'The age.',
    required: true,
    example: 69,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    type: 'number',
    description: 'The income per annum of the lead. This may be zero.',
    required: true,
    example: 9394967,
  })
  incomePerAnnum?: number | null;

  @ApiProperty({
    type: 'number',
    description: 'The current savings of the lead. This may be zero.',
    required: true,
    example: 0,
  })
  currentSavings?: number | null;

  @ApiProperty({
    type: 'boolean',
    example: true,
    description: 'If the lead is retired.',
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isRetired: boolean;

  @ApiProperty({
    type: 'string',
    example: 'Retire comfortably',
    description: 'A description for the goal.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  goalDescription: string;

  @ApiProperty({
    type: 'string',
    example: 'Retirement',
    description: 'The name of the goal.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  goalName: string;

  @ApiProperty({
    type: 'number',
    description: 'The target value of the goal.',
    required: true,
    example: 9394967,
  })
  @IsNumber()
  @IsNotEmpty()
  goalValue: number;

  @ApiProperty({
    type: 'number',
    description: 'The timeframe through which the goal is achieved.',
    required: true,
    example: 67,
  })
  @IsNumber()
  @IsNotEmpty()
  goalTimeframe: number;

  @ApiProperty({
    type: 'string',
    example: 'd287ada9-5025-41f3-a6de-4ce529afee6b',
    description: 'The ID of a ConnectPortfolioSummary item.',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  riskAppetite: string;

  @ApiProperty({
    type: 'string',
    example: 'foo bar',
    description: 'Additional notes about the lead.',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    type: 'number',
    format: 'float',
    example: 10000,
    description: 'The initial investment.',
    required: true,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  initialInvestment: number;

  @ApiProperty({
    type: 'number',
    format: 'float',
    example: 0,
    required: true,
    description: 'The monthly contribution.',
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  monthlyContribution: number;

  @ApiProperty({
    type: 'number',
    format: 'float',
    example: 0,
    required: false,
    default: 0,
    description: 'The recommended monthly contribution.',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  recommendedMonthlyContribution?: number = 0;

  @ApiProperty({
    type: ConnectLeadsInputProjectedReturnsDto,
    description: 'The projected returns.',
    required: true,
  })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => ConnectLeadsInputProjectedReturnsDto)
  projectedReturns: ConnectLeadsInputProjectedReturnsDto;

  @ApiProperty({
    type: 'boolean',
    example: true,
    description:
      'If the lead should receive an email to schedule or await an appointment.',
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  sendAppointmentEmail: boolean;

  @ApiProperty({
    type: 'boolean',
    example: true,
    description: 'If the lead should receive a goal projection email.',
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  sendGoalProjectionEmail: boolean;

  @ApiProperty({
    type: 'number',
    example: 93949.67,
    required: false,
    description: 'The monthly savings.',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  monthlySavings: number | null = null;

  @ApiProperty({
    type: 'object',
    description: 'The computed risk profile.',
    required: false,
  })
  @IsObject()
  @IsOptional()
  computedRiskProfile?: Record<string, unknown> | null = null;

  @ApiProperty({
    type: 'object',
    description: 'Risk Profile questions and answers for complaince',
    required: false,
  })
  @IsObject()
  @IsOptional()
  riskProfileComplaince?: Record<string, unknown>;
}
