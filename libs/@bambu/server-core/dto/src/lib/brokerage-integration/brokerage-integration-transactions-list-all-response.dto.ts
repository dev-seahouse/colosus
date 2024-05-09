import { ApiProperty } from '@nestjs/swagger';
import { BrokerageIntegrationTransactionDto } from './brokerage-integration-transaction.dto';
import { IBrokerageIntegrationTransactionsListAllResponseDto } from './i-brokerage-integration-transactions-list-all-query-params.dto';

export class BrokerageIntegrationTransactionsListAllResponseDto
  implements IBrokerageIntegrationTransactionsListAllResponseDto
{
  @ApiProperty({
    type: 'string',
    description: 'Token for the next page of results.',
    nullable: true,
  })
  paginationToken: string | null = null;

  @ApiProperty({
    type: BrokerageIntegrationTransactionDto,
  })
  results: BrokerageIntegrationTransactionDto[];
}
