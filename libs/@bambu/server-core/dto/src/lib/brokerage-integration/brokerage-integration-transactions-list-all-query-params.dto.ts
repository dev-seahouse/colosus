import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { BrokerageIntegrationListAllQueryParamsBaseDto } from './brokerage-integration-list-all-query-params-base.dto';
import {
  BrokerageIntegrationTransactionStatusEnum,
  BrokerageIntegrationTransactionTypeEnum,
  IBrokerageIntegrationTransactionsListAllQueryParamsDto,
} from './i-brokerage-integration-transactions-list-all-query-params.dto';

export class BrokerageIntegrationTransactionsListAllQueryParamsDto
  extends BrokerageIntegrationListAllQueryParamsBaseDto
  implements IBrokerageIntegrationTransactionsListAllQueryParamsDto
{
  @ApiProperty({
    type: 'string',
    format: 'date',
    required: false,
  })
  @IsString()
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    required: false,
    type: 'string',
  })
  @IsString()
  @IsOptional()
  isin?: string;

  @ApiProperty({
    required: false,
    type: 'string',
  })
  @IsString()
  @IsOptional()
  portfolioId?: string;

  @ApiProperty({
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsString()
  @IsDateString()
  @IsOptional()
  settledOn?: string;

  @ApiProperty({
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsString()
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    required: false,
    type: 'string',
    enum: BrokerageIntegrationTransactionStatusEnum,
  })
  @IsOptional()
  @IsEnum(BrokerageIntegrationTransactionStatusEnum)
  status?: BrokerageIntegrationTransactionStatusEnum;

  @ApiProperty({
    required: false,
    type: 'string',
    enum: BrokerageIntegrationTransactionTypeEnum,
  })
  @IsOptional()
  @IsEnum(BrokerageIntegrationTransactionTypeEnum)
  type?: BrokerageIntegrationTransactionTypeEnum;

  @ApiProperty({
    required: false,
    type: 'string',
    format: 'date-time',
  })
  @IsString()
  @IsOptional()
  updatedSince?: string;
}
