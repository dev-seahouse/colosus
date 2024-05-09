import { IInvestorPlatformProfileInvestmentPlatformUsersDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { InvestorPlatformUserAccountDto } from './investor-platform-user-account.dto';

export class InvestorPlatformProfileInvestmentPlatformUsersDto
  implements IInvestorPlatformProfileInvestmentPlatformUsersDto
{
  @ApiProperty({
    type: InvestorPlatformUserAccountDto,
    isArray: true,
  })
  InvestorPlatformUserAccounts: InvestorPlatformUserAccountDto[];

  @ApiProperty({
    type: 'string',
  })
  applicationId: string;

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
  data: Record<string, unknown> | null = null;

  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  investorId: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;

  @ApiProperty({
    type: 'string',
  })
  updatedBy: string;
}
