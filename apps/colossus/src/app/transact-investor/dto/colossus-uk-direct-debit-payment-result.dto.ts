import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';

import { ColossusUkDirectDebitPaymentDto } from './colossus-uk-direct-debit-payment.dto';

export class ColossusUkDirectDebitPaymentResultDto
  implements
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllResponseDto
{
  @ApiProperty({
    type: 'string',
    description: 'A token for the position to offset from.',
    required: false,
  })
  paginationToken: string | null = null;

  @ApiProperty({
    type: ColossusUkDirectDebitPaymentDto,
    isArray: true,
    description: 'The list of direct debit payments',
  })
  results: ColossusUkDirectDebitPaymentDto[];
}
