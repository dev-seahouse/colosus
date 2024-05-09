import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';

export class BrokerageIntegrationListAllPerformanceQueryParamsDto
  extends BrokerageIntegrationServerDto.BrokerageIntegrationListAllQueryParamsBaseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPerformanceQueryParamsDto
{
  @ApiProperty({
    type: 'boolean',
    required: false,
    description:
      'When set to true, performance will be aggregated into a single interval per portfolio.',
  })
  aggregate?: boolean;

  @ApiProperty({
    format: 'date',
    type: 'string',
    required: false,
    description: 'Filter for performance ending on or before this date.',
  })
  endDate?: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 50,
    type: 'string',
    required: false,
    description: 'Unique identifier of the portfolio to filter by.',
  })
  portfolioId?: string;

  @ApiProperty({
    format: 'date',
    type: 'string',
    required: false,
    description: 'Filter for performance ending on or after this date.',
  })
  startDate?: string;

  @ApiProperty({
    format: 'date',
    type: 'string',
    required: false,
    description: 'Updated since date to filter from.',
  })
  updatedSince?: string;
}
