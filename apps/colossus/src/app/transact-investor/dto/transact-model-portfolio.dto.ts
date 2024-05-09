import { ITransactModelPortfolioDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';

export class TransactModelPortfolioDto implements ITransactModelPortfolioDto {
  @ApiProperty({
    type: 'string',
  })
  connectPortfolioSummaryId: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt?: Date | string;

  @ApiProperty({
    type: 'string',
  })
  createdBy?: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  description?: string | null = null;

  @ApiProperty({
    type: 'number',
    nullable: true,
    format: 'double',
  })
  expectedAnnualReturn?: number | null = null;

  @ApiProperty({
    type: 'number',
    nullable: true,
    format: 'double',
  })
  expectedAnnualVolatility?: number | null = null;

  @ApiProperty({
    type: 'string',
    format: 'uri',
    nullable: true,
  })
  factSheetUrl?: string | null = null;

  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  name?: string | null = null;

  @ApiProperty({
    type: 'string',
    nullable: true,
    required: false,
  })
  partnerModelId?: string | null = null;

  @ApiProperty({
    type: 'number',
    nullable: true,
    format: 'double',
  })
  rebalancingThreshold?: number | null = null;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt?: Date | string;

  @ApiProperty({
    type: 'string',
  })
  updatedBy?: string;
}
