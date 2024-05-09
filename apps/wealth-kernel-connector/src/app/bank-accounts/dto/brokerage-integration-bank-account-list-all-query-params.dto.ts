import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class BrokerageIntegrationBankAccountListAllQueryParamsDto
  extends BrokerageIntegrationServerDto.BrokerageIntegrationListAllQueryParamsBaseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountListAllQueryParamsDto
{
  @ApiProperty({
    description: 'Account number to filter by.',
    required: false,
    minLength: 1,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  accountNumber?: string;

  @ApiProperty({
    description: 'Client reference to filter by.',
    required: false,
    minLength: 1,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  clientReference?: string;

  @ApiProperty({
    description: 'Unique identifier of the party to filter by.',
    required: false,
    minLength: 1,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  partyId?: string;

  @ApiProperty({
    description: 'Sort code to filter by.',
    required: false,
    minLength: 1,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  sortCode?: string;
}
