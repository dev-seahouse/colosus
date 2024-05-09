import { QuestionnaireTypeEnum } from '@bambu/server-core/db/central-db';
import { IGetLatestQuestionnaireVersion } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectAdvisorLatestRiskQuestionnaireVersionResponseDto
  implements IGetLatestQuestionnaireVersion
{
  @ApiProperty({
    type: 'string',
    example: 'dfc77d5a-f1d6-49fd-9aac-b9f0c7d7087a',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    type: 'string',
    example: QuestionnaireTypeEnum.RISK_PROFILING_QUESTIONNAIRE,
    required: true,
  })
  @IsNotEmpty()
  questionnaireType: QuestionnaireTypeEnum.RISK_PROFILING_QUESTIONNAIRE;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  questionnaireVersion: number;

  @ApiProperty({
    type: 'string',
  })
  versionId: string;
}
