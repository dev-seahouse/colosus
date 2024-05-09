import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class ColossusBankAccountRequestPayloadDto
  implements
    Omit<
      BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountMutableDto,
      'partyId' | 'clientReference'
    >
{
  @ApiProperty({
    description: 'Bank account number. Must be a valid bank account number.',
    pattern: '^[0-9]{8}$',
    example: '55779911',
  })
  @IsString()
  @Matches(/^[0-9]{8}$/)
  accountNumber: string;

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
      "Name of the bank account's owner as it appears on the bank statement.",
    minLength: 1,
    maxLength: 50,
    example: 'C Kent & L Lane',
  })
  @IsString()
  @Length(1, 50)
  name: string;

  @ApiProperty({
    description: 'Bank account sort code. Must be a valid sort code.',
    pattern: '^[0-9]{2}-[0-9]{2}-[0-9]{2}$',
    example: '20-00-00',
  })
  @IsString()
  @Matches(/^[0-9]{2}-[0-9]{2}-[0-9]{2}$/)
  sortCode: string;
}

export class ColossusBankAccountResponsePayloadDto
  extends ColossusBankAccountRequestPayloadDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountMutableDto,
    BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto
{
  @ApiProperty({
    description: 'Date and time the bank account was added to the system.',
    example: '2021-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  addedAt: string;

  @ApiProperty({
    description: 'Can be populated with your own reference.',
    minLength: 1,
    example: '1944a59713',
    required: false,
  })
  clientReference?: string | null = null;

  @ApiProperty({
    description:
      'Date and time the bank account was deactivated, if applicable.',
    example: '2021-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
    default: null,
  })
  deactivatedAt?: string | null = null;

  @ApiProperty({
    description: 'Unique identifier of the bank account.',
    minLength: 1,
    maxLength: 50,
    example: 'bnk-33wdqmffe22aq6',
  })
  id: string;

  @ApiProperty({
    description: 'Unique identifier of the party the bank account belongs to.',
    minLength: 1,
    maxLength: 50,
    example: 'pty-33wds6i4i242wc',
  })
  partyId: string;
}
