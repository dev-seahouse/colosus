import {
  IGetRiskQuestionnaire,
  QuestionnaireTypeEnum,
  IQuestionnaireGrouping,
  IQuestion,
  IAnswer,
} from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class RiskQuestionnaireGroupingsDto implements IQuestionnaireGrouping {
  @ApiProperty({
    type: 'string',
    example: 'dfc77d5a-f1d6-49fd-9aac-b9f0c7d7087a',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    example: 'FINANCIAL_HEALTH',
  })
  groupingName: string;

  @ApiProperty({
    type: 'string',
    example: 'RISK_CAPACITY',
  })
  groupingType: string;

  @ApiProperty({
    type: 'string',
    example: '0.5',
  })
  groupingWeight: string;

  @ApiProperty({
    type: QuestionnaireTypeEnum,
    example: 'MAX',
  })
  scoringRules: string;

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  sortKey: number;

  @ApiProperty({
    isArray: true,
  })
  Questions: RiskQuestionnaireQuestionsDto[];
}

export class RiskQuestionnaireAnswersDto implements IAnswer {
  @ApiProperty({
    type: 'string',
    example: 'dfc77d5a-f1d6-49fd-9aac-b9f0c7d7087a',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  answer: string;

  @ApiProperty({
    type: 'string',
    example: '1',
  })
  score: string;

  @ApiProperty({
    type: 'number',
    example: '2',
  })
  sortKey: number;

  @ApiProperty({
    type: 'object',
  })
  @IsObject()
  additionalConfiguration: unknown;
}

export class RiskQuestionnaireQuestionsDto implements IQuestion {
  @ApiProperty({
    type: 'string',
    example: 'dfc77d5a-f1d6-49fd-9aac-b9f0c7d7087a',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    example: 'How much do you roughly save out of your monthly income?',
  })
  question: string;

  @ApiProperty({
    type: 'string',
    example: 'NUMERIC_ENTRY',
  })
  questionFormat: string;

  @ApiProperty({
    type: 'string',
    example: 'INCOME',
  })
  questionType: string;

  @ApiProperty({
    type: 'string',
    example: '0.5',
  })
  questionWeight: string;
  @ApiProperty({
    type: 'Object',
  })
  @IsObject()
  additionalConfiguration?: unknown;

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  sortKey: number;
  @ApiProperty({
    type: RiskQuestionnaireAnswersDto,
  })
  Answers: RiskQuestionnaireAnswersDto[];
}

export class ConnectAdvisorRiskQuestionnaireResponseDto
  implements IGetRiskQuestionnaire
{
  @ApiProperty({
    type: 'string',
    example: 'dfc77d5a-f1d6-49fd-9aac-b9f0c7d7087a',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    example: QuestionnaireTypeEnum.RISK_PROFILING_QUESTIONNAIRE,
  })
  questionnaireType: QuestionnaireTypeEnum.RISK_PROFILING_QUESTIONNAIRE;

  @ApiProperty({
    type: 'string',
    example: 'Intial questionnaire',
  })
  questionnaireName: string;

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  activeVersion: number;

  @ApiProperty({
    type: RiskQuestionnaireGroupingsDto,
    isArray: true,
  })
  @IsObject()
  Questionnaire: RiskQuestionnaireGroupingsDto[];
}
