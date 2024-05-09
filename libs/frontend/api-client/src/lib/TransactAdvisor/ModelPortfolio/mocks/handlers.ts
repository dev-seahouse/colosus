import { rest } from 'msw';
import { getMockBaseApiUrl } from '../../../../mocks/getMockBaseApiUrl';
import { getModelPortfolioByIdMockRes } from './getModelPortfolioByIdMockRes';

const API_URL =
  getMockBaseApiUrl() + '/api/v1/transact/advisor/model-portfolio';

export const transactAdvisorModelPortfolioHandlers = [
  rest.get(`${API_URL}/*`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(getModelPortfolioByIdMockRes))
  ),
];

export default transactAdvisorModelPortfolioHandlers;
