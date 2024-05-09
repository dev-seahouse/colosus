import {
  IBrokerageIntegrationListAllWithdrawalsQueryParamsCommonDto,
  SharedEnums,
} from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BrokerageIntegrationListAllQueryParamsBaseDto } from './brokerage-integration-list-all-query-params-base.dto';

export class BrokerageIntegrationListAllWithdrawalsQueryParamsCommonDto
  extends BrokerageIntegrationListAllQueryParamsBaseDto
  implements IBrokerageIntegrationListAllWithdrawalsQueryParamsCommonDto
{
  @ApiProperty({
    description:
      "Reference that will accompany the withdrawal. Due to external providers' limitations, the reference will be truncated if length is greater than 16 characters.",
    type: 'string',
    required: false,
    example: '9394967',
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(16)
  reference?: string;

  @ApiProperty({
    description: 'Status of the withdrawal.',
    enum: SharedEnums.BrokerageIntegrationWithdrawalStatusEnum,
    required: false,
    type: 'string',
    example: SharedEnums.BrokerageIntegrationWithdrawalStatusEnum.PENDING,
  })
  @IsOptional()
  @IsEnum(SharedEnums.BrokerageIntegrationWithdrawalStatusEnum)
  status?: SharedEnums.BrokerageIntegrationWithdrawalStatusEnum;

  @ApiProperty({
    description: 'Type of withdrawal.',
    enum: SharedEnums.BrokerageIntegrationWithdrawalTypeEnum,
    required: false,
    type: 'string',
    example: SharedEnums.BrokerageIntegrationWithdrawalTypeEnum.SpecifiedAmount,
  })
  @IsOptional()
  @IsEnum(SharedEnums.BrokerageIntegrationWithdrawalTypeEnum)
  type?: SharedEnums.BrokerageIntegrationWithdrawalTypeEnum;
}
