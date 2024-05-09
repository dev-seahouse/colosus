import { rest } from 'msw';
import getMockBaseApiUrl from '../../../../../mocks/getMockBaseApiUrl';
import { getInvestorPlatformUserProfileMockResponse } from './getInvestorPlatformUserProfileMockResponse';

const API_URL =
  getMockBaseApiUrl() + '/api/v1/transact/investor/authenticated/profile';

export const transactInvestorAuthenticatedProfileHandlers = [
  rest.get(API_URL, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(getInvestorPlatformUserProfileMockResponse))
  ),
];

export default transactInvestorAuthenticatedProfileHandlers;
