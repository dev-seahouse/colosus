import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ConnectPortfolioSummaryDto as IConnectPortfolioSummaryDto } from '@bambu/shared';

export class ConnectPortfolioSummaryAssetClassAllocationItemDto
  implements
    IConnectPortfolioSummaryDto.IConnectPortfolioSummaryAssetClassAllocationItemDto
{
  @ApiProperty({
    type: 'string',
    example: 'Equity',
    description: 'An string denoting an asset class.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  assetClass: string;

  @ApiProperty({
    type: 'string',
    example: '3.5',
    description:
      'An string denoting the percentage of the portfolio in an instrument. This value is ignored with respect to the asset class if the included property is false.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  percentOfPortfolio: string;

  @ApiProperty({
    type: 'boolean',
    example: true,
    description:
      'Whether or count percentOfPortfolio denotes the percent of the asset class in the portfolio, or if 0 percent of this asset class is in the portfolio.',
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  included: boolean;
}
