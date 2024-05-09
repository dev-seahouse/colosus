import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class BrokerageUkDirectDebitMandateMutableDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateMutableDto
{
  @ApiProperty({
    description:
      'The bank account ID associated with this mandate. It must belong to the provided party ID.',
    type: 'string',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  bankAccountId: string;

  @ApiProperty({
    description:
      'The party ID associated with this mandate. The bank account ID must also belong to this party.',
    type: 'string',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  partyId: string;
}

export class BrokerageUkDirectDebitMandateDto
  extends BrokerageUkDirectDebitMandateMutableDto
  implements BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto
{
  @ApiProperty({
    description: "The mandate's unique ID",
    type: 'string',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  id: string;

  @ApiProperty({
    description: "The mandate's unique scheme reference",
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  reason: string | null = null;

  @ApiProperty({
    description: "The mandate's unique scheme reference",
    type: 'string',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  reference: string;

  @ApiProperty({
    description:
      'An enum representing all the possible statuses for a Mandate.',
    enum: BrokerageIntegrationServerDto.BrokerUkDirectDebitMandateStatusEnum,
  })
  @IsEnum(BrokerageIntegrationServerDto.BrokerUkDirectDebitMandateStatusEnum)
  status: BrokerageIntegrationServerDto.BrokerUkDirectDebitMandateStatusEnum;
}

export class BrokerageUkDirectDebitMandateListAllQueryParamsDto
  extends BrokerageIntegrationServerDto.BrokerageIntegrationListAllQueryParamsBaseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateListAllQueryParamsDto
{
  @ApiProperty({
    description: 'Bank account ID to filter by.',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @MinLength(1)
  bankAccountId?: string;

  @ApiProperty({
    description: 'Party ID to filter by.',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @MinLength(1)
  partyId?: string;

  @ApiProperty({
    description: 'Reference to filter by.',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @MinLength(1)
  reference?: string;

  @ApiProperty({
    description: 'Status to filter by.',
    type: 'string',
    required: false,
    enum: BrokerageIntegrationServerDto.BrokerUkDirectDebitMandateStatusEnum,
  })
  @IsOptional()
  @IsEnum(BrokerageIntegrationServerDto.BrokerUkDirectDebitMandateStatusEnum)
  status?: BrokerageIntegrationServerDto.BrokerUkDirectDebitMandateStatusEnum;
}

export class BrokerageUkDirectDebitMandateListAllResponseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateListAllResponseDto
{
  paginationToken: string | null;
  results: BrokerageUkDirectDebitMandateDto[];
}

export class BrokerageUkDirectDebitMandateGetNextPossiblePaymentCollectionDateDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateNextPossibleConnectionDateDto
{
  @ApiProperty({
    description: 'next possible collection date.',
    type: 'string',
    example: '2023-08-24',
  })
  @IsString()
  date: string;
}
