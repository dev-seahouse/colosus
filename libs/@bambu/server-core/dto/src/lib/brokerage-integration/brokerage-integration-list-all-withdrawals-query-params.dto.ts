import { IBrokerageIntegrationListAllWithdrawalsQueryParamsDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { BrokerageIntegrationListAllWithdrawalsQueryParamsCommonDto } from './brokerage-integration-list-all-withdrawals-query-params-common.dto';

export class BrokerageIntegrationListAllWithdrawalsQueryParamsDto
  extends BrokerageIntegrationListAllWithdrawalsQueryParamsCommonDto
  implements IBrokerageIntegrationListAllWithdrawalsQueryParamsDto
{
  @ApiProperty({
    description:
      'Unique identifier of the portfolio the withdrawal belongs to.',
    type: 'string',
    required: false,
    minLength: 1,
    example: 'prt-32q2deogu225ps',
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(50)
  portfolioId?: string;
}
