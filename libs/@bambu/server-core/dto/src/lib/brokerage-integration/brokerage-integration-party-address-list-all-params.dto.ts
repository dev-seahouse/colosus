import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BrokerageIntegrationListAllQueryParamsBaseDto } from './brokerage-integration-list-all-query-params-base.dto';
import { IBrokerageIntegrationPartyAddressListAllParamsDto } from './i-brokerage-integration-party-address.dto';

export class BrokerageIntegrationPartyAddressListAllParamsDto
  extends BrokerageIntegrationListAllQueryParamsBaseDto
  implements IBrokerageIntegrationPartyAddressListAllParamsDto
{
  @ApiPropertyOptional({
    type: 'string',
    description: 'Unique identifier of the party to filter by.',
  })
  @IsOptional()
  @IsString()
  partyId?: string;
}
