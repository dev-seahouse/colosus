import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { BrokerageIntegrationPartyAnnualIncomeDto } from './brokerage-integration-party-annual-income.dto';
import { BrokerageIntegrationPartyIdentifierDto } from './brokerage-integration-party-identifier.dto';
import {
  BrokerageIntegrationPartyEmploymentStatusEnum,
  BrokerageIntegrationPartyIndustryEnum,
  BrokerageIntegrationPartySourcesOfWealthEnum,
  IBrokerageIntegrationPartyDto,
} from './i-brokerage-integration-party.dto';

export class BrokerageIntegrationPartyDto
  implements IBrokerageIntegrationPartyDto
{
  @ApiProperty({ description: 'Type of the party.' })
  @IsString()
  @MinLength(1)
  type: string;

  @ApiProperty({ description: 'Title of the party.' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({ description: 'Forename of the party.' })
  @IsString()
  @MinLength(1)
  forename: string;

  @ApiProperty({ description: 'Middle name of the party.' })
  @IsString()
  @MinLength(1)
  middlename: string;

  @ApiProperty({ description: 'Surname of the party.' })
  @IsString()
  @MinLength(1)
  surname: string;

  @ApiProperty({
    description: 'Previous surname of the party.',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  previousSurname: string | null;

  @ApiProperty({
    description: 'Country of birth of the party.',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  countryOfBirth: string | null;

  @ApiProperty({ description: 'Email address of the party.' })
  @IsString()
  @MinLength(1)
  emailAddress: string;

  @ApiProperty({
    description: 'Telephone number of the party.',
  })
  @IsString()
  @MinLength(1)
  telephoneNumber: string;

  @ApiProperty({
    description: 'Date of birth of the party.',
  })
  @IsString()
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({
    description: 'Date of death of the party, if applicable.',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  dateOfDeath: string | null;

  @ApiProperty({ description: 'Tax residencies of the party.' })
  @IsArray()
  @ArrayUnique()
  taxResidencies: string[];

  @ApiProperty({ description: 'Nationalities of the party.' })
  @IsArray()
  @ArrayUnique()
  nationalities: string[];

  @ApiProperty({
    description: 'Employment status of the party.',
    type: 'string',
    enum: BrokerageIntegrationPartyEmploymentStatusEnum,
  })
  @IsOptional()
  @IsEnum(BrokerageIntegrationPartyEmploymentStatusEnum)
  employmentStatus: BrokerageIntegrationPartyEmploymentStatusEnum | null;

  @ApiProperty({
    description: 'Industry of the party.',
    type: 'string',
    enum: BrokerageIntegrationPartyIndustryEnum,
  })
  @IsEnum(BrokerageIntegrationPartyIndustryEnum)
  @IsOptional()
  industry?: BrokerageIntegrationPartyIndustryEnum;

  @ApiProperty({
    description: 'Sources of wealth of the party.',
    type: 'string',
    enum: BrokerageIntegrationPartySourcesOfWealthEnum,
    isArray: true,
  })
  @ValidateIf((obj, value) => value !== null)
  @IsArray()
  @ArrayUnique()
  @IsEnum(BrokerageIntegrationPartySourcesOfWealthEnum, { each: true })
  sourcesOfWealth: BrokerageIntegrationPartySourcesOfWealthEnum[];

  @ApiProperty({
    description: 'Annual income details of the party.',
    type: () => BrokerageIntegrationPartyAnnualIncomeDto,
  })
  @ValidateNested()
  @Type(() => BrokerageIntegrationPartyAnnualIncomeDto)
  annualIncome: BrokerageIntegrationPartyAnnualIncomeDto;

  @ApiProperty({ description: 'Client reference.' })
  @IsString()
  @MinLength(1)
  clientReference: string;

  @ApiProperty({
    description: 'Identifiers for the party.',
    type: () => BrokerageIntegrationPartyIdentifierDto,
  })
  @ValidateNested({ each: true })
  @Type(() => BrokerageIntegrationPartyIdentifierDto)
  identifiers: BrokerageIntegrationPartyIdentifierDto[];

  @ApiProperty({ description: 'Timestamp the party was added at.' })
  @IsString()
  @MinLength(1)
  addedAt: string;

  @ApiProperty({
    description: 'Version of the party details.',
  })
  @IsInt()
  @Min(1)
  version: number;

  // @ApiProperty({ description: 'Name of the party.' })
  // @IsString()
  // @MinLength(1)
  // name: string;

  @ApiProperty({
    description: 'Unique identifier for the party.',
  })
  @IsString()
  @MinLength(1)
  id: string;

  @ApiProperty({
    description: 'Tenant ID associated with the party.',
  })
  @IsString()
  @MinLength(1)
  tenantId: string;
}
