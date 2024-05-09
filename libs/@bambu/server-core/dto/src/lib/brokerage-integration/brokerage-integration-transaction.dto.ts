import { ApiProperty } from '@nestjs/swagger';
import { BrokerageIntegrationTransactionPriceDto } from './brokerage-integration-transaction-price.dto';
import {
  BrokerageIntegrationTransactionStatusEnum,
  BrokerageIntegrationTransactionTypeEnum,
  IBrokerageIntegrationTransactionDto,
} from './i-brokerage-integration-transactions-list-all-query-params.dto';

export class BrokerageIntegrationTransactionDto
  implements IBrokerageIntegrationTransactionDto
{
  @ApiProperty({
    type: BrokerageIntegrationTransactionPriceDto,
    nullable: true,
  })
  bookCost: BrokerageIntegrationTransactionPriceDto | null = null;

  @ApiProperty({
    type: BrokerageIntegrationTransactionPriceDto,
  })
  charges: BrokerageIntegrationTransactionPriceDto;

  @ApiProperty({
    type: BrokerageIntegrationTransactionPriceDto,
  })
  consideration: BrokerageIntegrationTransactionPriceDto;

  @ApiProperty({
    type: 'string',
    format: 'date',
  })
  date: string;

  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    example: 'GB00B1XZS820',
  })
  isin: string;

  @ApiProperty({
    type: 'string',
  })
  portfolioId: string;

  @ApiProperty({
    type: BrokerageIntegrationTransactionPriceDto,
  })
  price: BrokerageIntegrationTransactionPriceDto;

  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  quantity: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
  })
  settledOn: string;

  @ApiProperty({
    enum: BrokerageIntegrationTransactionStatusEnum,
    type: 'string',
    example: BrokerageIntegrationTransactionStatusEnum.MATCHED,
  })
  status: BrokerageIntegrationTransactionStatusEnum;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  timestamp: string | Date;

  @ApiProperty({
    enum: BrokerageIntegrationTransactionTypeEnum,
    type: 'string',
    example: BrokerageIntegrationTransactionTypeEnum.BUY,
  })
  type: BrokerageIntegrationTransactionTypeEnum;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: string | Date;
}
