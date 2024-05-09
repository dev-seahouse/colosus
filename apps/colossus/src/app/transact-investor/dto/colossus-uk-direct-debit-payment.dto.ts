import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';
import { BrokerageUkDirectDebitPaymentAmountDto } from './brokerage-uk-direct-debit-payment-amount.dto';

export class ColossusUkDirectDebitPaymentDto
  implements BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentDto
{
  @ApiProperty({
    description: 'Direct Debit Payment ID',
    type: 'string',
  })
  id: string;

  @ApiProperty({
    description: 'Model for an amount of money, with a currency and value',
    type: 'string',
  })
  amount: BrokerageUkDirectDebitPaymentAmountDto;

  @ApiProperty({
    description: 'Status for the Direct Debit Payment',
    enum: BrokerageIntegrationServerDto.BrokerageUkDirectDebitPaymentStatusEnum,
  })
  status: BrokerageIntegrationServerDto.BrokerageUkDirectDebitPaymentStatusEnum;

  @ApiProperty({
    description: 'Mandate ID for the Direct Debit Payment',
    type: 'string',
  })
  mandateId: string;

  @ApiProperty({
    description: 'Subscription ID for the Direct Debit Payment',
    type: 'string',
  })
  subscriptionId: string | null;

  @ApiProperty({
    description: 'Portfolio ID for the Direct Debit Payment',
    type: 'string',
  })
  portfolioId: string;

  @ApiProperty({
    description: 'Creation time for the direct debit payment',
    type: 'string',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Reasons for the direct debit payment',
  })
  reason: string | null;
}
