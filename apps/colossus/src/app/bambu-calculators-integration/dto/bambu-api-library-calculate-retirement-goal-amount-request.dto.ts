import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  ValidateNested,
  IsInt,
  IsNumber,
  IsEnum,
  IsObject,
  Min,
  IsBoolean,
  IsString,
  IsOptional,
  IsAlpha,
  Length,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ClassTransformerUtils } from '@bambu/server-core/utilities';

import {
  IBambuApiLibraryCalculateRetirementGoalAmountRequestDto,
  EnumBambuApiLibraryCalculateRetirementGoalAmountRequestGender,
  EnumBambuApiLibraryCalculateRetirementGoalAmountRequestPeriod,
  IBambuApiLibraryCalculateRetirementGoalAmountRequestAdditionalSourceDto,
} from '@bambu/shared';

export class BambuApiLibraryCalculateRetirementGoalAmountRequestAdditionalSourceDto
  implements
    IBambuApiLibraryCalculateRetirementGoalAmountRequestAdditionalSourceDto
{
  @ApiProperty({
    type: 'number',
    description:
      'The amount of savings for retirement. This parameter assumes a lump-sum amount.',
    required: true,
    example: 10000,
  })
  @IsNotEmpty()
  @IsNumber()
  retirementSavings: number;

  @ApiProperty({
    type: 'number',
    description: 'Government-guaranteed monthly retirement income.',
    required: true,
    example: 800,
  })
  @IsNotEmpty()
  @IsNumber()
  socialSecurityBenefit: number;

  @ApiProperty({
    type: 'number',
    description: 'Monthly retirement income from employer.',
    required: true,
    example: 1000,
  })
  @IsNotEmpty()
  @IsNumber()
  pension: number;

  @ApiProperty({
    type: 'number',
    format: 'double',
    description:
      'Cost of Living Adjustment Rate (COLA) is an increase in Social Security benefits to counteract inflation.',
    required: true,
    example: 0.024,
  })
  @IsNotEmpty()
  @IsNumber()
  colaRate: number;
}

export class BambuApiLibraryCalculateRetirementGoalAmountRequestDto
  implements IBambuApiLibraryCalculateRetirementGoalAmountRequestDto
{
  @ApiProperty({
    type: 'number',
    format: 'float',
    description: 'Annual retirement income.',
    example: 95106.6,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  annualRetirementIncome: number;

  @ApiProperty({
    type: 'integer',
    description: 'Current age.',
    example: 50,
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  age: number;

  @ApiProperty({
    type: 'integer',
    description: 'Retirement age of user.',
    example: 62,
  })
  @IsNotEmpty()
  @IsInt()
  retirementAge: number;

  @ApiProperty({
    enum: EnumBambuApiLibraryCalculateRetirementGoalAmountRequestGender,
    example: EnumBambuApiLibraryCalculateRetirementGoalAmountRequestGender.MALE,
    description: 'Gender of user.',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(EnumBambuApiLibraryCalculateRetirementGoalAmountRequestGender)
  gender: EnumBambuApiLibraryCalculateRetirementGoalAmountRequestGender;

  @ApiProperty({
    type: 'integer',
    description: 'Male life expectancy.',
    example: 81,
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  lifeExpectancyMale: number;

  @ApiProperty({
    type: 'integer',
    description: 'Female life expectancy.',
    example: 86,
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  lifeExpectancyFemale: number;

  @ApiProperty({
    type: 'number',
    format: 'double',
    description: 'Annualised Saving Account Interest Rate.',
    example: 0.02,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  annualisedSavingsAcctIntR: number;

  @ApiProperty({
    type: 'number',
    format: 'double',
    description: 'Annualized Inflation Rate.',
    example: 0.017,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  annualisedInflationRate: number;

  @ApiProperty({
    type: 'integer',
    description:
      'Numbers of compounds per-year. The number of compounds per year by default to be hardcoded to 1 in the FE. The reason for the CompoundsPeryear field is to convert the interest rate value (Annual Percentage Rate) to the Effective Annual Rate. For more information - https://www.fool.com/knowledge-center/what-are-the-differences-between-apr-ear.aspx Default: 1',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  compoundsPerYear: number;

  @ApiProperty({
    enum: EnumBambuApiLibraryCalculateRetirementGoalAmountRequestPeriod,
    example: EnumBambuApiLibraryCalculateRetirementGoalAmountRequestPeriod.END,
    description:
      "Period can be either of the 2 values only 'beg' or 'end'. 'beg' assumes the first cash infusion starts at the beginning of the first period. 'end' assumes the first cash infusion starts at the ending of the first period. Default : end.",
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(EnumBambuApiLibraryCalculateRetirementGoalAmountRequestPeriod)
  period: EnumBambuApiLibraryCalculateRetirementGoalAmountRequestPeriod;

  @ApiProperty({
    type: 'string',
    example: 'US',
    description: `Target country's Alpha-2 code.`,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  @Length(2)
  country: string;

  @ApiProperty({
    type: BambuApiLibraryCalculateRetirementGoalAmountRequestAdditionalSourceDto,
    description:
      'Capture additional source of income that can contribute to retirement. AdditionalSource field is only applicable for country: “US”. It is In Progress for other country',
    required: true,
    example: {
      retirementSavings: 10000,
      socialSecurityBenefit: 1500,
      pension: 1000,
      colaRate: 0.024,
    },
  })
  @IsObject()
  @IsOptional()
  @Type(
    () => BambuApiLibraryCalculateRetirementGoalAmountRequestAdditionalSourceDto
  )
  @ValidateNested()
  additionalSource?: BambuApiLibraryCalculateRetirementGoalAmountRequestAdditionalSourceDto;

  @ApiProperty({
    type: 'boolean',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(ClassTransformerUtils.ForceActualValueForBooleanField)
  calculateTax?: boolean;
}
