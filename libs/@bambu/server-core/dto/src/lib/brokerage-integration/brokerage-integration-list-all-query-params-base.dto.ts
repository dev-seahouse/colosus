import { IBrokerageIntegrationListAllQueryParamsBaseDto } from '@bambu/shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class BrokerageIntegrationListAllQueryParamsBaseDto
  implements IBrokerageIntegrationListAllQueryParamsBaseDto
{
  @ApiPropertyOptional({
    type: 'string',
    description: 'A token for the position to offset from.',
  })
  @IsString()
  @IsOptional()
  after?: string;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @ApiProperty({
    type: 'number',
    description: 'The maximum number of resources to return.',
    default: 20,
    minimum: 1,
    maximum: 1000,
  })
  @IsInt()
  @Min(1)
  @Max(1000)
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  limit: number = 20;
}
