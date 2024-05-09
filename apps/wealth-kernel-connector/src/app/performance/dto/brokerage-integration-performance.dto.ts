import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';

export class BrokerageIntegrationPerformanceDto
  implements BrokerageIntegrationServerDto.IBrokerageIntegrationPerformanceDto
{
  @ApiProperty({
    type: 'number',
    format: 'double',
    required: true,
  })
  accruedFees: number;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: true,
  })
  calculatedAt: string;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  currency: string;

  @ApiProperty({
    type: 'string',
    format: 'date',
    required: true,
  })
  endDate: string;

  @ApiProperty({
    type: 'number',
    format: 'double',
    required: true,
  })
  endValue: number;

  @ApiProperty({
    type: 'number',
    format: 'double',
    required: true,
  })
  grossPerformance: number;

  @ApiProperty({
    type: 'number',
    format: 'double',
    required: true,
  })
  netPerformance: number;
  portfolioId: string;

  @ApiProperty({
    type: 'string',
    format: 'date',
    required: true,
  })
  startDate: string;

  @ApiProperty({
    type: 'number',
    format: 'double',
    required: true,
  })
  startValue: number;
}
