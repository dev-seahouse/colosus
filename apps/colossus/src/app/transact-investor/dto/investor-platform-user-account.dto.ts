import { IInvestorPlatformUserAccountDto, SharedEnums } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';

export class InvestorPlatformUserAccountDto
  implements IInvestorPlatformUserAccountDto
{
  @ApiProperty({
    type: 'string',
    enum: SharedEnums.SupportedBrokerageIntegrationEnum,
  })
  brokerage: SharedEnums.SupportedBrokerageIntegrationEnum;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    type: 'string',
  })
  createdBy: string;

  @ApiProperty({
    type: 'object',
    nullable: true,
  })
  data: Record<string, unknown> | null;

  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  investorPlatformUserId: string;

  @ApiProperty({
    type: 'string',
  })
  partnerAccountId: string;

  @ApiProperty({
    type: 'string',
  })
  partnerAccountNumber: string;

  @ApiProperty({
    type: 'string',
  })
  partnerAccountType: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;

  @ApiProperty({
    type: 'string',
  })
  updatedBy: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  partnerAccountStatus?: string | null = null;
}
