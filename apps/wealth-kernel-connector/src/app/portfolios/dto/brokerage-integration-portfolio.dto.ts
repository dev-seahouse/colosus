import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class MandateDto implements BrokerageIntegrationServerDto.IMandateDto {
  @ApiProperty({
    description: 'ISIN of the single product mandate',
    example: 'US0378331005',
    required: false,
  })
  @IsString()
  @IsOptional()
  isin?: string = undefined;

  @ApiProperty({
    description: 'ID of the Model to use for the mandate',
    example: 'mdl-1',
    required: false,
  })
  @IsString()
  @IsOptional()
  modelId?: string = undefined;

  @ApiProperty({
    example:
      BrokerageIntegrationServerDto.MandateTypeEnum.DISCRETIONARY_MANDATE,
  })
  @IsEnum(BrokerageIntegrationServerDto.MandateTypeEnum)
  type: string;
}

export class BrokerageIntegrationPortfolioMutableDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioMutableDto
{
  @ApiProperty({ description: 'Client reference', example: '12345' })
  @IsString()
  clientReference: string;

  @ApiProperty({
    description: 'Name of the portfolio',
    example: 'My Portfolio',
  })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Account ID', example: 'acc12345' })
  @IsString()
  accountId: string;

  @ApiProperty({ description: 'Currency of the portfolio', example: 'USD' })
  @IsString()
  @Length(3, 3)
  currency: string;

  @ApiProperty({ description: 'Mandate of the portfolio', type: MandateDto })
  @ValidateNested()
  @Type(() => MandateDto)
  mandate: MandateDto;
}

export class BrokerageIntegrationPortfolioDto
  extends BrokerageIntegrationPortfolioMutableDto
  implements BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto
{
  @ApiProperty({
    description: 'Unique identifier of the portfolio',
    example: 'portfolio12345',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Creation date of the portfolio',
    example: '2023-01-01T00:00:00Z',
  })
  @IsDateString()
  createdAt: string;

  @ApiProperty({
    description: 'Status of the portfolio',
    enum: BrokerageIntegrationServerDto.PortfolioStatusEnum,
  })
  @IsEnum(BrokerageIntegrationServerDto.PortfolioStatusEnum)
  status: BrokerageIntegrationServerDto.PortfolioStatusEnum;

  // @ValidateNested()
  // @Type(() => BrokerageIntegrationPortfolioMutableDto)
  // @ApiProperty({ type: BrokerageIntegrationPortfolioMutableDto })
  // data: BrokerageIntegrationPortfolioMutableDto;
}

export class BrokerageIntegrationListAllPortfoliosQueryParamsDto
  extends BrokerageIntegrationServerDto.BrokerageIntegrationListAllQueryParamsBaseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPortfoliosQueryParamsDto
{
  @ApiProperty({
    description: 'Account ID to filter by.',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  accountId?: string;

  @ApiProperty({
    description: 'Client reference to filter by.',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  clientReference?: string;

  @ApiProperty({
    description: 'Currency to filter by.',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @ApiProperty({
    description: 'Portfolio status to filter by.',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;
}

export class BrokerageIntegrationListAllPortfoliosResponseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPortfoliosResponseDto
{
  paginationToken: string | null;
  results: BrokerageIntegrationPortfolioDto[];
}
