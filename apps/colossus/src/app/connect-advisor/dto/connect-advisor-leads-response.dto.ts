import { ConnectLeadsDto, SharedEnums } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class ConnectAdvisorLeadsProjectedReturnsDto
  implements ConnectLeadsDto.IConnectLeadsProjectedReturnsDto
{
  @ApiProperty({
    type: 'number',
    description: 'Pessimistic projected return',
    required: true,
  })
  low: number;

  @ApiProperty({
    type: 'number',
    description: 'Realistic projected return',
    required: true,
  })
  target: number;

  @ApiProperty({
    type: 'number',
    description: 'Optimistic projected return',
    required: true,
  })
  high: number;
}

export class ConnectAdvisorLeadsResponseItemDto
  implements ConnectLeadsDto.IConnectLeadsAdvisorDto
{
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: 'd287ada9-5025-41f3-a6de-4ce529afee6b',
    description: 'The ID of a lead.',
    required: true,
  })
  id: string;

  @ApiProperty({
    type: 'string',
    example: 'John Smith',
    description: 'The name of the lead.',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    example: 'john.smith@gmail.com',
    description: 'The email of the lead.',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    example: '+14034445667',
    description: 'The phone number of the lead.',
    required: true,
  })
  @IsString()
  phoneNumber?: string | null;

  @ApiProperty({
    type: 'string',
    example: '94040',
    description: 'The phone number of the lead.',
    required: true,
  })
  @IsString()
  @IsOptional()
  zipCode?: string | null;

  @ApiProperty({
    type: 'number',
    example: '32',
    description: 'The age of the lead.',
    required: true,
  })
  @IsNumber()
  age: number;

  @ApiProperty({
    type: 'number',
    description: 'The income per annum of the lead. This may be zero.',
    required: true,
  })
  incomePerAnnum?: number | null;

  @ApiProperty({
    type: 'number',
    description: 'The current savings of the lead. This may be zero.',
    required: true,
  })
  currentSavings?: number | null;

  @ApiProperty({
    type: 'boolean',
    example: true,
    description: 'If the lead is retired.',
    required: true,
  })
  isRetired: boolean;

  @ApiProperty({
    type: 'string',
    example: 'Retire comfortably',
    description: 'A description for the goal.',
    required: true,
  })
  goalDescription: string;

  @ApiProperty({
    type: 'string',
    example: 'Retirement',
    description: 'The name of the goal.',
    required: true,
  })
  goalName: string;

  @ApiProperty({
    type: 'number',
    description: 'The target value of the goal.',
    required: true,
  })
  goalValue: number;

  @ApiProperty({
    type: 'number',
    description: 'The timeframe through which the goal is achieved.',
    required: true,
  })
  goalTimeframe: number;

  @ApiProperty({
    type: 'string',
    example: 'd287ada9-5025-41f3-a6de-4ce529afee6b',
    description: 'The ID of a ConnectPortfolioSummary item.',
    required: true,
  })
  riskAppetite: string;

  @ApiProperty({
    type: 'string',
    example: '94040',
    description: 'Additional notes about the lead.',
    required: true,
  })
  @IsString()
  notes?: string;

  @ApiProperty({
    type: 'number',
    description: 'Initial investment made to the goal',
    required: true,
  })
  initialInvestment: number;

  @ApiProperty({
    type: 'number',
    description: 'Contribution made to the goal every month',
    required: true,
  })
  monthlyContribution: number;

  @ApiProperty({
    type: 'boolean',
    description:
      'Whether the user was sent an email to schedule or await an appointment',
    required: true,
  })
  sendAppointmentEmail: boolean;

  @ApiProperty({
    type: 'boolean',
    description:
      'Whether the user has opted in to receive email containing their goal projection',
    required: true,
  })
  sendGoalProjectionEmail: boolean;

  @ApiProperty({
    type: [ConnectAdvisorLeadsProjectedReturnsDto],
    description:
      'Calculated projected returns for the goal based on the user input',
    required: true,
  })
  projectedReturns: ConnectAdvisorLeadsProjectedReturnsDto;

  @ApiProperty({
    type: 'string',
    enum: SharedEnums.LeadsEnums.EnumLeadStatus,
    example: SharedEnums.LeadsEnums.EnumLeadStatus.NEW,
    description: 'The status of the lead.',
    required: true,
  })
  status: SharedEnums.LeadsEnums.EnumLeadStatus;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: true,
    description: 'The date and time the lead was created.',
    example: '2020-01-01T00:00:00.000Z',
  })
  createdAt: string | Date;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'The user who created the lead.',
  })
  createdBy: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: true,
    description: `The date and time the lead was last updated.`,
    example: '2020-01-01T00:00:00.000Z',
  })
  updatedAt: string | Date;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'The user who last updated the lead.',
  })
  updatedBy: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: 'd287ada9-5025-41f3-a6de-4ce529afee6b',
    description: `The ID of the tenant.`,
    required: true,
  })
  tenantId: string;

  @ApiProperty({
    type: 'number',
    example: 93949.67,
    required: false,
    description: 'The monthly savings.',
  })
  monthlySavings: number | null = null;
}

export class ConnectAdvisorLeadsResponseDto
  implements ConnectLeadsDto.IConnectLeadsDto
{
  @ApiProperty({
    type: ConnectAdvisorLeadsResponseItemDto,
    isArray: true,
    description: 'The name of the lead.',
    required: true,
  })
  @IsString()
  data?: ConnectAdvisorLeadsResponseItemDto[];

  @ApiProperty({
    type: 'number',
    example: '2',
    description: 'The current total number of pages.',
    required: true,
  })
  @IsString()
  pageCount: number;

  @ApiProperty({
    type: 'number',
    example: '421',
    description: 'The current total number of leads.',
    required: true,
  })
  @IsString()
  filteredCount: number;

  @ApiProperty({
    type: 'number',
    example: '421',
    description: 'The total number of leads.',
    required: true,
  })
  @IsString()
  allTotalCount?: number;

  @ApiProperty({
    type: 'number',
    example: '421',
    description:
      'The total number of qualified leads (i.e. passing the income / savings thresholds).',
    required: true,
  })
  @IsString()
  qualifiedTotalCount?: number;

  @ApiProperty({
    type: 'number',
    example: '421',
    description:
      'The total number of unqualified leads (i.e. failing the income / savings thresholds) interested in transact.',
    required: true,
  })
  @IsString()
  transactTotalCount?: number;
}
