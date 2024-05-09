import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class BrokerageIntegrationAccountMutableDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationAccountMutableDto
{
  @ApiProperty({
    example: BrokerageIntegrationServerDto.AccountTypeEnum.GIA,
    enum: BrokerageIntegrationServerDto.AccountTypeEnum,
    type: 'string',
  })
  @IsEnum(BrokerageIntegrationServerDto.AccountTypeEnum)
  type: BrokerageIntegrationServerDto.AccountTypeEnum;

  @ApiProperty({ example: 'dfgjf43nnkjj', required: false })
  @IsString()
  @IsOptional()
  @MinLength(1)
  clientReference?: string | null;

  @ApiProperty({ example: 'Savings Account' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'prd-gia' })
  @IsString()
  @MinLength(1)
  productId: string;

  @ApiProperty({
    example: 'pty-33xk677aw2egkm',
    description: 'This is the party id of the user.',
  })
  @IsString()
  @MinLength(1)
  owner: string;
}

export class BrokerageIntegrationAccountDto
  extends BrokerageIntegrationAccountMutableDto
  implements BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto
{
  @ApiProperty({ example: 'acc-34gbczz4624t32' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  id: string;

  @ApiProperty({
    example: BrokerageIntegrationServerDto.AccountStatusEnum.ACTIVE,
    enum: BrokerageIntegrationServerDto.AccountStatusEnum,
    type: 'string',
  })
  @IsEnum(BrokerageIntegrationServerDto.AccountStatusEnum)
  status: BrokerageIntegrationServerDto.AccountStatusEnum;

  @ApiProperty({ example: '2021-01-08T13:55:16.4237925Z' })
  @IsString()
  @MinLength(1)
  addedAt: string;
}

export class BrokerageIntegrationListAllAccountsQueryParamsDto
  extends BrokerageIntegrationServerDto.BrokerageIntegrationListAllQueryParamsBaseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationListAllAccountsQueryParamsDto
{
  @ApiProperty({
    type: 'string',
    required: false,
    minLength: 1,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  accountId?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    minLength: 1,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  child?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    minLength: 1,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  clientReference?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    minLength: 1,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  owner?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    minLength: 1,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  productId?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    minLength: 1,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  registeredContact?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    minLength: 1,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  status?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    minLength: 1,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  type?: string;
}

export class BrokerageIntegrationListAllAccountsResponseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationListAllAccountsResponseDto
{
  paginationToken: string | null;
  results: BrokerageIntegrationAccountDto[];
}
