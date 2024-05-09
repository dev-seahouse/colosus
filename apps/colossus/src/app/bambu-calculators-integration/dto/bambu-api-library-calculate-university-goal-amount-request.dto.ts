import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsInt,
  IsString,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import {
  IBambuApiLibraryCalculateUniversityGoalAmountRequestDto,
  EnumBambuApiLibraryCalculateUniversityGoalAmountRequestUniversityType,
  EnumBambuApiLibraryCalculateUniversityGoalAmountRequestSpecialisation,
} from '@bambu/shared';

export class BambuApiLibraryCalculateUniversityGoalAmountRequestDto
  implements IBambuApiLibraryCalculateUniversityGoalAmountRequestDto
{
  @ApiProperty({
    type: 'integer',
    example: 16,
    description: 'Current age.',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  age: number;

  @ApiProperty({
    type: 'integer',
    example: 18,
    description: 'Age to enter university.',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  ageOfUni: number;

  @ApiProperty({
    type: 'integer',
    example: 24,
    description: 'Maximum number of years to achieve the goal.',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  maxGoalYear: number;

  @ApiProperty({
    enum: EnumBambuApiLibraryCalculateUniversityGoalAmountRequestUniversityType,
    example:
      EnumBambuApiLibraryCalculateUniversityGoalAmountRequestUniversityType.PUBLIC,
    description: 'Type of university.',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(EnumBambuApiLibraryCalculateUniversityGoalAmountRequestUniversityType)
  universityType: EnumBambuApiLibraryCalculateUniversityGoalAmountRequestUniversityType;

  @ApiProperty({
    enum: EnumBambuApiLibraryCalculateUniversityGoalAmountRequestSpecialisation,
    example:
      EnumBambuApiLibraryCalculateUniversityGoalAmountRequestSpecialisation.GENERAL,
    description: 'Specialization of education.',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(EnumBambuApiLibraryCalculateUniversityGoalAmountRequestSpecialisation)
  specialisation: EnumBambuApiLibraryCalculateUniversityGoalAmountRequestSpecialisation;

  @ApiProperty({
    type: 'string',
    example: 'US',
    required: true,
    description: 'The desired country for university education.',
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    type: 'number',
    format: 'float',
    required: true,
    example: 0.03,
    minimum: 0,
    maximum: 1,
    description:
      'Based on the long term inflation rate of a specific country. 1 = 100%, 0.01 = 1%.',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1)
  inflationRate: number;

  @ApiProperty({
    type: 'integer',
    example: 2018,
    required: true,
    description: 'The year to date.',
  })
  @IsNotEmpty()
  @IsNumber()
  currentYear: number;

  @ApiProperty({
    type: 'string',
    example: 'Delaware',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({
    type: 'string',
    example: 'instate',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  residencyType: string;
}
