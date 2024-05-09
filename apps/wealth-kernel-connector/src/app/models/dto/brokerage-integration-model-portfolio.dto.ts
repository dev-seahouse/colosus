import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class BrokerageIntegrationModelPortfolioComponentDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationModelPortfolioComponentDto
{
  @ApiProperty({
    example: 'GB00B4T0BW71',
    minLength: 1,
    type: 'string',
    description: 'ISIN for this model component.',
  })
  @IsString()
  @MinLength(1)
  isin: string;

  @ApiProperty({
    example: 0.5,
    type: 'number',
    format: 'float',
    description: 'Weight of this model component.',
    minimum: 0,
    maximum: 1,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  weight: number;
}

export class BrokerageIntegrationModelPortfolioDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationModelPortfolioDto
{
  @ApiProperty({
    type: BrokerageIntegrationModelPortfolioComponentDto,
    isArray: true,
    description: 'Model components, the sum of the weights will always be 1.',
  })
  @Type(() => BrokerageIntegrationModelPortfolioComponentDto)
  @ValidateNested({ each: true })
  @IsArray()
  components: BrokerageIntegrationModelPortfolioComponentDto[];

  @ApiProperty({
    example: 'Model portfolio description',
    minLength: 1,
    type: 'string',
    description: 'Description of this model portfolio.',
  })
  @IsString()
  @MinLength(1)
  description: string;

  @ApiProperty({
    example: 'mdl-1',
    minLength: 1,
    type: 'string',
    description: 'Unique identifier for this model portfolio.',
  })
  @IsString()
  @MinLength(1)
  id: string;

  @ApiProperty({
    example: 'Model portfolio name',
    minLength: 1,
    type: 'string',
    description: 'Name of this model portfolio.',
  })
  name: string;
}

export class BrokerageIntegrationModelPortfolioDtoListAllQueryParamsDto
  extends BrokerageIntegrationServerDto.BrokerageIntegrationListAllQueryParamsBaseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationModelPortfolioDtoListAllQueryParamsDto
{
  @ApiProperty({
    type: 'string',
    description: 'Client reference for this model portfolio.',
    required: false,
  })
  @IsOptional()
  @IsString()
  clientReference?: string;

  @ApiProperty({
    type: 'string',
    description: 'Model id for this model portfolio.',
    required: false,
  })
  @IsOptional()
  @IsString()
  modelId?: string;
}

export class BrokerageIntegrationModelPortfolioDtoListAllResponseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationModelPortfolioDtoListAllResponseDto
{
  @ApiProperty({
    type: 'string',
    description: 'Token for the next page of results.',
  })
  paginationToken: string | null;

  @ApiProperty({
    type: BrokerageIntegrationModelPortfolioDto,
    isArray: true,
    description: 'List of model portfolios.',
  })
  results: BrokerageIntegrationModelPortfolioDto[];
}
