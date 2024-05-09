process.env.STRIPE_SECRET_KEY = 'STRIPE_SECRET_KEY';
process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET = 'STRIPE_WEBHOOK_ENDPOINT_SECRET';

import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { RiskProfilingDomainService } from './risk-profiling.service';
import { RiskProfilingDomainServiceBase } from './risk-profiling.service.base';
import { RiskProfilingCentralDbService } from '@bambu/server-core/repositories';
import { Test, TestingModule } from '@nestjs/testing';
import * as crypto from 'crypto';
import { QuestionnaireTypeEnum } from '@bambu/shared';

describe('RiskProfilingDomainService', () => {
  let service: RiskProfilingDomainServiceBase;
  const RiskProfilingCentralDbServiceMock: DeepMockProxy<RiskProfilingCentralDbService> =
    mockDeep<RiskProfilingCentralDbService>();
  // const RiskProfilingDomainServiceBaseMock: DeepMockProxy<RiskProfilingDomainServiceBase> =
  //   mockDeep<RiskProfilingDomainServiceBase>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RiskProfilingCentralDbService,
          useFactory: () => {
            return RiskProfilingCentralDbServiceMock;
          },
        },
        {
          provide: RiskProfilingDomainServiceBase,
          useClass: RiskProfilingDomainService,
        },
      ],
    }).compile();
    service = module.get<RiskProfilingDomainServiceBase>(
      RiskProfilingDomainServiceBase
    );
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get risk-profiles', () => {
    it('Should have GetRiskProfiles defined', () => {
      expect(service.GetRiskProfiles).toBeDefined();
    });
  });

  describe('Get risk-profiles', () => {
    it('It should return risk-profiles for tenant', async () => {
      const riksProfileTest = {
        id: '1c02181a-623d-4b6a-85d2-b528567498a0',
        lowerLimit: '1',
        upperLimit: '1',
        riskProfileName: 'Low Risk',
        riskProfileDescription:
          'You don’t want to experience volatility in your portfolio.<br/>You don’t expect the value of your portfolio to go down at any point in time.<br/>You should also understand that expected returns are very low.',
        tenantId: '9f0165e8-fa92-4bbf-808e-9dc7b6956970',
      };

      jest.clearAllMocks();
      RiskProfilingCentralDbServiceMock.GetRiskProfiles.mockResolvedValueOnce([
        riksProfileTest,
        riksProfileTest,
        riksProfileTest,
        riksProfileTest,
        riksProfileTest,
      ]);

      const result = await service.GetRiskProfiles({
        tenantId: crypto.randomUUID(),
        requestId: crypto.randomUUID(),
      });

      expect(result).toBeDefined();
      expect(result[0].id).not.toBeNull();
      expect(result[0].riskProfileName).not.toBeNull();
      expect(result[0].riskProfileDescription).not.toBeNull();
      expect(result[0].upperLimit).not.toBeNull();
      expect(result[0].lowerLimit).not.toBeNull();
      expect(result[0].tenantId).not.toBeNull();
    });
  });

  describe('Get risk-profiles latest questionnaire version', () => {
    it('Should have latest questionnaire defined', () => {
      expect(service.GetLatestRiskQuestionnaireVersionNumber).toBeDefined();
    });
  });

  describe('Get risk-profiles latest questionnaire version', () => {
    it('It should return latest questionnaire version', async () => {
      const latestQuestionnaireVersion = {
        id: 'd4a1657c-e0f6-45f4-b0a5-42fc3a0eb888',
        questionnaireType: QuestionnaireTypeEnum.RISK_PROFILING_QUESTIONNAIRE,
        questionnaireVersion: 1,
        versionId: '29600c30-33a8-4693-b6b2-dbd3955d83a8',
      };

      jest.clearAllMocks();

      RiskProfilingCentralDbServiceMock.GetLatestRiskQuestionnaireVersionNumber.mockResolvedValueOnce(
        latestQuestionnaireVersion
      );

      const result = await service.GetLatestRiskQuestionnaireVersionNumber({
        tenantId: crypto.randomUUID(),
        requestId: crypto.randomUUID(),
      });

      expect(result).toBeDefined();
      expect(result.id).not.toBeNull();
      expect(result.questionnaireType).not.toBeNull();
      expect(result.questionnaireVersion).not.toBeNull();
    });
  });

  describe('Get risk-profiles questionnaire', () => {
    it('Should have GetRiskQuestionnaire defined', () => {
      expect(service.GetRiskQuestionnaire).toBeDefined();
    });
  });

  describe('Get risk-profiles questionnaire', () => {
    it('It should return questionnaire for given tenant', async () => {
      const riskProfilingQuestionnaire = {
        id: 'd4a1657c-e0f6-45f4-b0a5-42fc3a0eb888',
        questionnaireType: QuestionnaireTypeEnum.RISK_PROFILING_QUESTIONNAIRE,
        questionnaireName: 'Intial questionnaire',
        activeVersion: 1,
        Questionnaire: [
          {
            id: '9fb91619-0455-4f6f-a44d-dcb637f92498',
            groupingType: 'RISK_CAPACITY',
            groupingName: 'FINANCIAL_HEALTH',
            groupingWeight: '0.4',
            scoringRules: 'MAX',
            sortKey: 1,
            additionalConfiguration: {
              questionRoundFlag: true,
            },
            Questions: [
              {
                id: 'cf7c0d5b-7a7a-427a-9ff0-06f76848829d',
                question:
                  'How much of your liquid assets are you planning to invest here?',
                questionType: 'BALANCE_SHEET',
                questionFormat: 'SINGLE_CHOICE',
                questionWeight: '0.5',
                sortKey: 2,
                Answers: [
                  {
                    id: '65da7360-3bd4-40d4-bcea-fd6995f40ac0',
                    answer: '>85%',
                    sortKey: 1,
                    score: '1',
                    additionalConfiguration: {},
                  },
                  {
                    id: 'f717dac9-a6de-46f4-9647-34448e8221a2',
                    answer: '70-85%',
                    sortKey: 2,
                    score: '2',
                    additionalConfiguration: {},
                  },
                ],
              },
              {
                id: 'd43d7e98-0470-42c9-b20b-85887b812d79',
                question:
                  'How much do you roughly save out of your monthly income?',
                questionType: 'INCOME',
                questionFormat: 'NUMERIC_ENTRY',
                questionWeight: '0.5',
                sortKey: 1,
                additionalConfiguration: {
                  scoreRangeConfig: [
                    {
                      label: '<10%',
                      score: 1,
                      lowerBound: 0,
                      upperBound: 9,
                    },
                    {
                      score: 5,
                      answer: '>50%',
                      lowerBound: 50,
                      upperBound: 100,
                    },
                  ],
                  questionFloorFlag: true,
                  questionNormalisationFactor1: '1',
                  questionNormalisationFactor2: '5',
                },
                Answers: [],
              },
            ],
          },
        ],
      };

      jest.clearAllMocks();

      RiskProfilingCentralDbServiceMock.GetRiskQuestionnaire.mockResolvedValueOnce(
        riskProfilingQuestionnaire
      );

      const result = await service.GetRiskQuestionnaire({
        tenantId: crypto.randomUUID(),
        requestId: crypto.randomUUID(),
      });

      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result.id).toBeDefined();
      expect(result.id).not.toBeNull();
      expect(result.activeVersion).toBeDefined();
      expect(result.activeVersion).not.toBeNull();
      expect(result.questionnaireName).toBeDefined();
      expect(result.questionnaireName).not.toBeNull();
      expect(result.Questionnaire).toBeDefined();
      expect(result.Questionnaire).not.toBeNull();
      expect(result.Questionnaire).toBeDefined();
      expect(result.Questionnaire).not.toBeNull();
      expect(result.Questionnaire[0].Questions).toBeDefined();
      expect(result.Questionnaire[0].Questions).not.toBeNull();
      expect(result.Questionnaire[0].Questions[0].Answers).toBeDefined();
    });
  });
});
