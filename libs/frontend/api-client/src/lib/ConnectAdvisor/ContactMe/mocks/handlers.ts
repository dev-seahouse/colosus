import { rest } from 'msw';

const BASE_URL = 'http://localhost:9000/api/v1/connect/advisor/contact-me';

export const connectAdvisorContactMeApiHandlers = [
  rest.patch(BASE_URL, (req, res, ctx) => {
    return res(ctx.status(201));
  }),
];
