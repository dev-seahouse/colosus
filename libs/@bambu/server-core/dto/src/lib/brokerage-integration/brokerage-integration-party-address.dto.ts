import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, Length } from 'class-validator';
import { BrokerageIntegrationPartyAddressCreationDto } from './brokerage-integration-party-address-creation.dto';
import { IBrokerageIntegrationPartyAddressCreationDto } from './i-brokerage-integration-party-address.dto';

export class BrokerageIntegrationPartyAddressDto
  extends BrokerageIntegrationPartyAddressCreationDto
  implements IBrokerageIntegrationPartyAddressCreationDto
{
  @ApiProperty({
    description: 'Unique identifier of the address.',
    minLength: 1,
  })
  @IsString()
  @Length(1, 50) // Adjust length according to your requirements
  id: string;

  @ApiProperty({
    description: 'The date and time the address was added.',
    format: 'date-time',
  })
  @IsDateString()
  addedAt: string;
}
