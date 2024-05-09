import { ApiProperty } from '@nestjs/swagger';
import { IBrokerageIntegrationTransactionPriceDto } from './i-brokerage-integration-transactions-list-all-query-params.dto';

export class BrokerageIntegrationTransactionPriceDto
  implements IBrokerageIntegrationTransactionPriceDto
{
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  amount: number;

  @ApiProperty({
    type: 'string',
    example: 'GBP',
  })
  currency: string;
}
