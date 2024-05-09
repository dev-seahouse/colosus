import { QuestionnaireTypeEnum } from '@bambu/shared';
import { ConnectGetInvestorRiskQuestionnaireResponseDto } from '../RiskProfiling';

export const r = {
  id: 'cbacafa5-7d7e-4d39-9bc3-6ce1839e3266',
  questionnaireType: QuestionnaireTypeEnum.RISK_PROFILING_QUESTIONNAIRE,
  questionnaireName: 'Initial Questionnaire',
  activeVersion: 1,
  Questionnaire: [
    {
      id: '7ca3ad84-fa07-4bbf-8e5e-d21f5347df47',
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
          id: 'c0b51a4b-4f17-42c9-8e63-2fa78dc52dc3',
          question: 'How much do you roughly save out of your monthly income?',
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
                score: 2,
                answer: '10-25%',
                lowerBound: 10,
                upperBound: 24,
              },
              {
                score: 3,
                answer: '25-35%',
                lowerBound: 25,
                upperBound: 34,
              },
              {
                score: 4,
                answer: '35-50%',
                lowerBound: 35,
                upperBound: 49,
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
        {
          id: '3b216868-890a-4c47-9566-f5b6c983bd71',
          question:
            'How much of your liquid assets are you planning to invest here?',
          questionType: 'BALANCE_SHEET',
          questionFormat: 'SINGLE_CHOICE',
          questionWeight: '0.5',
          sortKey: 2,
          additionalConfiguration: {
            questionFloorFlag: true,
            questionNormalisationFactor1: '1',
            questionNormalisationFactor2: '5',
          },
          Answers: [
            {
              id: '417e9e23-88b7-4563-98e5-4638dacf4154',
              answer: '>85%',
              sortKey: 1,
              score: '1',
              additionalConfiguration: {},
            },
            {
              id: 'b6659756-973e-4f2c-8163-a3991610b817',
              answer: '<35%',
              sortKey: 5,
              score: '5',
              additionalConfiguration: {},
            },
            {
              id: '347f5afd-28a6-469a-838a-42443b026c35',
              answer: '70-85%',
              sortKey: 2,
              score: '2',
              additionalConfiguration: {},
            },
            {
              id: '4050301e-070d-4608-a8f8-636c3114b577',
              answer: '50-70%',
              sortKey: 3,
              score: '3',
              additionalConfiguration: {},
            },
            {
              id: 'ae152c9d-9291-4dad-bac0-cce28427a14b',
              answer: '35-50%',
              sortKey: 4,
              score: '4',
              additionalConfiguration: {},
            },
          ],
        },
      ],
    },
    {
      id: '422e5300-286f-4294-aa4b-b7adcc273bb2',
      groupingType: 'RISK_CAPACITY',
      groupingName: 'GOAL',
      groupingWeight: '0.2',
      scoringRules: 'MAX',
      sortKey: 2,
      additionalConfiguration: {
        questionRoundDownFlag: true,
        questionNormalisationFactor1: '1',
        questionNormalisationFactor2: '12',
      },
      Questions: [
        {
          id: 'b8d89946-6f33-4b77-8ea5-e49484421890',
          question: 'When do you want to achieve your goal?',
          questionType: 'GOAL_TIME_FRAME',
          questionFormat: 'NUMERIC_ENTRY',
          questionWeight: '0',
          sortKey: 1,
          additionalConfiguration: {},
          Answers: [],
        },
      ],
    },
    {
      id: 'cb5bcc9e-a911-4be0-834b-50c9e00902f8',
      groupingType: 'RISK_CAPACITY',
      groupingName: 'AGE',
      groupingWeight: '0.2',
      scoringRules: 'MAX',
      sortKey: 3,
      additionalConfiguration: {
        questionRoundUpFlag: true,
        questionNormalisationFactor1: '70',
        questionNormalisationFactor2: '18',
      },
      Questions: [
        {
          id: 'a624ebe3-ae95-4581-97d7-4edcae4c3f77',
          question: 'How old are you?',
          questionType: 'AGE',
          questionFormat: 'NUMERIC_ENTRY',
          questionWeight: '0',
          sortKey: 1,
          additionalConfiguration: {},
          Answers: [],
        },
      ],
    },
    {
      id: '18e3b245-8138-4e01-85b8-0dd71c549e1e',
      groupingType: 'RISK_CAPACITY',
      groupingName: 'FINANCIAL_KNOWLEDGE',
      groupingWeight: '0.2',
      scoringRules: 'MAX',
      sortKey: 4,
      additionalConfiguration: {
        questionNormalisationFactor1: '1',
        questionNormalisationFactor2: '5',
      },
      Questions: [
        {
          id: 'd5fe0921-a78f-42d7-8305-bf6014e0325e',
          question: 'How familiar are you with investing?',
          questionType: 'FINANCIAL_KNOWLEDGE',
          questionFormat: 'SINGLE_CHOICE',
          questionWeight: '0',
          sortKey: 1,
          additionalConfiguration: {},
          Answers: [
            {
              id: '1fd21a14-0bb5-40e6-9564-4178fb5461b8',
              answer: 'Not familiar at all',
              sortKey: 1,
              score: '1',
              additionalConfiguration: {},
            },
            {
              id: 'c43a21fb-b0bf-4ff3-921d-8cc0f26cd93c',
              answer: 'Moderately familiar',
              sortKey: 3,
              score: '3',
              additionalConfiguration: {},
            },
            {
              id: 'c8f5da66-f60a-4a8d-a2f4-527addb2007f',
              answer: 'Somewhat familiar',
              sortKey: 2,
              score: '2',
              additionalConfiguration: {},
            },
            {
              id: 'd9ac8294-d708-4fda-8de2-dfbae938d3a9',
              answer: 'Very familiar',
              sortKey: 4,
              score: '4',
              additionalConfiguration: {},
            },
            {
              id: '51820ac7-a20f-496d-9be0-ade5d5e3cdf3',
              answer: 'Extremely familiar',
              sortKey: 5,
              score: '5',
              additionalConfiguration: {},
            },
          ],
        },
      ],
    },
    {
      id: '8bed6ec9-b81f-4190-8ba7-d4f2ed4aea97',
      groupingType: 'RISK_TOLERANCE',
      groupingName: 'RISK_COMFORT_LEVEL',
      groupingWeight: '0.5',
      scoringRules: 'MAX',
      sortKey: 1,
      additionalConfiguration: {
        questionCapFlag: true,
        questionRoundDownFlag: true,
      },
      Questions: [
        {
          id: 'c22a1a56-ed1b-47c6-bda6-461c125ac0d4',
          question:
            'What level of risk are you comfortable with for this portfolio?',
          questionType: 'RISK_COMFORT_LEVEL',
          questionFormat: 'SINGLE_CHOICE',
          questionWeight: '0.5',
          sortKey: 1,
          additionalConfiguration: {
            questionNormalisationFactor1: '1',
            questionNormalisationFactor2: '4',
          },
          Answers: [
            {
              id: 'c35126f0-9526-43da-bab7-83d9bad6546d',
              answer:
                "Limited risk: this portfolio's value can go down for a short period of time but its value should be going up most of the time.",
              sortKey: 2,
              score: '2',
              additionalConfiguration: {},
            },
            {
              id: '93d246b3-c60a-47ba-92c0-4e965e13e3e1',
              answer:
                "No risk: this portfolio's value should be slowly but surely going up.",
              sortKey: 1,
              score: '1',
              additionalConfiguration: {},
            },
            {
              id: '42109835-a9b8-4d49-97d0-bbed07f4a916',
              answer:
                "Significant risk: this portfolio's value will go down for a certain period of time but it should recover if I am patient enough.",
              sortKey: 3,
              score: '3',
              additionalConfiguration: {},
            },
            {
              id: '54808119-6022-4061-8315-84e1409d3435',
              answer:
                "High risk: this portfolio's value may fluctuate widely but I trust that it will pay off very significantly at one point in the future.",
              sortKey: 4,
              score: '4',
              additionalConfiguration: {},
            },
          ],
        },
        {
          id: 'a5b99ad4-3e58-40ad-a114-5589d54c8b85',
          question:
            'Imagine you witness a sudden drop in the value of this portfolio due to market fluctuations. What will you do?',
          questionType: 'RISK_COMFORT_LEVEL',
          questionFormat: 'SINGLE_CHOICE',
          questionWeight: '0.5',
          sortKey: 1,
          additionalConfiguration: {
            questionNormalisationFactor1: '1',
            questionNormalisationFactor2: '4',
          },
          Answers: [
            {
              id: 'e92ee43e-776b-44eb-83e9-c4edc43bf9cf',
              answer:
                'I will sell a part of this portfolio to minimise exposure, but keep some in hope that prices bounce back.',
              sortKey: 2,
              score: '2',
              additionalConfiguration: {},
            },
            {
              id: '525edb8d-02d5-4703-b60a-94e1b0241dea',
              answer:
                'I will invest more into this portfolio since its price is likely to bounce back.',
              sortKey: 4,
              score: '4',
              additionalConfiguration: {},
            },
            {
              id: '84caa058-0c20-403b-899a-236973aca339',
              answer:
                'I will continue holding onto my portfolio and hope it returns to the original price.',
              sortKey: 3,
              score: '3',
              additionalConfiguration: {},
            },
            {
              id: '84171849-70a5-4325-ae6e-e8203f62c5b3',
              answer:
                'I will fully redeem this portfolio to avoid further losses.',
              sortKey: 1,
              score: '1',
              additionalConfiguration: {},
            },
          ],
        },
      ],
    },
  ],
} satisfies ConnectGetInvestorRiskQuestionnaireResponseDto;
