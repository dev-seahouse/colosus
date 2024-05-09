import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class ConnectAdvisorIncomeThresholdsDto {
  // implements IConnectAdvisorIncomeThresholdsDto
  @ApiProperty({
    type: 'number',
    example: '100000',
    description:
      'The income threshold at an above which a salaried prospect will be able to schedule a meeting with the advisor.',
    required: true,
  })
  @IsInt()
  @IsPositive()
  incomeThreshold: string;

  @ApiProperty({
    type: 'number',
    example: '100000',
    description:
      'The savings threshold at an above which a retired prospect will be able to schedule a meeting with the advisor.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  retireeSavingsThreshold: string;
}
