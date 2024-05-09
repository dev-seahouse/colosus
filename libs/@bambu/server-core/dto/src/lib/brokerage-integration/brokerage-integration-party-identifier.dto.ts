import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import {
  IBrokerageIntegrationPartyIdentifierCreationDto,
  IBrokerageIntegrationPartyIdentifierDto,
} from './i-brokerage-integration-party.dto';

export class BrokerageIntegrationPartyIdentifierCreationDto
  implements IBrokerageIntegrationPartyIdentifierCreationDto
{
  @ApiProperty({ description: 'Type of the identifier.' })
  @IsString()
  @MinLength(1)
  type: string;

  @ApiProperty({ description: 'Value of the identifier.' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  value: string;

  @ApiProperty({ description: 'Issuer of the identifier.' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  issuer: string;
}

export class BrokerageIntegrationPartyIdentifierDto
  implements IBrokerageIntegrationPartyIdentifierDto
{
  @ApiProperty({ description: 'Unique identifier for the identifier.' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  id: string;

  @ApiProperty({ description: 'Type of the identifier.' })
  @IsString()
  @MinLength(1)
  type: string;

  @ApiProperty({ description: 'Value of the identifier.' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  value: string;

  @ApiProperty({ description: 'Issuer of the identifier.' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  issuer: string;
}
