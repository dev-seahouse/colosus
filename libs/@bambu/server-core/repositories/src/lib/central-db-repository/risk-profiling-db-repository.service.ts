import {
  CentralDbPrismaService,
  Prisma,
  QuestionnaireTypeEnum,
} from '@bambu/server-core/db/central-db';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import {
  IGetLatestQuestionnaireVersion,
  IGetRiskQuestionnaire,
  IRiskProfileDto,
  QuestionFormatEnum,
  ScoringRulesEnum,
} from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import { IPrismaRepositoryMapTypeDto, PrismaRepository } from '../base-classes';

class RisKProfilingMapType implements IPrismaRepositoryMapTypeDto {
  aggregate!: Prisma.RiskProfileAggregateArgs;
  count!: Prisma.RiskProfileCountArgs;
  create!: Prisma.RiskProfileCreateArgs;
  delete!: Prisma.RiskProfileDeleteArgs;
  deleteMany!: Prisma.RiskProfileDeleteManyArgs;
  findFirst!: Prisma.RiskProfileFindFirstArgs;
  findMany!: Prisma.RiskProfileFindManyArgs;
  findUnique!: Prisma.RiskProfileFindUniqueArgs;
  update!: Prisma.RiskProfileUpdateArgs;
  updateMany!: Prisma.RiskProfileUpdateManyArgs;
  upsert!: Prisma.RiskProfileUpsertArgs;
}
@Injectable()
export class RiskProfilingCentralDbService extends PrismaRepository<
  Prisma.RiskProfileDelegate<Prisma.RejectPerOperation>,
  RisKProfilingMapType
