import { IBrokerageIntegrationWithdrawalMutableSharedDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { BrokerageIntegrationWithdrawalSharedDto } from './brokerage-integration-withdrawal-shared.dto';

export class BrokerageIntegrationWithdrawalMutableSharedDto
  extends BrokerageIntegrationWithdrawalSharedDto
  implements IBrokerageIntegrationWithdrawalMutableSharedDto
{
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @ApiProperty({
    type: 'boolean',
    required: true,
    description: 'Whether the withdrawal should close the portfolio.',
    default: false,
    example: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  closePortfolio: boolean = false;
}
