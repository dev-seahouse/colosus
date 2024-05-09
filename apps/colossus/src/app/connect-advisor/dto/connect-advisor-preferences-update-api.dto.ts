import { ConnectAdvisorDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ConnectAdvisorPreferencesUpdateApiDto
  implements ConnectAdvisorDto.IConnectAdvisorPreferencesUpdateApiDto
{
  @ApiProperty({
    type: 'number',
    format: 'double',
    description: 'The minimum annual income threshold for the advisor.',
    nullable: false,
    required: true,
    example: 100000,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  minimumAnnualIncomeThreshold: number;

  @ApiProperty({
    type: 'number',
    format: 'double',
    description: 'The minimum retirement savings threshold for the advisor.',
    nullable: false,
    required: true,
    example: 200000,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  minimumRetirementSavingsThreshold: number;
}
