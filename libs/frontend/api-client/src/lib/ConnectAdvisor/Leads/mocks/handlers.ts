import { ConnectAdvisorGetLeadsResponseDto } from './../Leads';
import type { IGenericDataSummaryDto } from '@bambu/shared';
import { rest } from 'msw';
import {
  advisorLeadsMockResponse,
  leadsSummaryByIdResponse,
} from './mockResponse';

const BASE_URL = 'http://localhost:9000/api/v1/connect/advisor/leads';

export const connectAdvisorLeadsApiHandlers = [
  rest.post(BASE_URL, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<ConnectAdvisorGetLeadsResponseDto>(advisorLeadsMockResponse)
    );
  }),
  rest.get(`${BASE_URL}/id/summary`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<IGenericDataSummaryDto[]>(leadsSummaryByIdResponse)
    );
  }),
];
