import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';
import { BrokerageUkDirectDebitSubscriptionAmountDto } from './brokerage-uk-direct-debit-subscription-amount.dto';

export class ColossusUkDirectDebitSubscription
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitGetSubscriptionDto
{
  @ApiProperty({
    description: 'Unique ID for the Direct Debit Subscription',
    type: 'string',
    example: 'dds-34a67qfg7362me',
  })
  id: string;

  @ApiProperty({
    description: 'Mandate ID of the Direct Debit Subscription',
    type: 'string',
    example: 'ddm-343lrhsth22c2i',
  })
  mandateId: string;

  @ApiProperty({
    description: 'Portfolio ID of the Direct Debit Subscription',
    type: 'string',
    example: 'prt-343lrwxvz22bxq',
  })
  portfolioId: string;

  @ApiProperty({
    type: BrokerageUkDirectDebitSubscriptionAmountDto,
    description: 'Model for an amount of money, with a currency and value',
  })
  amount: BrokerageUkDirectDebitSubscriptionAmountDto;

  @ApiProperty({
    description:
      'An enum representing all the possible statuses for a Subscription.',
    enum: BrokerageIntegrationServerDto.BrokerageUkDirectDebitSubscriptionStatusEnum,
  })
  status: BrokerageIntegrationServerDto.BrokerageUkDirectDebitSubscriptionStatusEnum;

  @ApiProperty({
    description:
      'An enum representing all the possible intervals for a Subscription.',
    enum: BrokerageIntegrationServerDto.BrokerageUkDirectDebitSubscriptionIntervalEnum,
  })
  interval: BrokerageIntegrationServerDto.BrokerageUkDirectDebitSubscriptionIntervalEnum;

  @ApiProperty({
    description: 'Date of the month for the Direct Debit Subscription.',
    type: 'number',
    example: 25,
  })
  dayOfMonth: number;

  @ApiProperty({
    description: 'Month for the Direct Debit Subscription.',
    type: 'string',
    example: 'March',
  })
  month: string;

  @ApiProperty({
    description: 'Creation time for the Direct Debit Subscription.',
    type: 'string',
    example: '2021-01-21T00:00:00.0000000Z',
  })
  createdAt: string;
}
