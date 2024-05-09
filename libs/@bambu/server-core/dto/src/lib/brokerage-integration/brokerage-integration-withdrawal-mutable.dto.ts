import { IBrokerageIntegrationWithdrawalMutableDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { BrokerageIntegrationWithdrawalMutableSharedDto } from './brokerage-integration-withdrawal-mutable-shared.dto';

export class BrokerageIntegrationWithdrawalMutableDto
  extends BrokerageIntegrationWithdrawalMutableSharedDto
  implements IBrokerageIntegrationWithdrawalMutableDto
{
  @ApiProperty({
    description:
      'Unique identifier of the portfolio the withdrawal belongs to.',
    type: 'string',
    required: true,
    minLength: 1,
    example: 'prt-32q2deogu225ps',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  portfolioId: string;
}
