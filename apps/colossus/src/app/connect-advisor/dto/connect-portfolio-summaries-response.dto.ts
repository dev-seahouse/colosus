import { ConnectPortfolioSummaryDto as IConnectPortfolioSummaryDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ConnectPortfolioSummaryAssetClassAllocationItemDto } from './connect-portfolio-summary-asset-class-allocation.dto';

export class ConnectPortfolioSummariesResponseDto
  implements IConnectPortfolioSummaryDto.IConnectPortfolioSummaryDto
{
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: 'dfc77d5a-f1d6-49fd-9aac-b9f0c7d7087a',
    description: 'A UUID acting as a unique identifier for the portfolio.',
    required: false,
  })
  id?: string | null;

  @ApiProperty({
    type: 'string',
    example: 'CONSERVATIVE',
    description:
      'A key identifying the portfolio: "CONSERVATIVE" or "MODERATE" or "AGGRESSIVE".',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({
    type: 'string',
    example: 'Conservative Portfolio',
    description: 'The advisor-definable name for the portfolio.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    example:
      'This portfolio primarily looks to preserve capital through a conservative asset allocation.',
    description: 'The advisor-definable description of the portfolio.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    type: 'string',
    example: '4',
    description:
      'A string that is a decimal number denoting the expected annual return of the portfolio.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  expectedReturnPercent: string;

  @ApiProperty({
    type: 'string',
    example: '3.5',
    description:
      'A string that is a decimal number denoting the expected volatility (standard deviation) of the portfolio.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  expectedVolatilityPercent: string;

  @ApiProperty({
    type: 'boolean',
    example: true,
    description:
      'A boolean denoting whether the advisor has reviewed and saved this portfolio summary.',
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  reviewed: boolean;

  @ApiProperty({
    type: 'boolean',
    example: true,
    description:
      'A boolean denoting whether to show the expected return and volatility in the investor journey.',
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  showSummaryStatistics: boolean;

  @ApiProperty({
    type: ConnectPortfolioSummaryAssetClassAllocationItemDto,
    isArray: true,
    description:
      'An object denoting the asset class allocation of the portfolio.',
    required: true,
  })
  @IsNotEmpty()
  @IsObject()
  assetClassAllocation: ConnectPortfolioSummaryAssetClassAllocationItemDto[];

  @ApiProperty({
    type: 'string',
    description: 'Risk profile Id',
  })
  riskProfileId: string;
}
