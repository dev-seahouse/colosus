import { ITenantTransactBrokerageDto, SharedEnums } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';

export class TenantTransactBrokerageDto implements ITenantTransactBrokerageDto {
  @ApiProperty({
    type: 'string',
    enum: SharedEnums.SupportedBrokerageIntegrationEnum,
    example: SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL,
  })
  brokerage: SharedEnums.SupportedBrokerageIntegrationEnum;

  @ApiProperty({
    type: 'string',
    example: 'UK',
    description: 'Country code.',
  })
  country: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2021-01-01T00:00:00.000Z',
    description: 'Created at.',
  })
  createdAt?: Date | string;

  @ApiProperty({
    type: 'string',
    example: 'John Doe',
    description: 'Created by.',
  })
  createdBy?: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '00000000-0000-0000-0000-000000000000',
    description: 'Tenant ID.',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    example: 'London',
    description: 'Region.',
    nullable: true,
    required: false,
  })
  region?: string | null = null;

  @ApiProperty({
    type: 'string',
    enum: SharedEnums.TenantTransactBrokerageStatusEnum,
    example: SharedEnums.TenantTransactBrokerageStatusEnum.PENDING,
    description: 'The status of the brokerage integration.',
    nullable: true,
    required: false,
  })
  status?: SharedEnums.TenantTransactBrokerageStatusEnum | null = null;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '00000000-0000-0000-0000-000000000000',
    description: 'Tenant ID.',
  })
  tenantId: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2021-01-01T00:00:00.000Z',
    description: 'Updated at.',
  })
  updatedAt?: Date | string;

  @ApiProperty({
    type: 'string',
    example: 'John Doe',
    description: 'Updated by.',
  })
  updatedBy?: string;
}
