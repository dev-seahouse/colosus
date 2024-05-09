import { rest } from 'msw';
import getMockBaseApiUrl from '../../../../mocks/getMockBaseApiUrl';
import { IGetModelPortfolioByIdResponseDto } from '@bambu/shared';
import { getModalPortfolioByIdMockRes } from './getModalPortfolioByIdMockRes';

const API_URL =
  getMockBaseApiUrl() + '/api/v1/transact/investor/model-portfolios';

export const transactInvestorModelPortfolioHandlers = [
  rest.get<IGetModelPortfolioByIdResponseDto>(`${API_URL}/*`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(getModalPortfolioByIdMockRes))
  ),
];

export default transactInvestorModelPortfolioHandlers;
