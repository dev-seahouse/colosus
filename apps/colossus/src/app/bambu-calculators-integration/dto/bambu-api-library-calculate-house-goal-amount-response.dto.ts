import { ApiProperty } from '@nestjs/swagger';

import { IBambuApiLibraryCalculateHouseGoalAmountResponseDto } from '@bambu/shared';

export class BambuApiLibraryCalculateHouseGoalAmountResponseDto
  implements IBambuApiLibraryCalculateHouseGoalAmountResponseDto
{
  @ApiProperty({
    type: 'integer',
    example: 6,
    description: 'Number of years it would take to accomplish the goal.',
  })
  yearsToGoal: number;

  @ApiProperty({
    type: 'number',
    format: 'float',
    example: 297781163.32,
    description:
      "Future adjusted cost of the house calculated as per country's inflation rate.",
  })
  houseCostInflationAdj: number;

  @ApiProperty({
    type: 'string',
    example: 'USD',
    description: 'Currency in which the user buys the house.',
  })
  currency: string;

  @ApiProperty({
    type: 'number',
    format: 'float',
    example: 89334348.99,
    description: 'The initial payment which was made for buying the house.',
  })
  downPaymentAmt: number;
}
