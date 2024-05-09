import { IGoalDetailedConnectPortfolioSummaryDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import {
  ConnectAdvisorRiskProfileResponseDto,
  ConnectPortfolioSummaryAssetClassAllocationItemDto,
} from '../../connect-advisor/dto';
import { GetModelPortfolioByIdResponseDto } from './get-model-portfolio-by-id-response.dto';

export class GoalDetailedConnectPortfolioSummaryDto
  implements IGoalDetailedConnectPortfolioSummaryDto
{
  @ApiProperty({
    type: ConnectAdvisorRiskProfileResponseDto,
  })
  RiskProfile: ConnectAdvisorRiskProfileResponseDto;
  @ApiProperty({
    type: GetModelPortfolioByIdResponseDto,
    isArray: true,
    nullable: true,
  })
  TransactModelPortfolios?: GetModelPortfolioByIdResponseDto[] | null;

  @ApiProperty({
    type: ConnectPortfolioSummaryAssetClassAllocationItemDto,
    isArray: true,
    nullable: true,
  })
  assetClassAllocation: ConnectPortfolioSummaryAssetClassAllocationItemDto[];

  @ApiProperty({
    type: 'string',
  })
  description: string;

  @ApiProperty({
    type: 'string',
  })
  expectedReturnPercent: string;

  @ApiProperty({
    type: 'string',
  })
  expectedVolatilityPercent: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  id?: string | null;

  @ApiProperty({
    type: 'string',
  })
  key: string;

  @ApiProperty({
    type: 'string',
  })
  name: string;

  @ApiProperty({
    type: 'boolean',
  })
  reviewed: boolean;

  @ApiProperty({
    type: 'string',
  })
  risk_profile_id: string;

  @ApiProperty({
    type: 'boolean',
  })
  showSummaryStatistics: boolean;

  @ApiProperty({
    type: 'string',
  })
  tenantId: string;

  @ApiProperty({
    type: 'number',
  })
  sortKey: number;
}
