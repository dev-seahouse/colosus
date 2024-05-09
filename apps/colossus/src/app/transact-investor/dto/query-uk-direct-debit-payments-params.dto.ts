import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryUkDirectDebitPaymentsParamsDto
  extends BrokerageIntegrationServerDto.BrokerageIntegrationListAllQueryParamsBaseDto
  implements
    BrokerageIntegrationServerDto.IBrokerageIntegrationListAllQueryParamsBaseDto
{
  @ApiProperty({
    description: 'The mandate ID.',
    example: 'ddm-36hfb36et242h4',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  mandateId?: string;

  @ApiProperty({
    description: 'The goal ID.',
    example: '673e9e72-1276-4d92-8100-da4fed0af734',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  goalId?: string;
}
