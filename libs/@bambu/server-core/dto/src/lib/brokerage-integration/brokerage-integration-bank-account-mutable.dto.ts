import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { IBrokerageIntegrationBankAccountMutableDto } from './i-brokerage-integration-bank-account-mutable.dto';

export class BrokerageIntegrationBankAccountMutableDto
  implements IBrokerageIntegrationBankAccountMutableDto
{
  @ApiProperty({
    description: 'Unique identifier of the party the bank account belongs to.',
    minLength: 1,
    maxLength: 50,
    example: 'pty-33wds6i4i242wc',
  })
  @IsString()
  @Length(1, 50)
  partyId: string;

  @ApiProperty({
    description: 'Can be populated with your own reference.',
    minLength: 1,
    example: '1944a59713',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1)
  clientReference?: string | null;

  @ApiProperty({
    description:
      "Name of the bank account's owner as it appears on the bank statement.",
    minLength: 1,
    maxLength: 50,
    example: 'C Kent & L Lane',
  })
  @IsString()
  @Length(1, 50)
  name: string;

  @ApiProperty({
    description: 'Bank account number. Must be a valid bank account number.',
    pattern: '^[0-9]{8}$',
    example: '55779911',
  })
  @IsString()
  @Matches(/^[0-9]{8}$/)
  accountNumber: string;

  @ApiProperty({
    description: 'Bank account sort code. Must be a valid sort code.',
    pattern: '^[0-9]{2}-[0-9]{2}-[0-9]{2}$',
    example: '20-00-00',
  })
  @IsString()
  @Matches(/^[0-9]{2}-[0-9]{2}-[0-9]{2}$/)
  sortCode: string;

  @ApiProperty({
    description:
      "Currency of the bank account as an ISO4217 currency code. Currently only 'GBP' is supported",
    pattern: '^[A-Z]{3}$',
    minLength: 3,
    maxLength: 3,
    example: 'GBP',
  })
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/)
  currency: string;

  @ApiProperty({
    description:
      "Country the bank account is registered in as an ISO 3166 two-letter country code. Currently only 'GB' is supported",
    pattern: '^[A-Z]{2}$',
    minLength: 2,
    maxLength: 2,
    example: 'GB',
  })
  @IsString()
  @Length(2, 2)
  @Matches(/^[A-Z]{2}$/)
  countryCode: string;
}
