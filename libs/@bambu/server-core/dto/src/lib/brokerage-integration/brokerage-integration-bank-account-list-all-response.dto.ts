import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { BrokerageIntegrationBankAccountDto } from './brokerage-integration-bank-account.dto';
import { IBrokerageIntegrationPartyBankAccountListAllResponseDto } from './i-brokerage-integration-party-bank-account-list-all-response.dto';

export class BrokerageIntegrationBankAccountListAllResponseDto
  implements IBrokerageIntegrationPartyBankAccountListAllResponseDto
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
    type: BrokerageIntegrationBankAccountDto,
    isArray: true,
    required: true,
    description: 'List of parties.',
  })
  @IsArray()
  results: BrokerageIntegrationBankAccountDto[];
}
