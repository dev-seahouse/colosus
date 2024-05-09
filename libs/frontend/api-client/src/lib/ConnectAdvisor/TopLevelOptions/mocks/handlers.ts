import { rest } from 'msw';

import type { ConnectAdvisorGetTopLevelOptionsResponseDto } from '../TopLevelOptions';

const BASE_URL =
  'http://localhost:9000/api/v1/connect/advisor/top-level-options';

export const connectAdvisorTopLevelOptionsApiHandlers = [
  rest.get(BASE_URL, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<ConnectAdvisorGetTopLevelOptionsResponseDto>({
        incomeThreshold: 100000,
        retireeSavingsThreshold: 100000,
        contactLink: 'https://www.bambu.life',
      })
    );
  }),
  rest.patch(BASE_URL, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
