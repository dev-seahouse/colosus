import { rest } from 'msw';

import { r as questionnaireResponse } from './getRiskQuestionnaireResponse';
import { r as computeRiskProfileScoreResponse } from './computeRiskProfileScoreResponse';
import { r as getInvestorRiskProfilesResponse } from './getInvestorRiskProfilesResponse';

import {
  ConnectInvestorGetInvestorRiskProfilesResponseDto,
  ConnectInvestorComputeRiskProfileScoreResponseDto,
  ConnectGetInvestorRiskQuestionnaireResponseDto,
} from '../RiskProfiling';

const BASE_URL = 'http://localhost:9000/api/v1/connect/investor/risk-profiling';

export const connectInvestorRiskProfilingHandlers = [
  rest.get(`${BASE_URL}/questionnaire`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<ConnectGetInvestorRiskQuestionnaireResponseDto>(
        questionnaireResponse
      )
    );
  }),

  rest.post(`${BASE_URL}/compute`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<ConnectInvestorComputeRiskProfileScoreResponseDto>(
        computeRiskProfileScoreResponse
      )
    );
  }),

  rest.get(`${BASE_URL}/risk-profiles`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<ConnectInvestorGetInvestorRiskProfilesResponseDto>(
        getInvestorRiskProfilesResponse
      )
    );
  }),
];
