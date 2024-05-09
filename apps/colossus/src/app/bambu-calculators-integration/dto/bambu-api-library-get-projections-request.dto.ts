import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ClassTransformerUtils } from '@bambu/server-core/utilities';

import {
  EnumBambuApiLibraryGetProjectionsRequestCompoundingValue,
  IBambuApiLibraryGetProjectionsRequestAvailablePortfolioDto,
  IBambuApiLibraryGetProjectionsRequestDto,
  IBambuApiLibraryGetProjectionsRequestGlidePathDto,
  IBambuApiLibraryGetProjectionsRequestInputDto,
  IBambuApiLibraryGetProjectionsRequestRecommendationSelectionDto,
  IBambuApiLibraryGetProjectionsRequestShortfallRecommendationDto,
  IBambuApiLibraryGetProjectionsRequestSurplusRecommendationDto,
} from '@bambu/shared';

export class BambuApiLibraryGetProjectionsRequestAvailablePortfolioDto
  implements IBambuApiLibraryGetProjectionsRequestAvailablePortfolioDto
{
  @ApiProperty({
    description: "Discrete mean of the Model Portfolio's annual returns.",
    type: 'number',
    format: 'double',
  })
  @IsNotEmpty()
  @IsNumber()
  discreteExpectedMean: number;
  @ApiProperty({
    description:
      "Discrete standard deviation of the Model Portfolio's annual returns.",
    type: 'number',
    format: 'double',
  })
  @IsNotEmpty()
  @IsNumber()
  discreteExpectedStandardDeviation: number;

  @ApiProperty({
    description: 'ID of the Model Portfolio.',
    type: 'string',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  modelPortfolioId: string;
}

export class BambuApiLibraryGetProjectionsRequestInputDto
  implements IBambuApiLibraryGetProjectionsRequestInputDto
{
  @ApiProperty({
    description: 'Back-end fees in %. 1 = 100%, 0.01 = 1%',
    type: 'number',
    format: 'float',
    example: 0.01,
    minimum: 0,
    maximum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1)
  backEndFees: number;

  @ApiProperty({
    description: 'Compounding frequency',
    enum: EnumBambuApiLibraryGetProjectionsRequestCompoundingValue,
    example: EnumBambuApiLibraryGetProjectionsRequestCompoundingValue.MONTHLY,
  })
  @IsNotEmpty()
  @IsEnum(EnumBambuApiLibraryGetProjectionsRequestCompoundingValue)
  compounding: EnumBambuApiLibraryGetProjectionsRequestCompoundingValue;

  @ApiProperty({
    description:
      'Confidence level for computation of upper and lower band returns.',
    type: 'number',
    format: 'double',
    example: 0.8,
  })
  @IsNotEmpty()
  @IsNumber()
  confidenceInterval: number;

  @ApiProperty({
    description: 'Current portfolio total value.',
    type: 'number',
    format: 'double',
    example: 11190,
  })
  @IsNotEmpty()
  @IsNumber()
  currentWealth: number;

  @ApiProperty({
    description: 'Goal end date.',
    type: 'string',
    format: 'date',
    example: '2020-01-01',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    description: 'Front-end fees in %. 1 = 100%, 0.01 = 1%.',
    type: 'number',
    format: 'float',
    example: 0.01,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1)
  frontEndFees: number;

  @ApiProperty({
    description: 'Gross goal amount (before back-end fee).',
    type: 'number',
    format: 'float',
    example: 110000,
  })
  @IsNotEmpty()
  @IsNumber()
  grossGoalAmount: number;

  @ApiProperty({
    description: 'Gross initial investment amount (before front-end fee).',
    type: 'number',
    format: 'float',
    example: 8,
  })
  @IsNotEmpty()
  @IsNumber()
  grossInitialInvestment: number;

  @ApiProperty({
    description: 'Infusion amount on each compound date.',
    type: 'number',
    isArray: true,
    example: [10],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  infusions: number[];

  @ApiProperty({
    description: 'Annual management fees levied on returns.',
    type: 'number',
    isArray: true,
    example: [0],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  managementFees: number[];

  @ApiProperty({
    description:
      'IDs of Model Portfolios to be invested in each year. These IDs correspond the modelPortfolioId inputs in availablePortfolios section.',
    isArray: true,
    example: [13],
  })
  @IsArray()
  @ArrayMinSize(1)
  // @IsInt({ each: true })
  modelPortfolioIdList: any[];

  @ApiProperty({
    description: 'Goal start date.',
    type: 'string',
    format: 'date',
    example: '2010-01-02',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description:
      'Probability for computation of target returns in %. 1 = 100%, 0.01 = 1%.',
    type: 'number',
    format: 'float',
    example: 0.01,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1)
  targetProbability: number;
}

export class BambuApiLibraryGetProjectionsRequestShortfallRecommendationDto
  implements IBambuApiLibraryGetProjectionsRequestShortfallRecommendationDto
{
  @ApiProperty({
    description: 'To display recommendation for initial investment amount.',
    type: 'boolean',
    example: true,
  })
  @IsBoolean()
  @Transform(ClassTransformerUtils.ForceActualValueForBooleanField)
  initialInvestment: boolean;

  @ApiProperty({
    description: 'To display recommendation for constant infusion amount.',
    type: 'boolean',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(ClassTransformerUtils.ForceActualValueForBooleanField)
  constantInfusion: boolean;

  @ApiProperty({
    description: 'To display recommendation for increasing infusion amounts.',
    type: 'boolean',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(ClassTransformerUtils.ForceActualValueForBooleanField)
  dynamicIncreasingInfusion: boolean;

  @ApiProperty({
    description: 'To display recommendation for decreasing infusion amounts.',
    type: 'boolean',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(ClassTransformerUtils.ForceActualValueForBooleanField)
  dynamicDecreasingInfusion: boolean;

  @ApiProperty({
    description: 'To display goal amount achievable by end of investment.',
    type: 'boolean',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(ClassTransformerUtils.ForceActualValueForBooleanField)
  goalAmount: boolean;

  @ApiProperty({
    description: 'To display recommendation for investment end date.',
    type: 'boolean',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(ClassTransformerUtils.ForceActualValueForBooleanField)
  goalYear: boolean;
}

export class BambuApiLibraryGetProjectionsRequestGlidePathDto
  implements IBambuApiLibraryGetProjectionsRequestGlidePathDto
{
  @ApiProperty({
    description: 'To display recommendation for declining glide path.',
    type: 'boolean',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(ClassTransformerUtils.ForceActualValueForBooleanField)
  glidePath: boolean;

  @ApiProperty({
    description:
      'To apply start and end dates for which glide path should happen.',
    type: 'boolean',
    example: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(ClassTransformerUtils.ForceActualValueForBooleanField)
  portfolioDerisking: boolean;

  @ApiProperty({
    description: 'Glide path start date.',
    type: 'string',
    format: 'date',
    example: '2015-01-02',
  })
  @IsNotEmpty()
  @IsDateString()
  deriskStartDate: string;

  @ApiProperty({
    description: 'Glide path end date.',
    type: 'string',
    format: 'date',
    example: '2019-01-03',
  })
  @IsNotEmpty()
  @IsDateString()
  deriskEndDate: string;
}

export class BambuApiLibraryGetProjectionsRequestSurplusRecommendationDto
  implements IBambuApiLibraryGetProjectionsRequestSurplusRecommendationDto
{
  @ApiProperty({
    description: 'Settings for declining glide path recommendation.',
    type: BambuApiLibraryGetProjectionsRequestGlidePathDto,
    example: {
      glidePath: true,
      portfolioDerisking: false,
      deriskStartDate: '2015-01-02',
      deriskEndDate: '2019-01-03',
    },
  })
  @IsObject()
  @IsNotEmptyObject()
  @IsDefined()
  @Type(() => BambuApiLibraryGetProjectionsRequestGlidePathDto)
  @ValidateNested()
  glidePath: BambuApiLibraryGetProjectionsRequestGlidePathDto;
}

export class BambuApiLibraryGetProjectionsRequestRecommendationSelectionDto
  implements IBambuApiLibraryGetProjectionsRequestRecommendationSelectionDto
{
  @ApiProperty({
    description:
      'Selection of recommendations to be displayed if there is a shortfall in investment to achieve goal.',
    type: BambuApiLibraryGetProjectionsRequestShortfallRecommendationDto,
    example: {
      initialInvestment: true,
      constantInfusion: true,
      dynamicIncreasingInfusion: true,
      dynamicDecreasingInfusion: true,
      goalAmount: true,
      goalYear: true,
    },
  })
  @IsObject()
  @IsNotEmptyObject()
  @IsDefined()
  @Type(() => BambuApiLibraryGetProjectionsRequestShortfallRecommendationDto)
  @ValidateNested()
  shortfallRecommendation: BambuApiLibraryGetProjectionsRequestShortfallRecommendationDto;

  @ApiProperty({
    description:
      'Selection of recommendations to be displayed if there is a surplus in investment to achieve goal.',
    type: BambuApiLibraryGetProjectionsRequestSurplusRecommendationDto,
    example: {
      glidePath: {
        glidePath: true,
        portfolioDerisking: false,
        deriskStartDate: '2015-01-02',
        deriskEndDate: '2019-01-03',
      },
    },
  })
  @IsObject()
  @IsNotEmptyObject()
  @IsDefined()
  @Type(() => BambuApiLibraryGetProjectionsRequestSurplusRecommendationDto)
  @ValidateNested()
  surplusRecommendation: BambuApiLibraryGetProjectionsRequestSurplusRecommendationDto;
}

export class BambuApiLibraryGetProjectionsRequestDto
  implements IBambuApiLibraryGetProjectionsRequestDto
{
  @ApiProperty({
    description: 'Details of all Model Portfolios suitable for the client.',
    name: 'availablePortfolios',
    type: BambuApiLibraryGetProjectionsRequestAvailablePortfolioDto,
    isArray: true,
    example: [
      {
        // modelPortfolioId: 4,
        modelPortfolioId: '618512c8-9ea8-4027-8251-6549172c941c',
        discreteExpectedMean: 0.03,
        discreteExpectedStandardDeviation: 0.05,
      },
      {
        // modelPortfolioId: 11,
        modelPortfolioId: '1f0362f0-c925-428c-b9ae-783818e0bc7f',
        discreteExpectedMean: 0.05,
        discreteExpectedStandardDeviation: 0.06,
      },
      {
        // modelPortfolioId: 12,
        modelPortfolioId: 'd510d32a-2d2d-45fb-a373-5486670f0b45',
        discreteExpectedMean: 0.06,
        discreteExpectedStandardDeviation: 0.07,
      },
      {
        // modelPortfolioId: 13,
        modelPortfolioId: '43bb0028-4aee-489b-8d48-fb0637984530',
        discreteExpectedMean: 0.08,
        discreteExpectedStandardDeviation: 0.1,
      },
      {
        // modelPortfolioId: 14,
        modelPortfolioId: 'bd97ff27-b067-4c1c-8c39-52d495adf96c',
        discreteExpectedMean: 0.12,
        discreteExpectedStandardDeviation: 0.16,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => BambuApiLibraryGetProjectionsRequestAvailablePortfolioDto)
  availablePortfolios: BambuApiLibraryGetProjectionsRequestAvailablePortfolioDto[];

  @ApiProperty({
    description: 'Projection computation input.',
    name: 'inputs',
    type: BambuApiLibraryGetProjectionsRequestInputDto,
    example: {
      startDate: '2010-01-02',
      endDate: '2020-01-01',
      compounding: 'monthly',
      confidenceInterval: 0.8,
      grossInitialInvestment: 8,
      currentWealth: 11190,
      frontEndFees: 0.01,
      backEndFees: 0.01,
      managementFees: [0],
      grossGoalAmount: 110000,
      modelPortfolioIdList: [13],
      infusions: [10],
      targetProbability: 0.57,
    },
  })
  @IsObject()
  @IsNotEmptyObject()
  @IsDefined()
  @Type(() => BambuApiLibraryGetProjectionsRequestInputDto)
  @ValidateNested()
  inputs: BambuApiLibraryGetProjectionsRequestInputDto;

  @ApiProperty({
    description: 'Selection of recommendations to be displayed.',
    type: BambuApiLibraryGetProjectionsRequestRecommendationSelectionDto,
    example: {
      shortfallRecommendation: {
        initialInvestment: true,
        constantInfusion: true,
        dynamicIncreasingInfusion: true,
        dynamicDecreasingInfusion: true,
        goalAmount: true,
        goalYear: true,
      },
      surplusRecommendation: {
        glidePath: {
          glidePath: true,
          portfolioDerisking: false,
          deriskStartDate: '2015-01-02',
          deriskEndDate: '2019-01-03',
        },
      },
    },
  })
  @IsObject()
  @IsNotEmptyObject()
  @IsDefined()
  @Type(() => BambuApiLibraryGetProjectionsRequestRecommendationSelectionDto)
  @ValidateNested()
  recommendationSelection: BambuApiLibraryGetProjectionsRequestRecommendationSelectionDto;
}
