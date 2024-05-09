import { IColossusListAllWithdrawalsQueryParamsDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BrokerageIntegrationListAllWithdrawalsQueryParamsCommonDto } from './brokerage-integration-list-all-withdrawals-query-params-common.dto';

export class ColossusListAllWithdrawalsQueryParamsDto
  extends BrokerageIntegrationListAllWithdrawalsQueryParamsCommonDto
  implements IColossusListAllWithdrawalsQueryParamsDto
{
  @ApiProperty({
    description: 'Unique identifier of the goal the withdrawal belongs to.',
    type: 'string',
    format: 'uuid',
    required: true,
    minLength: 1,
    example: '673e9e72-1276-4d92-8100-da4fed0af734',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  goalId: string;
}
