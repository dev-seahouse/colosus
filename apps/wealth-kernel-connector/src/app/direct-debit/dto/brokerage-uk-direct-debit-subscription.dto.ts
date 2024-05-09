import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';

export class BrokerageUkDirectDebitAmountDto
  implements BrokerageIntegrationServerDto.IBrokerageUkDirectDebitAmountDto
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

export class BrokerageUkDirectDebitGetSubscriptionDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitGetSubscriptionDto
{
  @ApiProperty({
    description: 'Subscription ID',
    type: 'string',
    example: 'dds-36gffx4b6242h4',
  })
  id: string;

  @ApiProperty({
    description: 'Mandate ID',
    type: 'string',
    example: 'ddm-36gffx4b6242h4',
  })
  mandateId: string;

  @ApiProperty({
    description: 'Portfolio ID',
    type: 'string',
    example: 'prt-343lrwxvz22bxq',
  })
  portfolioId: string;

  @ApiProperty({
    description: 'Model for an amount of money, with a currency and value',
    type: BrokerageUkDirectDebitAmountDto,
  })
  @IsObject()
  amount: BrokerageUkDirectDebitAmountDto;

  @ApiProperty({
    type: 'string',
    description:
      'An enum representing all the possible statuses for a subscription',
    enum: BrokerageIntegrationServerDto.BrokerageUkDirectDebitSubscriptionStatusEnum,
  })
  status: BrokerageIntegrationServerDto.BrokerageUkDirectDebitSubscriptionStatusEnum;

  @ApiProperty({
    type: 'string',
    description:
      'An enum representing all the possible intervals for a Subscription',
    enum: BrokerageIntegrationServerDto.BrokerageUkDirectDebitSubscriptionIntervalEnum,
  })
  interval: BrokerageIntegrationServerDto.BrokerageUkDirectDebitSubscriptionIntervalEnum;

  @ApiProperty({
    type: 'string',
    description: 'Date of Month for Subscription',
  })
  dayOfMonth: number;

  @ApiProperty({
    type: 'string',
    description: 'Month of the subscription',
  })
  month: string;

  @ApiProperty({
    type: 'string',
    description: 'Time when subscription was created',
  })
  createdAt: string;
}

export class BrokerageUkDirectDebitUpdateSubscriptionDto {
  @ApiProperty({
    description:
      'Update a susbcription. As of writing, it is currently only possible to update the subscriptions amount.',
    required: true,
  })
  amount: BrokerageUkDirectDebitAmountDto;
}

export class BrokerageUkDirectDebitCreateSubscriptionReqDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreateSubscriptionReqDto
{
  @ApiProperty({
    type: 'string',
    description: 'Mandate Id',
    example: 'ddm-36gffx4b6242h4',
    required: true,
  })
  mandateId: string;

  @ApiProperty({
    description: 'Portfolio ID',
    type: 'string',
    example: 'prt-343lrwxvz22bxq',
    required: true,
  })
  portfolioId: string;

  @ApiProperty({
    description: 'Model for an amount of money, with a currency and value',
    type: BrokerageUkDirectDebitAmountDto,
    required: true,
  })
  @IsObject()
  amount: BrokerageUkDirectDebitAmountDto;

  @ApiProperty({
    type: 'string',
    description:
      'An enum representing all the possible intervals for a Subscription',
    enum: BrokerageIntegrationServerDto.BrokerageUkDirectDebitSubscriptionIntervalEnum,
    required: true,
  })
  interval: BrokerageIntegrationServerDto.BrokerageUkDirectDebitSubscriptionIntervalEnum;

  @ApiProperty({
    type: 'number',
    description:
      'The day of the month on which the funds should be collected from the bank account. Must be in the range 1-28, or -1 to indicate the last working day of the month',
    example: 25,
    required: false,
  })
  @IsOptional()
  dayOfMonth?: number;

  @ApiProperty({
    type: 'string',
    description: 'Full name of month when using a Yearly interval',
    example: 'January',
    required: false,
  })
  @IsOptional()
  month?: string;

  @ApiProperty({
    type: 'string',
    description:
      'Date on which payments will start to be created (Not the date of the first payment)',
    example: '2021-01-26',
    required: false,
  })
  @IsOptional()
  startDate?: string;
}

export class BrokerageUkDirectDebitCreateSubscriptionResponseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreateSubscriptionResDto
{
  @ApiProperty({
    type: 'string',
    description: 'Unique identifier of the resource created.',
  })
  id: string;
}

export class BrokerageUkDirectDebitSubscriptionListAllQueryParamsDto
  extends BrokerageIntegrationServerDto.BrokerageIntegrationListAllQueryParamsBaseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto
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
    enum: BrokerageIntegrationServerDto.BrokerageUkDirectDebitSubscriptionStatusEnum,
    required: false,
  })
  status?: BrokerageIntegrationServerDto.BrokerageUkDirectDebitSubscriptionStatusEnum;
}

export class BrokerageUkDirectDebitSubscriptionListAllResponseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllResponseDto
{
  paginationToken: string | null;
  results: BrokerageUkDirectDebitGetSubscriptionDto[];
}

export class BrokerageUkDirectDebitUpcomingSubsccriptionDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpcomingSubscriptionDto
{
  amount: BrokerageUkDirectDebitAmountDto;
  collectionDate: string;
}
