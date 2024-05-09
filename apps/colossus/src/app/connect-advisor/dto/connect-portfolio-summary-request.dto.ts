import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ConnectPortfolioSummaryDto as IConnectPortfolioSummaryDto } from '@bambu/shared';
import { ConnectPortfolioSummaryAssetClassAllocationItemDto } from './connect-portfolio-summary-asset-class-allocation.dto';
import { Type } from 'class-transformer';

export class ConnectPortfolioSummaryRequestDto
  implements
    Omit<IConnectPortfolioSummaryDto.IConnectPortfolioSummaryDto, 'reviewed'>
{
  @ApiProperty({
    type: 'string',
    example: 'MODERATE',
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
      'A boolean denoting whether to show the expected return and volatility in the investor journey.',
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  showSummaryStatistics: boolean;

  @ApiProperty({
    type: [ConnectPortfolioSummaryAssetClassAllocationItemDto],
    description:
      'An object denoting the asset class allocation of the portfolio.',
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @Type(() => ConnectPortfolioSummaryAssetClassAllocationItemDto)
  @ValidateNested({ each: true })
  assetClassAllocation: ConnectPortfolioSummaryAssetClassAllocationItemDto[];

  @ApiProperty({
    type: 'string',
    description: 'Risk Profile Id',
  })
  riskProfileId: string;
}
