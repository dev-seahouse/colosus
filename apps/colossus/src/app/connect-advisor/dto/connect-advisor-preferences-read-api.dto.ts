import { ConnectAdvisorDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectAdvisorPreferencesReadApiDto
  implements ConnectAdvisorDto.IConnectAdvisorPreferencesReadApiDto
{
  @ApiProperty({
    type: 'number',
    format: 'double',
    description: 'The minimum annual income threshold for the advisor.',
    nullable: true,
  })
  minimumAnnualIncomeThreshold: number | null;

  @ApiProperty({
    type: 'number',
    format: 'double',
    description: 'The minimum retirement savings threshold for the advisor.',
    nullable: true,
  })
  minimumRetirementSavingsThreshold: number | null;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'The date and time the preferences were created.',
  })
  createdAt?: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'The date and time the preferences were last updated.',
  })
  updatedAt?: Date;
}
