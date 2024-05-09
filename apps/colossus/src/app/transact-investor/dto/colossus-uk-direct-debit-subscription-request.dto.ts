import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';
import { BrokerageUkDirectDebitSubscriptionAmountDto } from './brokerage-uk-direct-debit-subscription-amount.dto';

export class ColossusUkDirectDebitSubscriptionRequestDto
  implements
    Omit<
      BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreateSubscriptionReqDto,
      'portfolioId'
    >
{
  @ApiProperty({
    description: 'Mandate ID of the Direct Debit Subscription',
    type: 'string',
    example: 'ddm-343lrhsth22c2i',
  })
  mandateId: string;

  @ApiProperty({
    description: 'Goal ID of the Direct Debit Subscription',
    type: 'string',
    example: 'prt-343lrwxvz22bxq',
  })
  goalId: string;

  @ApiProperty({
    type: BrokerageUkDirectDebitSubscriptionAmountDto,
    description: 'Model for an amount of money, with a currency and value',
  })
  amount: BrokerageUkDirectDebitSubscriptionAmountDto;

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
  dayOfMonth?: number;

  @ApiProperty({
    description: 'Month for the Direct Debit Subscription.',
    type: 'string',
    example: 'March',
  })
  month?: string;
  @ApiProperty({
    description:
      'Date on which payments will start to be created (Not the date of the first payment)',
    type: 'string',
    example: '2022-11-01',
  })
  startDate?: string;
}
