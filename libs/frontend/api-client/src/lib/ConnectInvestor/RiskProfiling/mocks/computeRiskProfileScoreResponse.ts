import { ConnectInvestorComputeRiskProfileScoreResponseDto } from '../RiskProfiling';

export const r = {
  questionnaireId: 'cbacafa5-7d7e-4d39-9bc3-6ce1839e3266',
  questionnaireVersion: 1,
  questionnairePayload: [
    {
      questionGroupingId: '7ca3ad84-fa07-4bbf-8e5e-d21f5347df47',
      questionId: 'c0b51a4b-4f17-42c9-8e63-2fa78dc52dc3',
      answerId: '',
      answerScoreNumber: 21,
    },
    {
      questionGroupingId: '7ca3ad84-fa07-4bbf-8e5e-d21f5347df47',
      questionId: '3b216868-890a-4c47-9566-f5b6c983bd71',
      answerId: '417e9e23-88b7-4563-98e5-4638dacf4154',
      answerScoreNumber: null,
    },
    {
      questionGroupingId: '422e5300-286f-4294-aa4b-b7adcc273bb2',
      questionId: 'b8d89946-6f33-4b77-8ea5-e49484421890',
      answerId: '',
      answerScoreNumber: 10,
    },
    {
      questionGroupingId: 'cb5bcc9e-a911-4be0-834b-50c9e00902f8',
      questionId: 'a624ebe3-ae95-4581-97d7-4edcae4c3f77',
      answerId: '',
      answerScoreNumber: 30,
    },
    {
      questionGroupingId: '18e3b245-8138-4e01-85b8-0dd71c549e1e',
      questionId: 'd5fe0921-a78f-42d7-8305-bf6014e0325e',
      answerId: '1fd21a14-0bb5-40e6-9564-4178fb5461b8',
      answerScoreNumber: null,
    },
    {
      questionGroupingId: '73ef469b-0ce4-4094-b7aa-9eb1fba08c76',
      questionId: 'ef508bec-c453-47f2-9d1d-e77b10409fb6',
      answerId: '01f8d423-1d4d-42fd-8e42-91310a40c8d7',
      answerScoreNumber: null,
    },
    {
      questionGroupingId: '8bed6ec9-b81f-4190-8ba7-d4f2ed4aea97',
      questionId: 'c22a1a56-ed1b-47c6-bda6-461c125ac0d4',
      answerId: 'c35126f0-9526-43da-bab7-83d9bad6546d',
      answerScoreNumber: null,
    },
    {
      questionGroupingId: '8bed6ec9-b81f-4190-8ba7-d4f2ed4aea97',
      questionId: 'a5b99ad4-3e58-40ad-a114-5589d54c8b85',
      answerId: 'e92ee43e-776b-44eb-83e9-c4edc43bf9cf',
      answerScoreNumber: null,
    },
  ],
  riskProfileComputationResult: [
    {
      questionCategoryName: 'Risk Capacity',
      questionId: '1',
      questionScoreDetails: [
        {
          questionCategoryName: 'FINANCIAL_HEALTH',
          questionId: '1.1',
          questionScoreDetails: [
            {
              questionCategoryName: 'INCOME',
              questionId: '1',
              questionScore: '5',
              questionWeight: '0.5',
            },
            {
              questionCategoryName: 'BALANCE_SHEET',
              questionId: '2',
              questionScore: '1',
              questionWeight: '0.5',
            },
          ],
          questionScore: '5',
          questionWeight: '0.4',
        },
        {
          questionCategoryName: 'AGE',
          questionId: '1.2',
          questionScore: '5',
          questionWeight: '0.2',
        },
        {
          questionCategoryName: 'GOAL',
          questionId: '1.3',
          questionScore: '4',
          questionWeight: '0.2',
        },
        {
          questionCategoryName: 'FINANCIAL_KNOWLEDGE',
          questionId: '1.4',
          questionScore: '1',
          questionWeight: '0.2',
        },
      ],
      questionScore: '4',
      questionWeight: '0.5',
    },
    {
      questionCategoryName: 'Risk Tolerance',
      questionId: '2',
      questionScoreDetails: [
        {
          questionCategoryName: 'RISK_COMFORT_LEVEL',
          questionId: '1',
          questionScore: '2.33333333',
          questionWeight: '0.5',
        },
        {
          questionCategoryName: 'RISK_COMFORT_LEVEL',
          questionId: '2',
          questionScore: '2.33333333',
          questionWeight: '0.5',
        },
      ],
      questionScore: '2',
      questionWeight: '0.5',
    },
  ],
  riskProfileScore: '2',
  modelRiskProfile: {
    riskProfileId: '095f203e-ef0c-42fe-8e17-eecdf8ab69b7',
    riskProfileName: 'Conservative',
    riskProfileDescription:
      'You are OK with a bit of volatility in your portfolio.<br/>You understand that the value of your portfolio may go down for a short period of time before it bounces back.<br/>You understand that expected returns are below average.',
  },
  modelPortfolioId: '3d3dd80b-a899-4650-b9e0-588cc8fb1664',
} satisfies ConnectInvestorComputeRiskProfileScoreResponseDto;
