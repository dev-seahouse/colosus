import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class BrokerageUkDirectDebitPaymentAmountDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentAmountDto
{
  @ApiProperty({
    type: 'number',
    example: 1.14,
    description: 'Amount of the money',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    type: 'string',
    description: 'Currency of the money. Must be an ISO 4217 Currency Code',
    example: 'GBP',
  })
  @IsString()
  currency: string;
}

export class BrokerageUkDirectDebitPaymentRequestDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreatePaymentReqDto
{
  @ApiProperty({
    description: 'Mandate ID for the payment',
    type: 'string',
    example: 'ddm-36gffx4b6242h4',
  })
  @IsString()
  mandateId: string;

  @ApiProperty({
    description: 'Model for an amount of money, with a currency and value',
    type: BrokerageUkDirectDebitPaymentAmountDto,
  })
  @IsObject()
  amount: BrokerageUkDirectDebitPaymentAmountDto;

  @ApiProperty({
    description: 'Portfolio Id',
  })
  @IsString()
  portfolioId: string;

  @ApiProperty({
    description: 'Requested charge date in the format "yyyy-MM-dd',
    example: '2019-08-24',
    required: false,
  })
  @IsString()
  @IsOptional()
  collectionDate?: string;
}

export class BrokerageUkDirectDebitPaymentResponseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreatePaymentResDto
{
  @ApiProperty({
    type: 'string',
    description: 'Unique identifier of the resource created.',
  })
  id: string;
}

export class BrokerageUkDirectDebitPaymentDto
  implements BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentDto
{
  id: string;
  @ApiProperty({
    description: 'Mandate ID for the payment',
    type: 'string',
    example: 'ddm-36gffx4b6242h4',
  })
  @IsString()
  mandateId: string;

  @ApiProperty({
    description: 'Portfolio Id',
  })
  @IsString()
  portfolioId: string;

  @ApiProperty({
    description: 'Model for an amount of money, with a currency and value',
    type: BrokerageUkDirectDebitPaymentAmountDto,
  })
  @IsObject()
  amount: BrokerageUkDirectDebitPaymentAmountDto;
  @ApiProperty({
    description: 'Requested charge date in the format "yyyy-MM-dd',
    example: '2019-08-24',
  })
  @IsString()
  @IsOptional()
  collectionDate?: string;

  @ApiProperty({
    description: 'Subscription Id',
  })
  @IsString()
  subscriptionId: string;

  @ApiProperty({
    type: 'string',
    description:
      'An enum representing all the possible statuses for a Payment.',
    enum: BrokerageIntegrationServerDto.BrokerageUkDirectDebitPaymentStatusEnum,
  })
  status: BrokerageIntegrationServerDto.BrokerageUkDirectDebitPaymentStatusEnum;

  @ApiProperty({
    type: 'string',
    description: 'Payment Creation timestamp',
  })
  @IsString()
  createdAt: string;

  @ApiProperty({
    description:
      'A reason provided for when the Payment is in some form of failed state, e.g. failed, cancelled, expired, etc.',
  })
  reason: string | null = null;
}

export class BrokerageUkDirectDebitPaymentListAllResponseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllResponseDto
{
  paginationToken: string | null;
  results: BrokerageUkDirectDebitPaymentDto[];
}

export class BrokerageUkDirectDebitPaymentListAllQueryParamsDto
  extends BrokerageIntegrationServerDto.BrokerageIntegrationListAllQueryParamsBaseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllQueryParamsDto
{
  @ApiProperty({
    type: 'string',
    description: 'Mandate Id to filter by',
    required: false,
  })
  mandateId?: string;

  @ApiProperty({
    type: 'string',
    description: 'PortfolioId Id to filter by',
    required: false,
  })
  portfolioId?: string;

  @ApiProperty({
    type: 'string',
    description: 'Status to filter by',
    enum: BrokerageIntegrationServerDto.BrokerageUkDirectDebitPaymentStatusEnum,
    required: false,
  })
  status?: BrokerageIntegrationServerDto.BrokerageUkDirectDebitPaymentStatusEnum;

  @ApiProperty({
    type: 'string',
    description: 'SubscriptionId to filter by',
    required: false,
  })
  subscriptionId?: string;
}
