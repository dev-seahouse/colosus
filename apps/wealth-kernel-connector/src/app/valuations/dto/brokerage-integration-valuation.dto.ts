import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CashValuationDto
  implements BrokerageIntegrationServerDto.ICashValuationDto
{
  @ApiProperty({
    example: 'GBP',
    minLength: 3,
    maxLength: 3,
    pattern: '^[A-Z]',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  @Matches(/^[A-Z]{3}$/, {
    message:
      'Currency must be a valid ISO 4217 code consisting of exactly 3 uppercase letters',
  })
  currency: string;

  @ApiProperty({
    type: BrokerageIntegrationServerDto.BrokerageIntegrationMoneyDto,
  })
  @ValidateNested()
  @Type(() => BrokerageIntegrationServerDto.BrokerageIntegrationMoneyDto)
  value: BrokerageIntegrationServerDto.BrokerageIntegrationMoneyDto;

  @ApiProperty({
    type: BrokerageIntegrationServerDto.BrokerageIntegrationMoneyDto,
  })
  @ValidateNested()
  @Type(() => BrokerageIntegrationServerDto.BrokerageIntegrationMoneyDto)
  amount: BrokerageIntegrationServerDto.BrokerageIntegrationMoneyDto;

  @ApiProperty({ example: 1 })
  @IsNumber()
  fxRate: number;
}

export class HoldingValuationDto
  implements BrokerageIntegrationServerDto.IHoldingValuationDto
{
  @ApiProperty({ example: 'GB0030029069' })
  @IsString()
  @IsNotEmpty()
  isin: string;

  @ApiProperty({ example: 91.216 })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    type: BrokerageIntegrationServerDto.BrokerageIntegrationMoneyDto,
  })
  @ValidateNested()
  @Type(() => BrokerageIntegrationServerDto.BrokerageIntegrationMoneyDto)
  price: BrokerageIntegrationServerDto.BrokerageIntegrationMoneyDto;

  @ApiProperty({
    type: BrokerageIntegrationServerDto.BrokerageIntegrationMoneyDto,
  })
  @ValidateNested()
  @Type(() => BrokerageIntegrationServerDto.BrokerageIntegrationMoneyDto)
  value: BrokerageIntegrationServerDto.BrokerageIntegrationMoneyDto;

  @ApiProperty({ example: 1 })
  @IsNumber()
  fxRate: number;
}

export class BrokerageIntegrationValuationDto
  implements BrokerageIntegrationServerDto.IBrokerageIntegrationValuationDto
{
  @ApiProperty({ example: 'prt-32q2deogu225ps', minLength: 1, maxLength: 50 })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  portfolioId: string;

  @ApiProperty({ example: '2019-10-08', format: 'date' })
  @IsDateString()
  date: string;

  @ApiProperty({
    type: BrokerageIntegrationServerDto.BrokerageIntegrationMoneyDto,
  })
  @ValidateNested()
  @Type(() => BrokerageIntegrationServerDto.BrokerageIntegrationMoneyDto)
  value: BrokerageIntegrationServerDto.BrokerageIntegrationMoneyDto;

  @ApiProperty({ type: [CashValuationDto], uniqueItems: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CashValuationDto)
  cash: CashValuationDto[];

  @ApiProperty({ type: [HoldingValuationDto], uniqueItems: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HoldingValuationDto)
  holdings: HoldingValuationDto[];

  @ApiProperty({ example: '2019-10-08T13:55:4237925Z', format: 'date-time' })
  @IsDateString()
  changedAt: string;
}

export class BrokerageIntegrationValuationListAllQueryParamsDto
  extends BrokerageIntegrationServerDto.BrokerageIntegrationListAllQueryParamsBaseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationValuationListAllQueryParamsDto
{
  @ApiProperty({
    format: 'date',
    type: 'string',
    required: false,
    description: 'End date to query to.',
  })
  endDate?: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 50,
    type: 'string',
    required: false,
    description: 'Unique identifier of the portfolio to query.',
  })
  portfolioId?: string;

  @ApiProperty({
    format: 'date',
    type: 'string',
    required: false,
    description: 'Start date to query from.',
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

export class BrokerageIntegrationValuationListAllResponseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationValuationListAllResponseDto
{
  paginationToken: string | null;
  results: BrokerageIntegrationValuationDto[];
}
