import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';
import { BrokerageUkDirectDebitSubscriptionAmountDto } from './brokerage-uk-direct-debit-subscription-amount.dto';

export class ColossusUkDirectDebitUpdateSubscriptionDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpdateSubscriptionDto
{
  @ApiProperty({
    type: BrokerageUkDirectDebitSubscriptionAmountDto,
    description: 'Model for an amount of money, with a currency and value',
  })
  amount: BrokerageUkDirectDebitSubscriptionAmountDto;
}
