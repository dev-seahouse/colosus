import { ApiProperty } from '@nestjs/swagger';

import { IBambuApiLibraryCalculateUniversityGoalAmountResponseDto } from '@bambu/shared';

export class BambuApiLibraryCalculateUniversityGoalAmountResponseDto
  implements IBambuApiLibraryCalculateUniversityGoalAmountResponseDto
{
  @ApiProperty({
    type: 'integer',
    example: 2020,
    description: 'Year of goal attainment.',
  })
  goalYear: number;

  @ApiProperty({
    type: 'integer',
    example: 2,
    description: 'Number of years remaining to reach goal.',
  })
  yearsToGoal: number;

  @ApiProperty({
    type: 'integer',
    example: 8,
    description: 'Maximum number of years to reach goal by.',
  })
  maxYearsToGoal: number;

  @ApiProperty({
    type: 'integer',
    example: 155502,
    description: 'Total cost of university education adjusted to inflation.',
  })
  educationCost: number;

  @ApiProperty({
    type: 'integer',
    example: 146576,
    description: 'Cost of university education before adjusting to inflation.',
  })
  universityCost: number;

  @ApiProperty({
    type: 'string',
    example: 'USD',
    description: 'The currency of education cost.',
  })
  currency: string;
}
