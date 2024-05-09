import { IBrokerageIntegrationListAllWithdrawalsQueryResponseDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { BrokerageIntegrationWithdrawalDto } from './brokerage-integration-withdrawal.dto';

export class BrokerageIntegrationListAllWithdrawalsQueryResponseDto
  implements IBrokerageIntegrationListAllWithdrawalsQueryResponseDto
{
  @ApiProperty({
    description: 'Token to be used to fetch the next page of results.',
    type: 'string',
    required: false,
    nullable: true,
    example: null,
  })
  paginationToken: string | null = null;

  @ApiProperty({
    description: 'List of withdrawals.',
    type: BrokerageIntegrationWithdrawalDto,
    isArray: true,
    required: true,
    example: [
      {
        type: 'SpecifiedAmount',
        portfolioId: 'prt-32q2deogu225ps',
        bankAccountId: 'bac-32q2dek3j263q4',
        consideration: {
          currency: 'GBP',
          amount: 100,
        },
        paidOut: {
          currency: 'GBP',
          amount: 100,
        },
        reference: '32Q2DEOGU225PS',
        status: 'Settled',
        reason: null,
        requestedAt: '2019-10-08T13:55:16.4237925Z',
        id: 'wth-32qm6qal5225qe',
      },
    ],
  })
  results: BrokerageIntegrationWithdrawalDto[];
}
