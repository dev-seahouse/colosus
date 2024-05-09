import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { IBrokerageIntegrationPartyAddressCreationDto } from './i-brokerage-integration-party-address.dto';

export class BrokerageIntegrationPartyAddressCreationDto
  implements IBrokerageIntegrationPartyAddressCreationDto
{
  @ApiProperty({
    description: 'Unique identifier of the party the address belongs to.',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  partyId: string;

  @ApiPropertyOptional({
    description: 'Can be populated with your own reference.',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  clientReference: string | null;

  @ApiProperty({
    description: 'First line of the address.',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  line1: string;

  @ApiPropertyOptional({
    description: 'Second line of the address.',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  // @Length(1, 100)
  @MaxLength(100)
  line2: string | null = null;

  @ApiPropertyOptional({
    description: 'Third line of the address.',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  // @Length(1, 100)
  @MaxLength(100)
  line3: string | null = null;

  @ApiProperty({ description: 'City.', minLength: 1, maxLength: 100 })
  @IsString()
  @Length(1, 100)
  city: string;

  @ApiPropertyOptional({ description: 'County.', minLength: 1, maxLength: 100 })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  region: string | null;

  @ApiProperty({
    description: 'Country. Must be ISO3166 two-letter country code.',
    minLength: 2,
    maxLength: 2,
    pattern: '^[A-Z]',
  })
  @IsString()
  @Length(2, 2)
  @Matches(/^[A-Z]{2}$/, {
    message: 'Country code must be a valid ISO3166 two-letter country code',
  })
  countryCode: string;

  @ApiProperty({
    description: 'Postcode.',
    pattern: '^[A-Z]{1,2}[0-9R][0-9A-Z]?\\s?[0-9][ABD-HJLNP-UW-Z]{2}$',
    minLength: 1,
  })
  @IsString()
  @Length(1)
  @Matches(/^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$/, {
    message: 'Invalid postal code',
  })
  postalCode: string;

  @ApiPropertyOptional({ description: 'Start date', format: 'date' })
  @IsDateString()
  @IsOptional()
  startDate: string | null;

  @ApiPropertyOptional({ description: 'End date', format: 'date' })
  @IsDateString()
  @IsOptional()
  endDate: string | null;
}
