import { rest } from 'msw';
import { getMockBaseApiUrl } from '../../../../mocks/getMockBaseApiUrl';
import { getInstrumentsMockResponse } from './getInstrumentsMockResponse';
import { getInstrumentAssetClassesMockResponse } from './getInstrumentAssetClassesMockResponse';

const API_URL = getMockBaseApiUrl() + '/api/v1/transact/investor/instruments';

export const transactInvestorInstrumentsHandlers = [
  rest.get(API_URL, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(getInstrumentsMockResponse))
  ),
  rest.get(API_URL + '/asset-classes', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(getInstrumentAssetClassesMockResponse))
  ),
];

export default transactInvestorInstrumentsHandlers;
