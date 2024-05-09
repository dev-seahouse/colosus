import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsNumber,
  IsEnum,
  IsObject,
  IsNotEmptyObject,
  IsDefined,
  IsDateString,
  IsBoolean,
  IsString,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ClassTransformerUtils } from '@bambu/server-core/utilities';

import {
  IBambuApiLibraryGetProjectionsResponseDto,
  BambuApiLibraryGetProjectionsResponseHealthCheckStatus,
  IBambuApiLibraryGetProjectionsResponsePerformanceTestDto,
  IBambuApiLibraryGetProjectionsResponseProjectionItemsDto,
  IBambuApiLibraryGetProjectionsResponseRecommendationsDto,
} from '@bambu/shared';

export class BambuApiLibraryGetProjectionsResponsePerformanceTestDto
  implements IBambuApiLibraryGetProjectionsResponsePerformanceTestDto
{
  @ApiProperty({
    type: 'number',
    example: 0.0039,
  })
  @IsNotEmpty()
  @IsNumber()
  constantInfusionRecRunningTime: number;

  @ApiProperty({
    type: 'number',
    example: 0.4309,
  })
  @IsNotEmpty()
  @IsNumber()
  dynamicDecreasingInfusionRecRunningTime: number;

  @ApiProperty({
    type: 'number',
    example: 0.378,
  })
  @IsNotEmpty()
  @IsNumber()
  dynamicIncreasingInfusionRecRunningTime: number;

  @ApiProperty({
    type: 'number',
    example: 0.0002,
  })
  @IsNotEmpty()
  @IsNumber()
  goalAmountRecRunningTime: number;

  @ApiProperty({
    type: 'number',
    example: 0.2041,
  })
  @IsNotEmpty()
  @IsNumber()
  goalYearRecRunningTime: number;

  @ApiProperty({
    type: 'number',
    example: 0.0109,
  })
  @IsNotEmpty()
  @IsNumber()
  initialInvestmentRecRunningTime: number;
}

export class BambuApiLibraryGetProjectionsResponseProjectionItemsDto
  implements IBambuApiLibraryGetProjectionsResponseProjectionItemsDto
{
  @ApiProperty({
    type: 'string',
    format: 'date',
    example: '2010-01-02',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    type: 'number',
    example: '111111.11',
  })
  @IsNotEmpty()
  @IsNumber()
  goalAmountNet: number;

  @ApiProperty({
    type: 'number',
    example: '11197.92',
  })
  @IsNotEmpty()
  @IsNumber()
  projectionLowerAmt: number;

  @ApiProperty({
    type: 'number',
    example: '11197.92',
  })
  @IsNotEmpty()
  @IsNumber()
  projectionMiddleAmt: number;

  @ApiProperty({
    type: 'number',
    example: '11197.92',
  })
  @IsNotEmpty()
  @IsNumber()
  projectionTargetAmt: number;

  @ApiProperty({
    type: 'number',
    example: '11197.92',
  })
  @IsNotEmpty()
  @IsNumber()
  projectionUpperAmt: number;
}

