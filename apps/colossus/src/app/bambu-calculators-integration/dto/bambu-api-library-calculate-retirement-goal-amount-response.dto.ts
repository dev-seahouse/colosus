import { ApiProperty } from '@nestjs/swagger';

import {
  IBambuApiLibraryCalculateRetirementGoalAmountResponseRetirementAssetsDto,
  IBambuApiLibraryCalculateRetirementGoalAmountResponseDto,
} from '@bambu/shared';

export class BambuApiLibraryCalculateRetirementGoalAmountResponseRetirementAssetsDto
  implements
    IBambuApiLibraryCalculateRetirementGoalAmountResponseRetirementAssetsDto
{
  @ApiProperty({
    type: 'number',
    description:
      'Total amount of Social Security Benefits received from the start of retirement until life expectancy age.',
    example: 195415.77,
  })
  totalSocialSecurityBenefits: number;

  @ApiProperty({
    type: 'number',
    description: 'Total amount of pension received during retirement period.',
    example: 235294.11,
  })
  totalPension: number;

  @ApiProperty({
    type: 'number',
    description: 'Total amount of savings during retirement period.',
    example: 12682.42,
  })
  totalRetirementSavings: number;

  @ApiProperty({
    type: 'number',
    description: 'Summation of all assets.',
    example: 443392.3,
  })
  totalAssets: number;
}

export class BambuApiLibraryCalculateRetirementGoalAmountResponseDto
  implements IBambuApiLibraryCalculateRetirementGoalAmountResponseDto
{
  @ApiProperty({
    type: 'number',
    description: 'Target amount that user would need for the retirement goal.',
    example: 1612818,
  })
  goalAmount: number;

  @ApiProperty({
    type: 'number',
    description:
      'Total estimated amount of expenditure required to cover your whole retirement period.',
    example: 2056210.3,
  })
  totalRetirementExpenditure: number;

  @ApiProperty({
    type: 'number',
    description: 'Number of remaining working years until retirement age.',
    example: 12,
  })
  workingPeriod: number;

  @ApiProperty({
    type: 'number',
    description: 'No. of years between life expectancy and retirement age.',
    example: 20,
  })
  yearsToDecumulate: number;

  @ApiProperty({
    type: BambuApiLibraryCalculateRetirementGoalAmountResponseRetirementAssetsDto,
    description: 'List of assets that can cover your retirement.',
    example: {
      totalSocialSecurityBenefits: 195415.77,
      totalPension: 235294.11,
      totalRetirementSavings: 12682.42,
      totalAssets: 443392.3,
    },
  })
  retirementAssets: BambuApiLibraryCalculateRetirementGoalAmountResponseRetirementAssetsDto;
}
