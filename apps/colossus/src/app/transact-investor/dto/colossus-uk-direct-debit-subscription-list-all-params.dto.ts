import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ColossusUkDirectDebitSubscriptionListAllParamsDto
  extends BrokerageIntegrationServerDto.BrokerageIntegrationListAllQueryParamsBaseDto
  implements
    Omit<
      BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto,
      'portfolioId'
    >
{
  @ApiProperty({
    type: 'string',
    description: 'Mandate ID to filter',
    required: false,
  })
  @IsString()
  @IsOptional()
  mandateId?: string;

  @ApiProperty({
    type: 'string',
    description: 'Goal ID to filter',
    required: false,
  })
  @IsString()
  @IsOptional()
  goalId?: string;

  @ApiProperty({
    description: 'Status',
    enum: BrokerageIntegrationServerDto.BrokerageUkDirectDebitSubscriptionStatusEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(
    BrokerageIntegrationServerDto.BrokerageUkDirectDebitSubscriptionStatusEnum
  )
  status?: BrokerageIntegrationServerDto.BrokerageUkDirectDebitSubscriptionStatusEnum;
}
