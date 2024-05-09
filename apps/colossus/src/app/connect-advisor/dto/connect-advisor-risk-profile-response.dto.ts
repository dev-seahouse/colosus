import { IRiskProfileDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectAdvisorRiskProfileResponseDto implements IRiskProfileDto {
  @ApiProperty({
    type: 'string',
    example: 'dfc77d5a-f1d6-49fd-9aac-b9f0c7d7087a',
    description: 'A UUID acting as a unique identifier for the risk profile.',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    example: '1',
  })
  lowerLimit: string;

  @ApiProperty({
    type: 'string',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  upperLimit: string;

  @ApiProperty({
    type: 'string',
    example: 'Low Risk',
  })
  @IsString()
  @IsNotEmpty()
  riskProfileName: string;

  @ApiProperty({
    type: 'string',
    example:
      'You don’t want to experience volatility in your portfolio.<br/>You don’t expect the value of your portfolio to go down at any point in time.<br/>You should also understand that expected returns are very low.',
  })
  @IsString()
  @IsNotEmpty()
  riskProfileDescription: string;

  @ApiProperty({
    type: 'string',
    example: '9f0165e8-fa92-4bbf-808e-9dc7b6956970',
  })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  // @ApiProperty({
  //   type: 'string',
  //   example: '2021-02-04T15:08:59.000Z',
  //   format: 'date-time',
  // })
  // createdAt?: Date | string;
  //
  // @ApiProperty({
  //   type: 'string',
  // })
  // createdBy?: string;
  //
  // @ApiProperty({
  //   type: 'string',
  //   example: '2021-02-04T15:08:59.000Z',
  //   format: 'date-time',
  // })
  // updatedAt: Date | string;
  //
  // @ApiProperty({
  //   type: 'string',
  // })
  // updatedBy: string;
}
