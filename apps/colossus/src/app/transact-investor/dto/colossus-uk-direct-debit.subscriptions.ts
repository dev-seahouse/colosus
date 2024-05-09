import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';
import { ColossusUkDirectDebitSubscription } from './colossus-uk-direct-debit-subscription.dto';

export class ColossusUkDirectDebitSubscriptions
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllResponseDto
{
  @ApiProperty({
    type: 'string',
    description: 'A token for the position to offset from.',
    required: false,
  })
  paginationToken: string | null;

  @ApiProperty({
    description: 'List of Direct Debit Subscriptions',
    required: true,
    type: ColossusUkDirectDebitSubscription,
    isArray: true,
  })
  results: ColossusUkDirectDebitSubscription[];
}
