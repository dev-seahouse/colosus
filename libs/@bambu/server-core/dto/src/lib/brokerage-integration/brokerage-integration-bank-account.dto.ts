import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { BrokerageIntegrationBankAccountMutableDto } from './brokerage-integration-bank-account-mutable.dto';
import { IBrokerageIntegrationBankAccountMutableDto } from './i-brokerage-integration-bank-account-mutable.dto';
import { IBrokerageIntegrationBankAccountDto } from './i-brokerage-integration-bank-account.dto';

export class BrokerageIntegrationBankAccountDto
  extends BrokerageIntegrationBankAccountMutableDto
  implements
    IBrokerageIntegrationBankAccountMutableDto,
    IBrokerageIntegrationBankAccountDto
{
  @ApiProperty({
    description: 'Unique identifier of the bank account.',
    minLength: 1,
    maxLength: 50,
    example: 'bnk-33wdqmffe22aq6',
  })
  @IsString()
  @Length(1, 50)
  id: string;

  @ApiProperty({
    description: 'Date and time the bank account was added to the system.',
    example: '2021-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @IsString()
  addedAt: string;

  @ApiProperty({
    description:
      'Date and time the bank account was deactivated, if applicable.',
    example: '2021-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
    default: null,
  })
  @IsOptional()
  @IsString()
  deactivatedAt?: string | null = null;
}
