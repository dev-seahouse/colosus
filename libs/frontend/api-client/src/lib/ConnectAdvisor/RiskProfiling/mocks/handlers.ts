import { rest } from 'msw';
import type {
  ConnectAdvisorGetQuestionnaireResponseDto,
  ConnectAdvisorGetRiskProfilesResponseDto,
} from '../RiskProfiling';
import { r as advisorGetRiskQuestionnnaireResponse } from './advisorGetRiskQuestionnaireResponse';

const BASE_URL = 'http://localhost:9000/api/v1/connect/advisor/risk-profiling';

export const connectAdvisorRiskProfilingApiHandlers = [
  rest.get(`${BASE_URL}/questionnaire`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json<ConnectAdvisorGetQuestionnaireResponseDto>(
        advisorGetRiskQuestionnnaireResponse
      )
    );
  }),
  rest.get(`${BASE_URL}/risk-profiles`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json<ConnectAdvisorGetRiskProfilesResponseDto>([
        {
          id: '1c02181a-623d-4b6a-85d2-b528567498a0',
          lowerLimit: '1',
          upperLimit: '1',
          riskProfileName: 'Low Risk',
          riskProfileDescription:
            'You don’t want to experience volatility in your portfolio.<br/>You don’t expect the value of your portfolio to go down at any point in time.<br/>You should also understand that expected returns are very low.',
          tenantId: '9f0165e8-fa92-4bbf-808e-9dc7b6956970',
        },
        {
          id: '0237a6bd-f27a-4ebf-a4ed-f0e77c27bf23',
          lowerLimit: '2',
          upperLimit: '2',
          riskProfileName: 'Medium-Low Risk',
          riskProfileDescription:
            'You are OK with a bit of volatility in your portfolio.<br/>You expect the value of your portfolio to go down but just for a short period of time before it bounces back.<br/>You also understand that expected returns are low.',
          tenantId: '9f0165e8-fa92-4bbf-808e-9dc7b6956970',
        },
        {
          id: '2e746f8e-4c0b-4602-9c3b-e63733a1c4d7',
          lowerLimit: '3',
          upperLimit: '3',
          riskProfileName: 'Medium Risk',
          riskProfileDescription:
            'You are OK with some volatility in your portfolio.<br/>You expect the value of your portfolio to to go down but just for a moderate period of time before it bounces back.<br/>You also understand that expected returns are average.',
          tenantId: '9f0165e8-fa92-4bbf-808e-9dc7b6956970',
        },
        {
          id: '8056cdf9-a6ee-4768-94a6-8c1344819a9b',
          lowerLimit: '4',
          upperLimit: '4',
          riskProfileName: 'Medium-High Risk',
          riskProfileDescription:
            'You are OK with volatility in your portfolio.<br/>You expect the value of your portfolio to to go down but just for a significant period of time but it should bounce back.<br/>You expect good returns in the mid to long term.',
          tenantId: '9f0165e8-fa92-4bbf-808e-9dc7b6956970',
        },
        {
          id: '1bec2a79-cf97-4e00-9cff-b27af5c9d242',
          lowerLimit: '5',
          upperLimit: '5',
          riskProfileName: 'High Risk',
          riskProfileDescription:
            'You are OK with high volatility in your portfolio.<br/>You expect the value of your portfolio to to go down sharply at one point in time but you know that you will reap huge benefits if you are patient enough.<br/>You expect high returns in the long term.',
          tenantId: '9f0165e8-fa92-4bbf-808e-9dc7b6956970',
        },
      ])
    );
  }),
];
