import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';
import { BrokerageUkDirectDebitPaymentAmountDto } from './brokerage-uk-direct-debit-payment-amount.dto';

export class ColossusUkDirectDebitPaymentRequestDto
  implements
    Omit<
      BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentMutableDto,
      'portfolioId'
    >
{
  @ApiProperty({
    description: 'The amount of money to be transferred.',
    type: BrokerageUkDirectDebitPaymentAmountDto,
  })
  amount: BrokerageUkDirectDebitPaymentAmountDto;

  @ApiProperty({
    description: 'The mandate ID.',
    example: 'ddm-123456789',
    type: 'string',
  })
  mandateId: string;

  @ApiProperty({
    description: 'The goal ID to which the payment is being made.',
    example: 'f254692e-900a-412f-a000-155e4117c346',
    type: 'string',
    format: 'uuid',
  })
  goalId: string;

  @ApiProperty({
    description:
      'The date on which the payment should be collected. This is optional and will be auto populated later. If you need to put one manually, call http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_GetNextPossiblePaymentDate for the date.',
    example: '2021-01-01',
    type: 'string',
    format: 'date',
    required: false,
  })
  collectionDate?: string;
}
