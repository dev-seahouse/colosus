import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';
import { BrokerageUkDirectDebitSubscriptionAmountDto } from './brokerage-uk-direct-debit-subscription-amount.dto';

export class ColossusUkDirectDebitListUpcomingSubscriptionDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpcomingSubscriptionDto
{
  @ApiProperty({
    type: BrokerageUkDirectDebitSubscriptionAmountDto,
    description: 'Model for an amount of money, with a currency and value',
  })
  amount: BrokerageUkDirectDebitSubscriptionAmountDto;

  @ApiProperty({
    type: 'string',
    description: 'Collection date for the payment',
  })
  collectionDate: string;
}
