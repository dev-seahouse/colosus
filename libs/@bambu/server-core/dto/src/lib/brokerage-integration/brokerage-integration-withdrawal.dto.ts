import { IBrokerageIntegrationWithdrawalDto, SharedEnums } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { BrokerageIntegrationWithdrawalSharedDto } from './brokerage-integration-withdrawal-shared.dto';

export class BrokerageIntegrationWithdrawalDto
  extends BrokerageIntegrationWithdrawalSharedDto
  implements IBrokerageIntegrationWithdrawalDto
{
  @ApiProperty({
    description: 'Unique identifier of the withdrawal.',
    type: 'string',
  })
  id: string;

  @ApiProperty({
    description: 'Reason for the withdrawal.',
    type: 'string',
    required: false,
    nullable: true,
    example: null,
  })
  reason: string | null = null;

  @ApiProperty({
    description: 'Date and time the withdrawal was requested.',
    type: 'string',
    required: true,
    example: '2021-04-01T12:00:00.000Z',
  })
  requestedAt: Date | string;

  @ApiProperty({
    description: 'Status of the withdrawal.',
    enum: SharedEnums.BrokerageIntegrationWithdrawalStatusEnum,
    required: true,
    type: 'string',
    example: SharedEnums.BrokerageIntegrationWithdrawalStatusEnum.PENDING,
  })
  status: SharedEnums.BrokerageIntegrationWithdrawalStatusEnum;
}
