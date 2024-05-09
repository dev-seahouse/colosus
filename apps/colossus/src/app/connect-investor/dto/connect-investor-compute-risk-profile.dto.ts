import {
  IBambuApiLibraryCalculateRiskScoreRequestAnswerDto,
  IBambuApiLibraryCalculateRiskScoreRequestDto,
  IOverallScoreDetailsDto,
  IQuestionScoreDetailsDto,
  IRiskCalculateResponseDto,
} from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class BambuApiLibraryCalculateRiskScoreRequestAnswerDto
  implements IBambuApiLibraryCalculateRiskScoreRequestAnswerDto
{
  @ApiProperty({
    type: 'string',
    example: 'cfdb367c-b5c4-4b14-8b41-00daa59b300d',
  })
  @IsString()
  @IsNotEmpty()
  questionGroupingId: string;

  @ApiProperty({
    type: 'string',
    example: 'cfdb367c-b5c4-4b14-8b41-00daa59b300d',
  })
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({
    type: 'string',
    example: 'cfdb367c-b5c4-4b14-8b41-00daa59b300d',
    required: false,
    description: 'This field is optional if there are no listed answers in DB.',
  })
  @IsString()
  @IsOptional()
  answerId: string | null = null;

  @ApiProperty({
    type: 'number',
    example: 1,
    required: false,
    description:
      'This is usually blank unless the question answer time is NUMERIC_ENTRY.',
  })
  @IsOptional()
  @IsNumber()
  answerScoreNumber: number | null = null;
}

export class ConnectInvestorCalculateRiskScoreRequestDto
  implements IBambuApiLibraryCalculateRiskScoreRequestDto
{
  @ApiProperty({
    type: 'string',
    example: 'cfdb367c-b5c4-4b14-8b41-00daa59b300d',
  })
  @IsString()
  @IsNotEmpty()
  questionnaireId: string;

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsNotEmpty()
  questionnaireVersion: number;

  @ApiProperty({
    type: BambuApiLibraryCalculateRiskScoreRequestAnswerDto,
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty()
  answers: BambuApiLibraryCalculateRiskScoreRequestAnswerDto[];
}

export class ConnectInvestorQuestionScoreDetailsDto
  implements IQuestionScoreDetailsDto
{
  @ApiProperty({
    type: 'string',
    example: 'Risk Capacity"',
  })
  questionCategoryName: string;

  @ApiProperty({
    type: 'string',
    example: '1',
  })
  questionId: string;

  @ApiProperty({
    type: 'string',
    example: '5',
  })
  questionScore: string;
  @ApiProperty({
    type: 'string',
    example: '0.5',
  })
  questionWeight: string;

  @ApiProperty({
    type: ConnectInvestorQuestionScoreDetailsDto,
    isArray: true,
  })
  @IsArray()
  questionScoreDetails?: ConnectInvestorQuestionScoreDetailsDto[];
}

export class ConnectInvestorOverallScoreDetailsDto
  implements IOverallScoreDetailsDto
{
  @ApiProperty({
    type: 'string',
    example: 'Risk Capacity"',
  })
  questionCategoryName: string;

  @ApiProperty({
    type: 'string',
    example: '1',
  })
  questionId: string;

  @ApiProperty({
    type: 'string',
    example: '5',
  })
  questionScore: string;
  @ApiProperty({
    type: 'string',
    example: '0.5',
  })
  questionWeight: string;
  @ApiProperty({
    type: ConnectInvestorQuestionScoreDetailsDto,
    isArray: true,
  })
  @IsArray()
  questionScoreDetails: ConnectInvestorQuestionScoreDetailsDto[];
}

export class ConnectInvestorCalculateRiskScoreResponseDto
  implements IRiskCalculateResponseDto
{
  @ApiProperty({
    type: 'string',
    example: 'cfdb367c-b5c4-4b14-8b41-00daa59b300d',
  })
  questionnaireId: string;

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  questionnaireVersion: number;

  @ApiProperty({
    type: BambuApiLibraryCalculateRiskScoreRequestAnswerDto,
  })
  @IsArray()
  questionnairePayload: BambuApiLibraryCalculateRiskScoreRequestAnswerDto[];

  @ApiProperty({
    type: ConnectInvestorOverallScoreDetailsDto,
  })
  @IsArray()
  riskProfileComputationResult: ConnectInvestorOverallScoreDetailsDto[];

  @ApiProperty({
    type: 'string',
    example: '2',
  })
  riskProfileScore: string;

  @ApiProperty({
    type: 'object',
    description: 'Model Risk Profile for the computed risk questionnaires',
  })
  modelRiskProfile: Record<string, unknown>;

  @ApiProperty({
    type: 'string',
    example: 'cfdb367c-b5c4-4b14-8b41-00daa59b300d',
    description: 'Model portfolio for the computed risk questionnaires',
  })
  modelPortfolioId: string;
}
