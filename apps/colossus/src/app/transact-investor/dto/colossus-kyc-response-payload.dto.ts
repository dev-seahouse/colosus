import {
  BrokerageIntegrationServerDto,
  InvestorKycDto,
} from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  ColossusKycRequestPayloadAccountDto,
  ColossusKycRequestPayloadAddressDto,
  ColossusKycRequestPayloadPartyDto,
  ColossusKycRequestPayloadPartyIdentifierDto,
} from './colossus-kyc-request-payload.dto';

/**
 * I really shouldn't inherit dto like this but no time :(
 *
 * Sorry to the guy who needs to work on this in the future.
 */

export class ColossusKycResponsePayloadAccountDto
  extends ColossusKycRequestPayloadAccountDto
  implements BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto
{
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  addedAt: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  clientReference?: string | null = null;

  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  name: string;

  @ApiProperty({
    type: 'string',
  })
  owner: string;

  @ApiProperty({
    type: 'string',
    enum: BrokerageIntegrationServerDto.AccountStatusEnum,
  })
  status: BrokerageIntegrationServerDto.AccountStatusEnum;
}

export class ColossusKycResponsePayloadAddressDto
  extends ColossusKycRequestPayloadAddressDto
  implements BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto
{
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  addedAt: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  clientReference: string | null = null;

  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  partyId: string;
}

export class ColossusKycResponsePayloadPartyIdentifierDto
  extends ColossusKycRequestPayloadPartyIdentifierDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationPartyIdentifierDto
{
  @ApiProperty({
    type: 'string',
  })
  id: string;
}

export class ColossusKycResponsePayloadPartyDto
  extends ColossusKycRequestPayloadPartyDto
  implements BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto
{
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  addedAt: string;

  @ApiProperty({
    type: 'string',
  })
  clientReference: string;

  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  tenantId: string;

  @ApiProperty({
    type: 'number',
  })
  version: number;

  @ApiProperty({
    type: ColossusKycResponsePayloadPartyIdentifierDto,
    isArray: true,
  })
  identifiers: ColossusKycResponsePayloadPartyIdentifierDto[];
}

export class ColossusKycResponsePayloadDto
  implements InvestorKycDto.IColossusKycResponsePayloadDto
{
  @ApiProperty({
    type: ColossusKycResponsePayloadAccountDto,
    isArray: true,
  })
  accounts: ColossusKycResponsePayloadAccountDto[];

  @ApiProperty({
    type: ColossusKycResponsePayloadAddressDto,
    isArray: true,
  })
  addresses: ColossusKycResponsePayloadAddressDto[];

  @ApiProperty({
    type: ColossusKycResponsePayloadPartyDto,
  })
  party: ColossusKycResponsePayloadPartyDto;
}