export class BambuApiLibraryGetProjectionsResponseRecommendationsDto
  implements IBambuApiLibraryGetProjectionsResponseRecommendationsDto
{
  @ApiProperty({
    type: 'number',
    isArray: true,
    example: [
      548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548,
      548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548,
      548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548,
      548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548,
      548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548,
      548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548,
      548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548,
      548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548,
    ],
  })
  constantInfusion: number[];

  @ApiProperty({
    type: 'number',
    isArray: true,
    example: [
      697, 696, 694, 691, 689, 687, 684, 682, 679, 676, 673, 670, 667, 664, 660,
      657, 655, 651, 648, 645, 642, 639, 636, 633, 629, 626, 623, 620, 617, 614,
      611, 607, 604, 601, 598, 595, 592, 589, 586, 583, 580, 577, 574, 571, 568,
      565, 562, 559, 556, 553, 550, 547, 544, 541, 538, 536, 533, 530, 527, 524,
      522, 519, 516, 514, 511, 508, 505, 502, 500, 497, 495, 492, 489, 487, 484,
      481, 479, 476, 474, 471, 468, 466, 463, 461, 458, 456, 453, 451, 448, 446,
      444, 441, 439, 437, 434, 432, 429, 427, 425, 422, 420, 418, 416, 413, 411,
      409, 407, 404, 402, 400, 398, 395, 393, 391, 389, 387, 385, 382, 380, 1,
    ],
  })
  dynamicDecreasingInfusion: number[];

  @ApiProperty({
    type: 'number',
    isArray: true,
    example: [
      42, 422, 424, 426, 428, 431, 433, 435, 437, 439, 441, 443, 446, 448, 450,
      453, 455, 457, 459, 462, 464, 466, 469, 471, 473, 476, 478, 480, 483, 485,
      487, 490, 493, 495, 498, 500, 502, 504, 507, 510, 512, 515, 518, 520, 523,
      525, 528, 531, 533, 536, 538, 541, 544, 546, 549, 552, 555, 558, 560, 563,
      566, 569, 572, 575, 577, 580, 583, 586, 589, 592, 594, 597, 600, 603, 606,
      609, 612, 615, 618, 621, 624, 627, 631, 634, 637, 639, 643, 646, 649, 652,
      655, 658, 661, 664, 667, 671, 674, 677, 680, 683, 686, 689, 693, 696, 699,
      702, 705, 708, 711, 714, 717, 720, 723, 725, 728, 731, 733, 736, 737, 738,
    ],
  })
  dynamicIncreasingInfusion: number[];

  @ApiProperty({
    type: 'string',
    format: 'date',
    example: '2042-12-31',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    type: 'number',
    example: 22047.4,
  })
  @IsNotEmpty()
  @IsNumber()
  goalAmount: number;

  @ApiProperty({
    type: 'number',
    example: 48748,
  })
  @IsNotEmpty()
  @IsNumber()
  initialInvestment: number;
}

