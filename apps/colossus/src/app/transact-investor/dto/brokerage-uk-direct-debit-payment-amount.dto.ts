import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';

export class BrokerageUkDirectDebitPaymentAmountDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentAmountDto
{
  @ApiProperty({
    description: 'The amount of money to be transferred.',
    example: 1000,
    type: 'number',
    format: 'double',
  })
  amount: number;

  @ApiProperty({
    type: 'string',
    description: 'The currency of the amount.',
    example: 'GBP',
  })
  currency: string;
}
