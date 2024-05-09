import { ApiProperty } from '@nestjs/swagger';

import { IBambuApiLibraryGetCountryRatesResponseDto } from '@bambu/shared';

export class BambuApiLibraryGetCountryRatesResponseDto
  implements IBambuApiLibraryGetCountryRatesResponseDto
{
  @ApiProperty({
    type: 'integer',
    example: 142,
  })
  id: number;

  @ApiProperty({
    description: '2 Character Country identifier (Alpha-2).',
    type: 'string',
    example: 'US',
  })
  countryCode: string;

  @ApiProperty({
    type: 'number',
    format: 'double',
    example: 0.0132,
    description: 'Anticipated inflation rate for short term.',
  })
  inflationRateShortTerm: number;

  @ApiProperty({
    type: 'number',
    format: 'double',
    example: 0.0132,
    description: 'Anticipated inflation rate for long term.',
  })
  inflationRateLongTerm: number;

  @ApiProperty({
    type: 'number',
    format: 'double',
    example: 0.02,
  })
  savingsAccountInterestRate: number;

  @ApiProperty({
    type: 'integer',
    example: 66,
    description: 'Average retirement age for male.',
  })
  retirementAgeMale: number;

  @ApiProperty({
    type: 'integer',
    example: 66,
    description: 'Average retirement age for female.',
  })
  retirementAgeFemale: number;

  @ApiProperty({
    type: 'integer',
    example: 76,
    description: 'Average life expectancy for male.',
  })
  lifeExpectancyMale: number;

  @ApiProperty({
    type: 'integer',
    example: 81,
    description: 'Average life expectancy for female.',
  })
  lifeExpectancyFemale: number;

  @ApiProperty({
    type: 'number',
    format: 'double',
    example: 0.0024,
  })
  annualWageGrowthShortTerm: number;

  @ApiProperty({
    type: 'number',
    format: 'double',
    example: 0.0024,
  })
  annualWageGrowthLongTerm: number;

  @ApiProperty({
    type: 'number',
    format: 'double',
    example: 0.081,
  })
  averageSavingsRate: number;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2019-02-17T21:55:33.000Z',
    description: 'Last updated date.',
  })
  dateCreated: string;
}
