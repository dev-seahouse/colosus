import { rest } from 'msw';
import getMockBaseApiUrl from '../../../../mocks/getMockBaseApiUrl';
import { getInstrumentsMockRes } from './getInstrumentsMockRes';

const API_URL = getMockBaseApiUrl() + '/api/v1/transact/advisor/instruments';

export const transactAdvisorInstrumentsHandlers = [
  rest.get(`${API_URL}?*`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(getInstrumentsMockRes))
  ),
];
