import {
  IBrokerageIntegrationWithdrawalSharedDto,
  SharedEnums,
} from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { BrokerageIntegrationMoneyDto } from './brokerage-integration-money.dto';

export class BrokerageIntegrationWithdrawalSharedDto
  implements IBrokerageIntegrationWithdrawalSharedDto
{
  @ApiProperty({
    type: 'string',
    required: true,
    minLength: 1,
    description:
      'Unique identifier of the portfolio the withdrawal belongs to.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  bankAccountId: string;

  @ApiProperty({
    type: BrokerageIntegrationMoneyDto,
    required: true,
    description: 'Amount to withdraw.',
  })
  @ValidateNested()
  @Type(() => BrokerageIntegrationMoneyDto)
  consideration: BrokerageIntegrationMoneyDto;

  @ApiProperty({
    description:
      "Reference that will accompany the withdrawal. Due to external providers' limitations, the reference will be truncated if length is greater than 16 characters.",
    type: 'string',
    required: false,
    nullable: true,
    example: '9394967',
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(16)
  reference?: string | null = null;

  @ApiProperty({
    description: 'Type of withdrawal.',
    enum: SharedEnums.BrokerageIntegrationWithdrawalTypeEnum,
    required: true,
    type: 'string',
    example: SharedEnums.BrokerageIntegrationWithdrawalTypeEnum.SpecifiedAmount,
  })
  @IsNotEmpty()
  @IsEnum(SharedEnums.BrokerageIntegrationWithdrawalTypeEnum)
  type: SharedEnums.BrokerageIntegrationWithdrawalTypeEnum;
}
