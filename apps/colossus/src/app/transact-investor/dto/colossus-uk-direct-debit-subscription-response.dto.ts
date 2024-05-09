import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';

export class ColossusUkDirectDebitSubscriptionResponseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreateSubscriptionResDto
{
  @ApiProperty({
    description: 'Direct Debit Subscription Id',
    type: 'string',
  })
  id: string;
}