> {
  readonly #logger: Logger = new Logger(RiskProfilingCentralDbService.name);
  constructor(private readonly prisma: CentralDbPrismaService) {
    super(prisma.riskProfile);
  }

  public async GetRiskProfiles(
    tenantId: string,
    requestId: string
  ): Promise<IRiskProfileDto[] | null> {
    const loggingPrefix: string = LoggingUtils.generateLogPrefix(
      this.GetRiskProfiles.name,
      requestId
    );
    try {
      const results = await this.prisma.riskProfile.findMany({
        where: {
          tenantId: tenantId,
        },
      });

      const payload: IRiskProfileDto[] = [];

      for (const {
        id,
        lowerLimit,
        upperLimit,
        riskProfileName,
        riskProfileDescription,
        tenantId,
      } of results) {
        payload.push({
          id,
          lowerLimit: lowerLimit.toString(),
          upperLimit: upperLimit.toString(),
          riskProfileName,
          riskProfileDescription,
          tenantId,
        });
      }

      this.#logger.debug(
        `${loggingPrefix} Got risk profiles belonging to tenant (${tenantId}).`
      );
      return payload;
    } catch (error) {
      this.#logger.error(
        `${loggingPrefix} Error getting risk profiles for tenant (${tenantId}). Error: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  public async InitializeTenantRiskProfiles({
    tenantId,
    requestId,
  }: {
    tenantId: string;
    requestId: string;
  }): Promise<void> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.InitializeTenantRiskProfiles.name,
      requestId
    );

    const timeStamp = new Date();

    this.#logger.debug(
      `${logPrefix} Initializing risk profiles for tenant: (${tenantId}).`
    );

    try {
      await this.prisma.riskProfile.createMany({
        data: [
          {
            lowerLimit: '1',
            upperLimit: '1',
            tenantId: tenantId,
            riskProfileName: 'Very Conservative',
            riskProfileDescription:
              'You don’t want to experience volatility in your portfolio.<br/>You don’t expect the value of your portfolio to go down at any significant period of time.<br/>You understand that expected returns are low.',
            createdAt: timeStamp,
            createdBy: super.dbRepoConfig.serviceUser,
            updatedAt: timeStamp,
            updatedBy: super.dbRepoConfig.serviceUser,
          },
          {
            lowerLimit: '2',
            upperLimit: '2',
            tenantId: tenantId,
            riskProfileName: 'Conservative',
            riskProfileDescription:
              'You are OK with a bit of volatility in your portfolio.<br/>You understand that the value of your portfolio may go down for a short period of time before it bounces back.<br/>You understand that expected returns are below average.',
            createdAt: timeStamp,
            createdBy: super.dbRepoConfig.serviceUser,
            updatedAt: timeStamp,
            updatedBy: super.dbRepoConfig.serviceUser,
          },
          {
            lowerLimit: '3',
            upperLimit: '3',
            tenantId: tenantId,
            riskProfileName: 'Balanced',
            riskProfileDescription:
              'You are OK with some volatility in your portfolio.<br/>You understand that the value of your portfolio may go down for a moderate period of time before it bounces back.<br/>You understand that expected returns are average.',
            createdAt: timeStamp,
            createdBy: super.dbRepoConfig.serviceUser,
            updatedAt: timeStamp,
            updatedBy: super.dbRepoConfig.serviceUser,
          },
          {
            lowerLimit: '4',
            upperLimit: '4',
            tenantId: tenantId,
            riskProfileName: 'Growth',
            riskProfileDescription:
              'You are OK with volatility in your portfolio.<br/>You understand that the value of your portfolio may go down for a significant period of time before it bounces back.<br/>You expect good returns in the mid to long term.',
            createdAt: timeStamp,
            createdBy: super.dbRepoConfig.serviceUser,
            updatedAt: timeStamp,
            updatedBy: super.dbRepoConfig.serviceUser,
          },
          {
            lowerLimit: '5',
            upperLimit: '5',
            tenantId: tenantId,
            riskProfileName: 'Aggressive',
            riskProfileDescription:
              'You are OK with high volatility in your portfolio.<br/>You understand that the value of your portfolio may go down sharply in the future but you know that you will reap big benefits if you are patient enough.<br/>You expect high returns in the long term.',
            createdAt: timeStamp,
            createdBy: super.dbRepoConfig.serviceUser,
            updatedAt: timeStamp,
            updatedBy: super.dbRepoConfig.serviceUser,
          },
        ],
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error getting risk profiles for tenant (${tenantId}). Error: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  public async GetLatestRiskQuestionnaireVersionNumber({
    tenantId,
    requestId,
  }: {
    tenantId: string;
    requestId: string;
  }): Promise<IGetLatestQuestionnaireVersion | null> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.GetLatestRiskQuestionnaireVersionNumber.name,
      requestId
    );

    this.#logger.debug(
      `${logPrefix} Getting Risk Questionnire Version number for tenant: (${tenantId}).`
    );

    try {
      const results = await this.prisma.questionnaire.findFirst({
        where: {
          tenantId: tenantId,
        },
        include: {
          QuestionnaireVersions: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!results) {
        const questionnaireVersionNotFoundError = new ErrorUtils.ColossusError(
          'Error! No latest questionnaire version found for this tenant',
          requestId,
          { tenantId },
          404
        );
        this.#logger.error(
          `${logPrefix} Error: ${JsonUtils.Stringify(
            questionnaireVersionNotFoundError
          )} `
        );
        throw questionnaireVersionNotFoundError;
      }

      const payload: IGetLatestQuestionnaireVersion = {
        id: results.id,
        questionnaireType:
          results.questionnaireType as QuestionnaireTypeEnum.RISK_PROFILING_QUESTIONNAIRE,
        questionnaireVersion: Number(results.activeVersion),
        versionId: results.QuestionnaireVersions[0].id,
      };

      return payload;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error getting Risk Questionnire Version number for tenant (${tenantId}). Error: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  private async InitializeRiskQuestionnaireVersion({
    tenantId,
    requestId,
  }: {
    tenantId: string;
    requestId: string;
  }) {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.InitializeRiskQuestionnaireVersion.name,
      requestId
    );

    this.#logger.debug(
      `${logPrefix} Initializing Risk Questionnaire Version for tenant: ${tenantId} `
    );

    try {
      const questionnaireResult = await this.prisma.questionnaire.create({
        data: {
          questionnaireType: QuestionnaireTypeEnum.RISK_PROFILING_QUESTIONNAIRE,
          tenantId: tenantId,
          activeVersion: 1,
          questionnaireDescription: 'Intial questionnaire',
          questionnaireName: 'Intial questionnaire',
          createdBy: super.dbRepoConfig.serviceUser,
          updatedBy: super.dbRepoConfig.serviceUser,
        },
      });

      const version = await this.prisma.questionnaireVersions.create({
        data: {
          versionNumber: 1,
          versionDescription: 'Intial Version',
          versionNotes: 'Initial Version',
          questionnaireId: questionnaireResult.id,
          createdBy: super.dbRepoConfig.serviceUser,
          updatedBy: super.dbRepoConfig.serviceUser,
        },
      });
      return version.id;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error Initializing Risk Questionnaire Version for tenant: (${tenantId}). Error: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  public async InitializeQuestionnaireData({
    tenantId,
    requestId,
  }: {
    tenantId: string;
    requestId: string;
  }) {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.InitializeQuestionnaireData.name,
      requestId
    );

    const initData = [
      {
        groupingType: 'RISK_CAPACITY',
        groupingName: 'FINANCIAL_HEALTH',
        groupingWeight: 0.4,
        scoringRules: ScoringRulesEnum.MAX,
        additionalConfiguration: {
          questionRoundFlag: true,
        },
        sortKey: 1,
        Questions: [
          {
            question:
              'How much do you roughly save out of your monthly income?',
            questionType: 'INCOME',
            questionFormat: QuestionFormatEnum.NUMERIC_ENTRY,
            questionWeight: 0.5,
            sortKey: 1,
            additionalConfiguration: {
              questionFloorFlag: true,
              questionNormalisationFactor1: '1',
              questionNormalisationFactor2: '5',
              scoreRangeConfig: [
                {
                  label: '<10%',
                  lowerBound: 0,
                  upperBound: 9,
                  score: 1,
                },
                {
                  answer: '10-25%',
                  lowerBound: 10,
                  upperBound: 24,
                  score: 2,
                },
                {
                  answer: '25-35%',
                  lowerBound: 25,
                  upperBound: 34,
                  score: 3,
                },
                {
                  answer: '35-50%',
                  lowerBound: 35,
                  upperBound: 49,
                  score: 4,
                },
                {
                  answer: '>50%',
                  lowerBound: 50,
                  upperBound: 100,
                  score: 5,
                },
              ],
            },
            Answers: [],
          },
          {
            question:
              'How much of your liquid assets are you planning to invest here?',
            questionType: 'BALANCE_SHEET',
            questionFormat: QuestionFormatEnum.SINGLE_CHOICE,
            questionWeight: 0.5,
            sortKey: 2,
            additionalConfiguration: {
              questionFloorFlag: true,
              questionNormalisationFactor1: '1',
              questionNormalisationFactor2: '5',
            },
            Answers: [
              {
                answer: '>85%',
                score: 1,
                sortKey: 5,
              },
              {
                answer: '70-85%',
                score: 2,
                sortKey: 4,
              },
              {
                answer: '50-70%',
                score: 3,
                sortKey: 3,
              },
              {
                answer: '35-50%',
                score: 4,
                sortKey: 2,
              },
              {
                answer: '<35%',
                score: 5,
                sortKey: 1,
              },
            ],
          },
        ],
      },
      {
        groupingType: 'RISK_CAPACITY',
        groupingName: 'GOAL',
        groupingWeight: 0.2,
        scoringRules: ScoringRulesEnum.MAX,
        sortKey: 2,
        additionalConfiguration: {
          questionNormalisationFactor1: '1',
          questionNormalisationFactor2: '12',
          questionRoundDownFlag: true,
        },
        Questions: [
          {
            question: 'When do you want to achieve your goal?',
            questionType: 'GOAL_TIME_FRAME',
            questionFormat: QuestionFormatEnum.NUMERIC_ENTRY,
            questionWeight: null,
            sortKey: 1,
            additionalConfiguration: null,
            Answers: [],
          },
        ],
      },
      {
        groupingType: 'RISK_CAPACITY',
        groupingName: 'AGE',
        groupingWeight: 0.2,
        scoringRules: ScoringRulesEnum.MAX,
        sortKey: 3,
        additionalConfiguration: {
          questionNormalisationFactor1: '70',
          questionNormalisationFactor2: '18',
          questionRoundUpFlag: true,
        },
        Questions: [
          {
            question: 'How old are you?',
            questionType: 'AGE',
            questionFormat: QuestionFormatEnum.NUMERIC_ENTRY,
            questionWeight: null,
            sortKey: 1,
            additionalConfiguration: null,
            Answers: [],
          },
        ],
      },
      {
        groupingType: 'RISK_CAPACITY',
        groupingName: 'FINANCIAL_KNOWLEDGE',
        groupingWeight: 0.2,
        scoringRules: ScoringRulesEnum.MAX,
        sortKey: 4,
        additionalConfiguration: {
          questionNormalisationFactor1: '1',
          questionNormalisationFactor2: '5',
        },
        Questions: [
          {
            question: 'How familiar are you with investing?',
            questionType: 'FINANCIAL_KNOWLEDGE',
            questionFormat: QuestionFormatEnum.SINGLE_CHOICE,
            questionWeight: null,
            sortKey: 1,
            additionalConfiguration: null,
            Answers: [
              {
                answer: 'No experience',
                score: 1,
                sortKey: 5,
              },
              {
                answer: 'Some experience',
                score: 2,
                sortKey: 4,
              },
              {
                answer: 'Average experience',
                score: 3,
                sortKey: 3,
              },
              {
                answer: 'High experience',
                score: 4,
                sortKey: 2,
              },
              {
                answer: 'Expert',
                score: 5,
                sortKey: 1,
              },
            ],
          },
        ],
      },
      {
        groupingType: 'RISK_TOLERANCE',
        groupingName: 'RISK_COMFORT_LEVEL',
        groupingWeight: 0.5,
        scoringRules: ScoringRulesEnum.MAX,
        sortKey: 1,
        additionalConfiguration: {
          questionCapFlag: true,
          questionRoundDownFlag: true,
        },
        Questions: [
          {
            question:
              'What level of risk are you comfortable with for this portfolio?',
            questionType: 'RISK_COMFORT_LEVEL',
            questionFormat: QuestionFormatEnum.SINGLE_CHOICE,
            questionWeight: 0.5,
            sortKey: 1,
            additionalConfiguration: {
              questionNormalisationFactor1: '1',
              questionNormalisationFactor2: '4',
            },
            Answers: [
              {
                answer:
                  "No risk <br/>this portfolio's value should be slowly but surely going up.",
                score: 1,
                sortKey: 4,
              },
              {
                answer:
                  "Limited risk <br/>this portfolio's value can go down for a short period of time but its value should be going up most of the time.",
                score: 2,
                sortKey: 3,
              },
              {
                answer:
                  "Significant risk <br/>this portfolio's value will go down for a certain period of time but it should recover if I am patient enough.",
                score: 3,
                sortKey: 2,
              },
              {
                answer:
                  "High risk <br/>this portfolio's value may fluctuate widely but I trust that it will pay off very significantly at one point in the future.",
                score: 4,
                sortKey: 1,
              },
            ],
          },
          {
            question:
              'Imagine you witness a sudden drop in the value of this portfolio due to market fluctuations. What will you do?',
            questionType: 'RISK_COMFORT_LEVEL',
            questionFormat: QuestionFormatEnum.SINGLE_CHOICE,
            questionWeight: 0.5,
            sortKey: 2,
            additionalConfiguration: {
              questionNormalisationFactor1: '1',
              questionNormalisationFactor2: '4',
            },
            Answers: [
              {
                answer:
                  'I will fully redeem this portfolio to avoid further losses.',
                score: 1,
                sortKey: 1,
              },
              {
                answer:
                  'I will sell a part of this portfolio to minimise exposure, but keep some in hope that prices bounce back.',
                score: 2,
                sortKey: 2,
              },
              {
                answer:
                  'I will continue holding onto my portfolio and hope it returns to the original price.',
                score: 3,
                sortKey: 3,
              },
              {
                answer:
                  'I will invest more into this portfolio since its price is likely to bounce back.',
                score: 4,
                sortKey: 4,
              },
            ],
          },
        ],
      },
    ];

    this.#logger.debug(
      `${logPrefix} Initializing Questionnaire Data for tenant: ${tenantId} `
    );
    try {
      const versionId = await this.InitializeRiskQuestionnaireVersion({
        tenantId,
        requestId,
      });

      const results = initData.map(async (item) => {
        const groupingInsert = await this.prisma.questionnaireGroupings.create({
          data: {
            groupingType: item.groupingType,
            groupingName: item.groupingName,
            groupingWeight: item.groupingWeight,
            additionalConfiguration: item.additionalConfiguration || null,
            sortKey: item.sortKey,
            scoringRules: item.scoringRules,
            questionnaireVersionId: versionId,
            createdBy: super.dbRepoConfig.serviceUser,
            updatedBy: super.dbRepoConfig.serviceUser,
          },
        });

        const groupingId = groupingInsert.id;

        const questionsResults = item.Questions.map(async (question) => {
          const questionInsert =
            await this.prisma.questionnaireQuestions.create({
              data: {
                question: question.question,
                questionType: question.questionType,
                questionFormat: question.questionFormat,
                questionWeight: question.questionWeight || 0,
                sortKey: question.sortKey,
                additionalConfiguration: question.additionalConfiguration || {},
                questionnaireQuestionnaireGroupingsId: groupingId,
                createdBy: super.dbRepoConfig.serviceUser,
                updatedBy: super.dbRepoConfig.serviceUser,
              },
            });
          const questionId = questionInsert.id;

          const answersResults = question.Answers.map(async (answer) => {
            const answerInsert = await this.prisma.questionnaireAnswers.create({
              data: {
                answer: answer.answer,
                score: answer.score,
                sortKey: answer.sortKey,
                additionalConfiguration: {},
                riskProfileQuestionId: questionId,
                createdBy: super.dbRepoConfig.serviceUser,
                updatedBy: super.dbRepoConfig.serviceUser,
              },
            });
          });
          await Promise.all(answersResults);
        });

        await Promise.all(questionsResults);
      });

      await Promise.all(results);
      this.#logger.debug(
        `${logPrefix} Initializing Questionnaire Data for tenant: ${tenantId} finished `
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error Initializing Questionnaire Data for tenant: (${tenantId}). Error: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  public async GetRiskQuestionnaire({
    tenantId,
    requestId,
    versionNumber,
  }: {
    tenantId: string;
    requestId: string;
    versionNumber?: number;
  }): Promise<IGetRiskQuestionnaire> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.GetRiskQuestionnaire.name,
      requestId
    );

    this.#logger.debug(
      `${logPrefix} Getting Risk Questionnires tenant: (${tenantId}).`
    );

    let questionnaireVersionNumber;

    try {
      // if versionid is not provided, get the latest questionnaire VersionId
      if (!versionNumber) {
        const version = await this.GetLatestRiskQuestionnaireVersionNumber({
          tenantId,
          requestId,
        });

        questionnaireVersionNumber = version?.questionnaireVersion;

        this.#logger.debug(`${logPrefix} Questionnires Version ${version?.id}`);
      }

      questionnaireVersionNumber = versionNumber;

      const results = await this.prisma.questionnaire.findFirst({
        where: {
          tenantId: tenantId,
        },
        select: {
          id: true,
          questionnaireType: true,
          questionnaireName: true,
          activeVersion: true,
          tenantId: true,
          QuestionnaireVersions: {
            where: {
              versionNumber: questionnaireVersionNumber,
            },
            select: {
              versionNumber: true,
              versionDescription: true,
              questionnaireId: true,
              QuestionnaireGroupings: {
                select: {
                  id: true,
                  groupingName: true,
                  groupingType: true,
                  groupingWeight: true,
                  scoringRules: true,
                  sortKey: true,
                  additionalConfiguration: true,
                  questionnaireVersionId: true,
                  QuestionnaireQuestions: {
                    select: {
                      id: true,
                      question: true,
                      questionFormat: true,
                      questionType: true,
                      questionWeight: true,
                      sortKey: true,
                      questionnaireQuestionnaireGroupingsId: true,
                      additionalConfiguration: true,
                      QuestionnaireAnswers: {
                        select: {
                          id: true,
                          answer: true,
                          sortKey: true,
                          score: true,
                          additionalConfiguration: true,
                          riskProfileQuestionId: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!results) {
        const questionnairesNotFoundError = new ErrorUtils.ColossusError(
          'Error! No questionnaires found for this tenant',
          requestId,
          { tenantId },
          404
        );
        this.#logger.error(
          `${logPrefix} Error ${JsonUtils.Stringify(
            questionnairesNotFoundError
          )}`
        );
        throw questionnairesNotFoundError;
      }

      const payload = {
        id: results.id,
        questionnaireType:
          results.questionnaireType as QuestionnaireTypeEnum.RISK_PROFILING_QUESTIONNAIRE,
        questionnaireName: results.questionnaireName,
        activeVersion: results.activeVersion,
        Questionnaire:
          results.QuestionnaireVersions[0].QuestionnaireGroupings.map(
            (questionnaireGrouping) => ({
              id: questionnaireGrouping.id,
              groupingType: questionnaireGrouping.groupingType,
              groupingName: questionnaireGrouping.groupingName,
              groupingWeight: questionnaireGrouping.groupingWeight.toString(),
              scoringRules: questionnaireGrouping.scoringRules,
              sortKey: questionnaireGrouping.sortKey,
              additionalConfiguration:
                questionnaireGrouping.additionalConfiguration,
              Questions: questionnaireGrouping.QuestionnaireQuestions.map(
                (questionItem) => ({
                  id: questionItem.id,
                  question: questionItem.question,
                  questionType: questionItem.questionType,
                  questionFormat: questionItem.questionFormat,
                  questionWeight: questionItem.questionWeight.toString(),
                  sortKey: questionItem.sortKey,
                  additionalConfiguration: questionItem.additionalConfiguration,
                  Answers: questionItem.QuestionnaireAnswers.map(
                    (answeritem) => ({
                      id: answeritem.id,
                      answer: answeritem.answer,
                      sortKey: answeritem.sortKey,
                      score: answeritem.score.toString(),
                      additionalConfiguration:
                        answeritem.additionalConfiguration,
                    })
                  ),
                })
              ),
            })
          ),
      };
      return payload;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while getting risk questionnaires for tenant: (${tenantId}) error: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }
}
