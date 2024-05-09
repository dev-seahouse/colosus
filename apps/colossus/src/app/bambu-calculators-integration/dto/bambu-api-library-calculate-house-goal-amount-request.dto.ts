import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsInt,
  IsString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { IBambuApiLibraryCalculateHouseGoalAmountRequestDto } from '@bambu/shared';

export class BambuApiLibraryCalculateHouseGoalAmountRequestDto
  implements IBambuApiLibraryCalculateHouseGoalAmountRequestDto
{
  @ApiProperty({
    type: 'integer',
    example: 2021,
    description:
      'The year during which the initial payment was made for buying the house.',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  downPaymentYear: number;

  @ApiProperty({
    type: 'string',
    example: 'Indonesia',
    description: 'Country where the house is located.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    type: 'string',
    example: 'West Java',
    description: 'A region in the specific country where the house is located.',
    required: false,
  })
  @IsString()
  @IsOptional()
  region: string;

  @ApiProperty({
    type: 'string',
    example: 'Bandung',
    description: 'City in the specific country where the house is located.',
    required: false,
  })
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({
    type: 'string',
    example: 'Bedok',
    description: 'Location in the specific city where the house is located.',
    required: false,
  })
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty({
    type: 'string',
    example: '9',
    description:
      'District in the specific city, country where the house is located.',
    required: false,
  })
  @IsString()
  @IsOptional()
  district: string;

  @ApiProperty({
    type: 'string',
    example: 'One Bed',
    description: 'Describes the type of houses.',
    required: false,
  })
  @IsString()
  @IsOptional()
  houseType: string;

  @ApiProperty({
    type: 'string',
    example: 'Executive',
    description: 'Describes the type of rooms/number of rooms.',
    required: false,
  })
  @IsString()
  @IsOptional()
  roomType: string;

  @ApiProperty({
    type: 'number',
    format: 'float',
    required: true,
    example: 0.3,
    description: 'Percentage of down payment.',
  })
  @IsNumber()
  @IsNotEmpty()
  downPaymentPct: number;

  @ApiProperty({
    type: 'number',
    format: 'float',
    required: true,
    example: 0.05,
    description: 'Inflation rate.',
  })
  @IsNumber()
  @IsNotEmpty()
  inflationRate: number;

  @ApiProperty({
    type: 'number',
    required: true,
    example: 2019,
    description: 'The year to date.',
  })
  @IsNumber()
  @IsNotEmpty()
  currentYear: number;
}
