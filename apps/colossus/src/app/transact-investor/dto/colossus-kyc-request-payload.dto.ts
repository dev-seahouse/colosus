import {
  BrokerageIntegrationServerDto,
  InvestorKycDto,
} from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ColossusKycRequestPayloadAccountDto
  implements
    Omit<
      BrokerageIntegrationServerDto.IBrokerageIntegrationAccountMutableDto,
      'clientReference' | 'owner' | 'name'
    >
{
  // @ApiProperty({
  //   type: 'string',
  // })
  // @IsString()
  // @IsNotEmpty()
  // name: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    enum: BrokerageIntegrationServerDto.AccountTypeEnum,
    type: 'string',
  })
  @IsEnum(BrokerageIntegrationServerDto.AccountTypeEnum)
  type: BrokerageIntegrationServerDto.AccountTypeEnum;
}

export class ColossusKycRequestPayloadAddressDto
  implements
    Omit<
      BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressCreationDto,
      'partyId' | 'clientReference'
    >
{
  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty({
    type: 'string',
    default: null,
    required: false,
  })
  endDate: string | null = null;

  @ApiProperty({
    type: 'string',
  })
  line1: string;

  @ApiProperty({
    type: 'string',
    default: null,
    required: false,
  })
  @IsString()
  @IsOptional()
  line2: string | null = null;

  @ApiProperty({
    type: 'string',
    default: null,
    required: false,
  })
  @IsString()
  @IsOptional()
  line3: string | null = null;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({
    type: 'string',
    default: null,
    required: false,
  })
  @IsString()
  @IsOptional()
  region: string | null = null;

  @ApiProperty({
    type: 'string',
    default: null,
    required: false,
  })
  @IsString()
  @IsOptional()
  startDate: string | null = null;
}

export class ColossusKycRequestPayloadPartyAnnualIncomeDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAnnualIncomeDto
{
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    type: 'string',
    example: 'GBP',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  currency: string;
}

export class ColossusKycRequestPayloadPartyIdentifierDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationPartyIdentifierCreationDto
{
  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  issuer: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  value: string;
}

export class ColossusKycRequestPayloadPartyDto
  implements
    Omit<
      BrokerageIntegrationServerDto.IBrokerageIntegrationPartyCreationDto,
      'clientReference'
    >
{
  @ApiProperty({
    type: ColossusKycRequestPayloadPartyAnnualIncomeDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ColossusKycRequestPayloadPartyAnnualIncomeDto)
  annualIncome: ColossusKycRequestPayloadPartyAnnualIncomeDto;

  @ApiProperty({
    type: 'string',
    default: null,
    required: false,
  })
  @IsString()
  @IsOptional()
  countryOfBirth: string | null = null;

  @ApiProperty({
    type: 'string',
    format: 'date',
  })
  @IsString()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty({
    type: 'string',
    required: false,
    default: null,
  })
  @IsString()
  @IsOptional()
  dateOfDeath: string | null = null;

  @ApiProperty({
    type: 'string',
    format: 'email',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @ApiProperty({
    enum: BrokerageIntegrationServerDto.BrokerageIntegrationPartyEmploymentStatusEnum,
  })
  @IsNotEmpty()
  @IsEnum(
    BrokerageIntegrationServerDto.BrokerageIntegrationPartyEmploymentStatusEnum
  )
  employmentStatus: BrokerageIntegrationServerDto.BrokerageIntegrationPartyEmploymentStatusEnum;

  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  forename: string;

  @ApiProperty({
    type: ColossusKycRequestPayloadPartyIdentifierDto,
    isArray: true,
  })
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ColossusKycRequestPayloadPartyIdentifierDto)
  identifiers: ColossusKycRequestPayloadPartyIdentifierDto[];

  @ApiProperty({
    enum: BrokerageIntegrationServerDto.BrokerageIntegrationPartyIndustryEnum,
  })
  @IsOptional()
  @IsEnum(BrokerageIntegrationServerDto.BrokerageIntegrationPartyIndustryEnum)
  industry?: BrokerageIntegrationServerDto.BrokerageIntegrationPartyIndustryEnum;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsOptional()
  middlename: string | null = null;

  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  @IsNotEmpty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  nationalities: string[];

  @ApiProperty({
    type: 'string',
    required: false,
    default: null,
  })
  @IsString()
  @IsOptional()
  previousSurname: string | null = null;

  @ApiProperty({
    type: 'string',
    enum: BrokerageIntegrationServerDto.BrokerageIntegrationPartySourcesOfWealthEnum,
    isArray: true,
  })
  @IsEnum(
    BrokerageIntegrationServerDto.BrokerageIntegrationPartySourcesOfWealthEnum,
    { each: true }
  )
  @ArrayMinSize(1)
  sourcesOfWealth: BrokerageIntegrationServerDto.BrokerageIntegrationPartySourcesOfWealthEnum[];

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  surname: string;

  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  @IsString({ each: true })
  @ArrayMinSize(1)
  taxResidencies: string[];

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  telephoneNumber: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class ColossusKycRequestPayloadDto
  implements InvestorKycDto.IColossusKycRequestPayloadDto
{
  @ApiProperty({
    type: ColossusKycRequestPayloadAccountDto,
    required: true,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ColossusKycRequestPayloadAccountDto)
  account: ColossusKycRequestPayloadAccountDto;

  @ApiProperty({
    type: ColossusKycRequestPayloadAddressDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ColossusKycRequestPayloadAddressDto)
  address: ColossusKycRequestPayloadAddressDto;

  @ApiProperty({
    type: ColossusKycRequestPayloadPartyDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ColossusKycRequestPayloadPartyDto)
  party: ColossusKycRequestPayloadPartyDto;
}
