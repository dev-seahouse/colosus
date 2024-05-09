import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { BrokerageIntegrationPartyDto } from './brokerage-integration-party.dto';
import { IBrokerageIntegrationListAllPartiesResponseDto } from './i-brokerage-integration-party.dto';

export class BrokerageIntegrationListAllPartiesResponseDto
  implements IBrokerageIntegrationListAllPartiesResponseDto
{
  @ApiProperty({
    description:
      'Pagination token for the next page of results. This is to be used in the "after" query string parameter, if present.',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  paginationToken: string | null;

  @ApiProperty({
    type: BrokerageIntegrationPartyDto,
    isArray: true,
    required: true,
    description: 'List of parties.',
  })
  @IsArray()
  results: BrokerageIntegrationPartyDto[];
}
