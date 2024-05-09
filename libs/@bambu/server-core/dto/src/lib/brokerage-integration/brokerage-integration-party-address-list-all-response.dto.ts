import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { BrokerageIntegrationPartyAddressDto } from './brokerage-integration-party-address.dto';
import { IBrokerageIntegrationPartyAddressListAllResponseDto } from './i-brokerage-integration-party-address.dto';

export class BrokerageIntegrationPartyAddressListAllResponseDto
  implements IBrokerageIntegrationPartyAddressListAllResponseDto
{
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  paginationToken: string | null;

  @ApiProperty({ type: BrokerageIntegrationPartyAddressDto, isArray: true })
  @IsArray()
  @Type(() => BrokerageIntegrationPartyAddressDto)
  results: BrokerageIntegrationPartyAddressDto[];
}
