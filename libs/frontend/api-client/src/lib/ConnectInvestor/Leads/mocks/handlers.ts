import { rest } from 'msw';

const BASE_URL = 'http://localhost:9000/api/v1/connect/investor/leads';

export const connectInvestorLeadsApiHandler = [
  rest.post(BASE_URL, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
