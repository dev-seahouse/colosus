import { IColossusWithdrawalMutableDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BrokerageIntegrationWithdrawalMutableSharedDto } from './brokerage-integration-withdrawal-mutable-shared.dto';

export class ColossusWithdrawalMutableDto
  extends BrokerageIntegrationWithdrawalMutableSharedDto
  implements IColossusWithdrawalMutableDto
{
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'Unique identifier of the goal the withdrawal belongs to.',
    minLength: 1,
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  goalId: string;
}