export class BambuApiLibraryGetProjectionsResponseDto
  implements IBambuApiLibraryGetProjectionsResponseDto
{
  @ApiProperty({
    type: 'number',
    example: 98,
  })
  @IsNotEmpty()
  @IsNumber()
  difference: number;

  @ApiProperty({
    description:
      'Probability of goal achieving target. Returns a decimal number as string.',
    type: 'string',
    example: '0.558095',
  })
  @IsNotEmpty()
  @IsString()
  goalProbability: string;

  @ApiProperty({
    description: [
      'If goal is not achievable (SHORTFALL) - Change in Initial Investment Amount, Periodic Investment Amounts (Constant, Increasing and Decreasing), Goal Amount and Investment End Date.',
      'If goal is achievable (SURPLUS) - A declining glide path that recommends investments in less risky Model Portfolios nearer to Goal End Date.',
    ].join(' '),
    enum: BambuApiLibraryGetProjectionsResponseHealthCheckStatus,
    example: BambuApiLibraryGetProjectionsResponseHealthCheckStatus.SHORTFALL,
  })
  @IsNotEmpty()
  @IsEnum(BambuApiLibraryGetProjectionsResponseHealthCheckStatus)
  healthCheckStatus: BambuApiLibraryGetProjectionsResponseHealthCheckStatus;

  @ApiProperty({
    description: 'To display recommendation for initial investment amount.',
    type: 'boolean',
    example: false,
  })
  @IsBoolean()
  @Transform(ClassTransformerUtils.ForceActualValueForBooleanField)
  matchGoalProb: boolean;

  @ApiProperty({
    type: BambuApiLibraryGetProjectionsResponsePerformanceTestDto,
    example: {
      constantInfusionRecRunningTime: 0.0039,
      dynamicDecreasingInfusionRecRunningTime: 0.4309,
      dynamicIncreasingInfusionRecRunningTime: 0.378,
      goalAmountRecRunningTime: 0.0002,
      goalYearRecRunningTime: 0.2041,
      initialInvestmentRecRunningTime: 0.0109,
    },
  })
  @IsObject()
  @IsNotEmptyObject()
  @IsDefined()
  @Type(() => BambuApiLibraryGetProjectionsResponsePerformanceTestDto)
  @ValidateNested()
  performanceTest: BambuApiLibraryGetProjectionsResponsePerformanceTestDto;

  @ApiProperty({
    type: BambuApiLibraryGetProjectionsResponseProjectionItemsDto,
    isArray: true,
    example: [
      {
        date: '2010-01-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11197.92,
        projectionMiddleAmt: 11197.92,
        projectionTargetAmt: 11197.92,
        projectionUpperAmt: 11197.92,
      },
      {
        date: '2010-02-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10868.38,
        projectionMiddleAmt: 11275.23,
        projectionTargetAmt: 11218.35,
        projectionUpperAmt: 11697.32,
      },
      {
        date: '2010-03-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10662.98,
        projectionMiddleAmt: 11353.01,
        projectionTargetAmt: 11255.46,
        projectionUpperAmt: 12087.71,
      },
      {
        date: '2010-04-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10511.65,
        projectionMiddleAmt: 11431.26,
        projectionTargetAmt: 11300.07,
        projectionUpperAmt: 12431.37,
      },
      {
        date: '2010-05-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10392.11,
        projectionMiddleAmt: 11509.97,
        projectionTargetAmt: 11349.26,
        projectionUpperAmt: 12748.22,
      },
      {
        date: '2010-06-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10293.99,
        projectionMiddleAmt: 11589.16,
        projectionTargetAmt: 11401.66,
        projectionUpperAmt: 13047.55,
      },
      {
        date: '2010-07-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10211.5,
        projectionMiddleAmt: 11668.83,
        projectionTargetAmt: 11456.52,
        projectionUpperAmt: 13334.56,
      },
      {
        date: '2010-08-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10141.03,
        projectionMiddleAmt: 11748.97,
        projectionTargetAmt: 11513.35,
        projectionUpperAmt: 13612.5,
      },
      {
        date: '2010-09-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10080.15,
        projectionMiddleAmt: 11829.6,
        projectionTargetAmt: 11571.85,
        projectionUpperAmt: 13883.56,
      },
      {
        date: '2010-10-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10027.15,
        projectionMiddleAmt: 11910.71,
        projectionTargetAmt: 11631.79,
        projectionUpperAmt: 14149.31,
      },
      {
        date: '2010-11-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9980.75,
        projectionMiddleAmt: 11992.31,
        projectionTargetAmt: 11692.99,
        projectionUpperAmt: 14410.88,
      },
      {
        date: '2010-12-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9939.99,
        projectionMiddleAmt: 12074.4,
        projectionTargetAmt: 11755.34,
        projectionUpperAmt: 14669.17,
      },
      {
        date: '2011-01-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9904.1,
        projectionMiddleAmt: 12156.98,
        projectionTargetAmt: 11818.74,
        projectionUpperAmt: 14924.86,
      },
      {
        date: '2011-02-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9872.49,
        projectionMiddleAmt: 12240.07,
        projectionTargetAmt: 11883.1,
        projectionUpperAmt: 15178.52,
      },
      {
        date: '2011-03-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9844.65,
        projectionMiddleAmt: 12323.65,
        projectionTargetAmt: 11948.37,
        projectionUpperAmt: 15430.6,
      },
      {
        date: '2011-04-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9820.2,
        projectionMiddleAmt: 12407.73,
        projectionTargetAmt: 12014.5,
        projectionUpperAmt: 15681.47,
      },
      {
        date: '2011-05-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9798.78,
        projectionMiddleAmt: 12492.32,
        projectionTargetAmt: 12081.44,
        projectionUpperAmt: 15931.45,
      },
      {
        date: '2011-06-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9780.11,
        projectionMiddleAmt: 12577.42,
        projectionTargetAmt: 12149.15,
        projectionUpperAmt: 16180.82,
      },
      {
        date: '2011-07-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9763.95,
        projectionMiddleAmt: 12663.03,
        projectionTargetAmt: 12217.61,
        projectionUpperAmt: 16429.81,
      },
      {
        date: '2011-08-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9750.09,
        projectionMiddleAmt: 12749.15,
        projectionTargetAmt: 12286.79,
        projectionUpperAmt: 16678.62,
      },
      {
        date: '2011-09-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9738.33,
        projectionMiddleAmt: 12835.79,
        projectionTargetAmt: 12356.67,
        projectionUpperAmt: 16927.44,
      },
      {
        date: '2011-10-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9728.53,
        projectionMiddleAmt: 12922.96,
        projectionTargetAmt: 12427.23,
        projectionUpperAmt: 17176.41,
      },
      {
        date: '2011-11-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9720.54,
        projectionMiddleAmt: 13010.65,
        projectionTargetAmt: 12498.45,
        projectionUpperAmt: 17425.68,
      },
      {
        date: '2011-12-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9714.24,
        projectionMiddleAmt: 13098.86,
        projectionTargetAmt: 12570.32,
        projectionUpperAmt: 17675.39,
      },
      {
        date: '2012-01-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9709.52,
        projectionMiddleAmt: 13187.61,
        projectionTargetAmt: 12642.83,
        projectionUpperAmt: 17925.63,
      },
      {
        date: '2012-02-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9706.27,
        projectionMiddleAmt: 13276.89,
        projectionTargetAmt: 12715.96,
        projectionUpperAmt: 18176.52,
      },
      {
        date: '2012-03-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9704.42,
        projectionMiddleAmt: 13366.7,
        projectionTargetAmt: 12789.71,
        projectionUpperAmt: 18428.15,
      },
      {
        date: '2012-04-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9703.87,
        projectionMiddleAmt: 13457.06,
        projectionTargetAmt: 12864.07,
        projectionUpperAmt: 18680.61,
      },
      {
        date: '2012-05-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9704.56,
        projectionMiddleAmt: 13547.96,
        projectionTargetAmt: 12939.03,
        projectionUpperAmt: 18933.97,
      },
      {
        date: '2012-06-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9706.42,
        projectionMiddleAmt: 13639.41,
        projectionTargetAmt: 13014.59,
        projectionUpperAmt: 19188.32,
      },
      {
        date: '2012-07-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9709.39,
        projectionMiddleAmt: 13731.41,
        projectionTargetAmt: 13090.73,
        projectionUpperAmt: 19443.72,
      },
      {
        date: '2012-08-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9713.43,
        projectionMiddleAmt: 13823.96,
        projectionTargetAmt: 13167.46,
        projectionUpperAmt: 19700.24,
      },
      {
        date: '2012-09-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9718.47,
        projectionMiddleAmt: 13917.07,
        projectionTargetAmt: 13244.77,
        projectionUpperAmt: 19957.93,
      },
      {
        date: '2012-10-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9724.47,
        projectionMiddleAmt: 14010.73,
        projectionTargetAmt: 13322.66,
        projectionUpperAmt: 20216.86,
      },
      {
        date: '2012-11-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9731.39,
        projectionMiddleAmt: 14104.96,
        projectionTargetAmt: 13401.12,
        projectionUpperAmt: 20477.08,
      },
      {
        date: '2012-12-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9739.19,
        projectionMiddleAmt: 14199.76,
        projectionTargetAmt: 13480.16,
        projectionUpperAmt: 20738.63,
      },
      {
        date: '2013-01-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9747.84,
        projectionMiddleAmt: 14295.13,
        projectionTargetAmt: 13559.76,
        projectionUpperAmt: 21001.57,
      },
      {
        date: '2013-02-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9757.3,
        projectionMiddleAmt: 14391.07,
        projectionTargetAmt: 13639.93,
        projectionUpperAmt: 21265.95,
      },
      {
        date: '2013-03-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9767.54,
        projectionMiddleAmt: 14487.59,
        projectionTargetAmt: 13720.67,
        projectionUpperAmt: 21531.81,
      },
      {
        date: '2013-04-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9778.53,
        projectionMiddleAmt: 14584.69,
        projectionTargetAmt: 13801.98,
        projectionUpperAmt: 21799.19,
      },
      {
        date: '2013-05-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9790.25,
        projectionMiddleAmt: 14682.37,
        projectionTargetAmt: 13883.84,
        projectionUpperAmt: 22068.12,
      },
      {
        date: '2013-06-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9802.68,
        projectionMiddleAmt: 14780.64,
        projectionTargetAmt: 13966.27,
        projectionUpperAmt: 22338.67,
      },
      {
        date: '2013-07-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9815.77,
        projectionMiddleAmt: 14879.5,
        projectionTargetAmt: 14049.27,
        projectionUpperAmt: 22610.85,
      },
      {
        date: '2013-08-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9829.53,
        projectionMiddleAmt: 14978.96,
        projectionTargetAmt: 14132.83,
        projectionUpperAmt: 22884.7,
      },
      {
        date: '2013-09-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9843.92,
        projectionMiddleAmt: 15079.02,
        projectionTargetAmt: 14216.95,
        projectionUpperAmt: 23160.27,
      },
      {
        date: '2013-10-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9858.93,
        projectionMiddleAmt: 15179.67,
        projectionTargetAmt: 14301.63,
        projectionUpperAmt: 23437.59,
      },
      {
        date: '2013-11-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9874.53,
        projectionMiddleAmt: 15280.93,
        projectionTargetAmt: 14386.88,
        projectionUpperAmt: 23716.69,
      },
      {
        date: '2013-12-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9890.72,
        projectionMiddleAmt: 15382.8,
        projectionTargetAmt: 14472.69,
        projectionUpperAmt: 23997.6,
      },
      {
        date: '2014-01-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9907.48,
        projectionMiddleAmt: 15485.29,
        projectionTargetAmt: 14559.07,
        projectionUpperAmt: 24280.35,
      },
      {
        date: '2014-02-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9924.79,
        projectionMiddleAmt: 15588.39,
        projectionTargetAmt: 14646.01,
        projectionUpperAmt: 24564.98,
      },
      {
        date: '2014-03-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9942.63,
        projectionMiddleAmt: 15692.11,
        projectionTargetAmt: 14733.52,
        projectionUpperAmt: 24851.52,
      },
      {
        date: '2014-04-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9961,
        projectionMiddleAmt: 15796.45,
        projectionTargetAmt: 14821.6,
        projectionUpperAmt: 25140,
      },
      {
        date: '2014-05-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9979.88,
        projectionMiddleAmt: 15901.42,
        projectionTargetAmt: 14910.24,
        projectionUpperAmt: 25430.45,
      },
      {
        date: '2014-06-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 9999.26,
        projectionMiddleAmt: 16007.03,
        projectionTargetAmt: 14999.46,
        projectionUpperAmt: 25722.89,
      },
      {
        date: '2014-07-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10019.13,
        projectionMiddleAmt: 16113.26,
        projectionTargetAmt: 15089.25,
        projectionUpperAmt: 26017.36,
      },
      {
        date: '2014-08-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10039.48,
        projectionMiddleAmt: 16220.14,
        projectionTargetAmt: 15179.61,
        projectionUpperAmt: 26313.89,
      },
      {
        date: '2014-09-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10060.29,
        projectionMiddleAmt: 16327.66,
        projectionTargetAmt: 15270.55,
        projectionUpperAmt: 26612.49,
      },
      {
        date: '2014-10-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10081.57,
        projectionMiddleAmt: 16435.83,
        projectionTargetAmt: 15362.06,
        projectionUpperAmt: 26913.21,
      },
      {
        date: '2014-11-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10103.29,
        projectionMiddleAmt: 16544.65,
        projectionTargetAmt: 15454.15,
        projectionUpperAmt: 27216.07,
      },
      {
        date: '2014-12-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10125.46,
        projectionMiddleAmt: 16654.12,
        projectionTargetAmt: 15546.82,
        projectionUpperAmt: 27521.09,
      },
      {
        date: '2015-01-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10148.06,
        projectionMiddleAmt: 16764.25,
        projectionTargetAmt: 15640.08,
        projectionUpperAmt: 27828.3,
      },
      {
        date: '2015-02-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10171.09,
        projectionMiddleAmt: 16875.04,
        projectionTargetAmt: 15733.92,
        projectionUpperAmt: 28137.73,
      },
      {
        date: '2015-03-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10194.53,
        projectionMiddleAmt: 16986.5,
        projectionTargetAmt: 15828.34,
        projectionUpperAmt: 28449.41,
      },
      {
        date: '2015-04-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10218.38,
        projectionMiddleAmt: 17098.63,
        projectionTargetAmt: 15923.35,
        projectionUpperAmt: 28763.36,
      },
      {
        date: '2015-05-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10242.64,
        projectionMiddleAmt: 17211.43,
        projectionTargetAmt: 16018.96,
        projectionUpperAmt: 29079.6,
      },
      {
        date: '2015-06-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10267.3,
        projectionMiddleAmt: 17324.91,
        projectionTargetAmt: 16115.15,
        projectionUpperAmt: 29398.18,
      },
      {
        date: '2015-07-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10292.35,
        projectionMiddleAmt: 17439.08,
        projectionTargetAmt: 16211.95,
        projectionUpperAmt: 29719.1,
      },
      {
        date: '2015-08-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10317.78,
        projectionMiddleAmt: 17553.93,
        projectionTargetAmt: 16309.34,
        projectionUpperAmt: 30042.39,
      },
      {
        date: '2015-09-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10343.6,
        projectionMiddleAmt: 17669.47,
        projectionTargetAmt: 16407.33,
        projectionUpperAmt: 30368.09,
      },
      {
        date: '2015-10-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10369.79,
        projectionMiddleAmt: 17785.71,
        projectionTargetAmt: 16505.92,
        projectionUpperAmt: 30696.22,
      },
      {
        date: '2015-11-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10396.36,
        projectionMiddleAmt: 17902.65,
        projectionTargetAmt: 16605.12,
        projectionUpperAmt: 31026.8,
      },
      {
        date: '2015-12-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10423.29,
        projectionMiddleAmt: 18020.29,
        projectionTargetAmt: 16704.92,
        projectionUpperAmt: 31359.86,
      },
      {
        date: '2016-01-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10450.58,
        projectionMiddleAmt: 18138.63,
        projectionTargetAmt: 16805.34,
        projectionUpperAmt: 31695.42,
      },
      {
        date: '2016-02-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10478.23,
        projectionMiddleAmt: 18257.69,
        projectionTargetAmt: 16906.37,
        projectionUpperAmt: 32033.51,
      },
      {
        date: '2016-03-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10506.23,
        projectionMiddleAmt: 18377.47,
        projectionTargetAmt: 17008.01,
        projectionUpperAmt: 32374.16,
      },
      {
        date: '2016-04-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10534.58,
        projectionMiddleAmt: 18497.97,
        projectionTargetAmt: 17110.27,
        projectionUpperAmt: 32717.39,
      },
      {
        date: '2016-05-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10563.28,
        projectionMiddleAmt: 18619.19,
        projectionTargetAmt: 17213.16,
        projectionUpperAmt: 33063.23,
      },
      {
        date: '2016-06-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10592.32,
        projectionMiddleAmt: 18741.14,
        projectionTargetAmt: 17316.67,
        projectionUpperAmt: 33411.7,
      },
      {
        date: '2016-07-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10621.7,
        projectionMiddleAmt: 18863.82,
        projectionTargetAmt: 17420.8,
        projectionUpperAmt: 33762.82,
      },
      {
        date: '2016-08-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10651.41,
        projectionMiddleAmt: 18987.24,
        projectionTargetAmt: 17525.57,
        projectionUpperAmt: 34116.63,
      },
      {
        date: '2016-09-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10681.46,
        projectionMiddleAmt: 19111.4,
        projectionTargetAmt: 17630.97,
        projectionUpperAmt: 34473.15,
      },
      {
        date: '2016-10-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10711.84,
        projectionMiddleAmt: 19236.31,
        projectionTargetAmt: 17737,
        projectionUpperAmt: 34832.41,
      },
      {
        date: '2016-11-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10742.54,
        projectionMiddleAmt: 19361.97,
        projectionTargetAmt: 17843.67,
        projectionUpperAmt: 35194.42,
      },
      {
        date: '2016-12-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10773.56,
        projectionMiddleAmt: 19488.39,
        projectionTargetAmt: 17950.99,
        projectionUpperAmt: 35559.22,
      },
      {
        date: '2017-01-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10804.91,
        projectionMiddleAmt: 19615.57,
        projectionTargetAmt: 18058.95,
        projectionUpperAmt: 35926.84,
      },
      {
        date: '2017-02-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10836.57,
        projectionMiddleAmt: 19743.51,
        projectionTargetAmt: 18167.56,
        projectionUpperAmt: 36297.29,
      },
      {
        date: '2017-03-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10868.56,
        projectionMiddleAmt: 19872.22,
        projectionTargetAmt: 18276.83,
        projectionUpperAmt: 36670.61,
      },
      {
        date: '2017-04-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10900.85,
        projectionMiddleAmt: 20001.71,
        projectionTargetAmt: 18386.74,
        projectionUpperAmt: 37046.81,
      },
      {
        date: '2017-05-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10933.46,
        projectionMiddleAmt: 20131.98,
        projectionTargetAmt: 18497.32,
        projectionUpperAmt: 37425.94,
      },
      {
        date: '2017-06-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10966.38,
        projectionMiddleAmt: 20263.03,
        projectionTargetAmt: 18608.56,
        projectionUpperAmt: 37808.01,
      },
      {
        date: '2017-07-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 10999.6,
        projectionMiddleAmt: 20394.86,
        projectionTargetAmt: 18720.46,
        projectionUpperAmt: 38193.04,
      },
      {
        date: '2017-08-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11033.13,
        projectionMiddleAmt: 20527.49,
        projectionTargetAmt: 18833.03,
        projectionUpperAmt: 38581.07,
      },
      {
        date: '2017-09-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11066.97,
        projectionMiddleAmt: 20660.92,
        projectionTargetAmt: 18946.27,
        projectionUpperAmt: 38972.13,
      },
      {
        date: '2017-10-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11101.11,
        projectionMiddleAmt: 20795.15,
        projectionTargetAmt: 19060.19,
        projectionUpperAmt: 39366.23,
      },
      {
        date: '2017-11-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11135.55,
        projectionMiddleAmt: 20930.19,
        projectionTargetAmt: 19174.79,
        projectionUpperAmt: 39763.41,
      },
      {
        date: '2017-12-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11170.29,
        projectionMiddleAmt: 21066.04,
        projectionTargetAmt: 19290.06,
        projectionUpperAmt: 40163.69,
      },
      {
        date: '2018-01-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11205.33,
        projectionMiddleAmt: 21202.7,
        projectionTargetAmt: 19406.03,
        projectionUpperAmt: 40567.11,
      },
      {
        date: '2018-02-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11240.66,
        projectionMiddleAmt: 21340.19,
        projectionTargetAmt: 19522.68,
        projectionUpperAmt: 40973.68,
      },
      {
        date: '2018-03-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11276.29,
        projectionMiddleAmt: 21478.51,
        projectionTargetAmt: 19640.03,
        projectionUpperAmt: 41383.43,
      },
      {
        date: '2018-04-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11312.21,
        projectionMiddleAmt: 21617.66,
        projectionTargetAmt: 19758.07,
        projectionUpperAmt: 41796.4,
      },
      {
        date: '2018-05-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11348.43,
        projectionMiddleAmt: 21757.64,
        projectionTargetAmt: 19876.82,
        projectionUpperAmt: 42212.61,
      },
      {
        date: '2018-06-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11384.94,
        projectionMiddleAmt: 21898.47,
        projectionTargetAmt: 19996.26,
        projectionUpperAmt: 42632.08,
      },
      {
        date: '2018-07-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11421.74,
        projectionMiddleAmt: 22040.14,
        projectionTargetAmt: 20116.42,
        projectionUpperAmt: 43054.85,
      },
      {
        date: '2018-08-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11458.83,
        projectionMiddleAmt: 22182.67,
        projectionTargetAmt: 20237.29,
        projectionUpperAmt: 43480.94,
      },
      {
        date: '2018-09-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11496.2,
        projectionMiddleAmt: 22326.05,
        projectionTargetAmt: 20358.87,
        projectionUpperAmt: 43910.39,
      },
      {
        date: '2018-10-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11533.87,
        projectionMiddleAmt: 22470.3,
        projectionTargetAmt: 20481.17,
        projectionUpperAmt: 44343.21,
      },
      {
        date: '2018-11-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11571.82,
        projectionMiddleAmt: 22615.41,
        projectionTargetAmt: 20604.2,
        projectionUpperAmt: 44779.44,
      },
      {
        date: '2018-12-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11610.06,
        projectionMiddleAmt: 22761.4,
        projectionTargetAmt: 20727.95,
        projectionUpperAmt: 45219.12,
      },
      {
        date: '2019-01-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11648.58,
        projectionMiddleAmt: 22908.26,
        projectionTargetAmt: 20852.43,
        projectionUpperAmt: 45662.25,
      },
      {
        date: '2019-02-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11687.39,
        projectionMiddleAmt: 23056.01,
        projectionTargetAmt: 20977.65,
        projectionUpperAmt: 46108.88,
      },
      {
        date: '2019-03-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11726.49,
        projectionMiddleAmt: 23204.64,
        projectionTargetAmt: 21103.6,
        projectionUpperAmt: 46559.04,
      },
      {
        date: '2019-04-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11765.87,
        projectionMiddleAmt: 23354.17,
        projectionTargetAmt: 21230.3,
        projectionUpperAmt: 47012.75,
      },
      {
        date: '2019-05-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11805.53,
        projectionMiddleAmt: 23504.6,
        projectionTargetAmt: 21357.74,
        projectionUpperAmt: 47470.04,
      },
      {
        date: '2019-06-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11845.47,
        projectionMiddleAmt: 23655.94,
        projectionTargetAmt: 21485.94,
        projectionUpperAmt: 47930.94,
      },
      {
        date: '2019-07-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11885.7,
        projectionMiddleAmt: 23808.18,
        projectionTargetAmt: 21614.89,
        projectionUpperAmt: 48395.49,
      },
      {
        date: '2019-08-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11926.2,
        projectionMiddleAmt: 23961.34,
        projectionTargetAmt: 21744.6,
        projectionUpperAmt: 48863.71,
      },
      {
        date: '2019-09-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 11966.99,
        projectionMiddleAmt: 24115.42,
        projectionTargetAmt: 21875.07,
        projectionUpperAmt: 49335.63,
      },
      {
        date: '2019-10-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 12008.06,
        projectionMiddleAmt: 24270.43,
        projectionTargetAmt: 22006.31,
        projectionUpperAmt: 49811.29,
      },
      {
        date: '2019-11-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 12049.41,
        projectionMiddleAmt: 24426.37,
        projectionTargetAmt: 22138.33,
        projectionUpperAmt: 50290.71,
      },
      {
        date: '2019-12-02',
        goalAmountNet: 111111.11,
        projectionLowerAmt: 12091.04,
        projectionMiddleAmt: 24583.25,
        projectionTargetAmt: 22271.11,
        projectionUpperAmt: 50773.92,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => BambuApiLibraryGetProjectionsResponseProjectionItemsDto)
  projections: BambuApiLibraryGetProjectionsResponseProjectionItemsDto[];

  @ApiProperty({
    type: BambuApiLibraryGetProjectionsResponseRecommendationsDto,
    example: {
      constantInfusion: [
        548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548,
        548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548,
        548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548,
        548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548,
        548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548,
        548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548,
        548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548,
        548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548, 548,
        548, 548, 548, 548, 548, 548, 548, 548,
      ],
      dynamicDecreasingInfusion: [
        697, 696, 694, 691, 689, 687, 684, 682, 679, 676, 673, 670, 667, 664,
        660, 657, 655, 651, 648, 645, 642, 639, 636, 633, 629, 626, 623, 620,
        617, 614, 611, 607, 604, 601, 598, 595, 592, 589, 586, 583, 580, 577,
        574, 571, 568, 565, 562, 559, 556, 553, 550, 547, 544, 541, 538, 536,
        533, 530, 527, 524, 522, 519, 516, 514, 511, 508, 505, 502, 500, 497,
        495, 492, 489, 487, 484, 481, 479, 476, 474, 471, 468, 466, 463, 461,
        458, 456, 453, 451, 448, 446, 444, 441, 439, 437, 434, 432, 429, 427,
        425, 422, 420, 418, 416, 413, 411, 409, 407, 404, 402, 400, 398, 395,
        393, 391, 389, 387, 385, 382, 380, 1,
      ],
      dynamicIncreasingInfusion: [
        42, 422, 424, 426, 428, 431, 433, 435, 437, 439, 441, 443, 446, 448,
        450, 453, 455, 457, 459, 462, 464, 466, 469, 471, 473, 476, 478, 480,
        483, 485, 487, 490, 493, 495, 498, 500, 502, 504, 507, 510, 512, 515,
        518, 520, 523, 525, 528, 531, 533, 536, 538, 541, 544, 546, 549, 552,
        555, 558, 560, 563, 566, 569, 572, 575, 577, 580, 583, 586, 589, 592,
        594, 597, 600, 603, 606, 609, 612, 615, 618, 621, 624, 627, 631, 634,
        637, 639, 643, 646, 649, 652, 655, 658, 661, 664, 667, 671, 674, 677,
        680, 683, 686, 689, 693, 696, 699, 702, 705, 708, 711, 714, 717, 720,
        723, 725, 728, 731, 733, 736, 737, 738,
      ],
      endDate: '2042-12-31',
      goalAmount: 22047.4,
      initialInvestment: 48748,
    },
  })
  @IsObject()
  @IsNotEmptyObject()
  @IsDefined()
  @ValidateNested()
  @Type(() => BambuApiLibraryGetProjectionsResponseRecommendationsDto)
  recommendations: BambuApiLibraryGetProjectionsResponseRecommendationsDto;

  @ApiProperty({
    type: 'string',
    example: '2.55 seconds',
  })
  @IsString()
  @IsNotEmpty()
  runningTime: string;
}
