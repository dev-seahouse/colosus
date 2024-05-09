import { rest } from 'msw';
import getMockBaseApiUrl from '../../../../../mocks/getMockBaseApiUrl';
import type { InvestorGetGoalDetailsApiResponseDto } from '../Goals';
import { getInvestorGoalDetailsMockResponse } from './getInvestorGoalDetailsMockResponse';
import getInvestorGoalsTransactionsMockReq from './getInvestorGoalsTransactionsMockReq';
import getInvestorGoalsMockResponse from './getInvestorGoalsMockResponse';

const API_URL =
  getMockBaseApiUrl() + '/api/v1/transact/investor/authenticated/goals';

export const transactInvestorAuthenticatedGoalsHandlers = [
  rest.get<InvestorGetGoalDetailsApiResponseDto>(
    API_URL + '/*',
    (req, res, ctx) => {
      if (req.url.pathname.endsWith('/goals')) {
        return res(ctx.status(200), ctx.json(getInvestorGoalsMockResponse));
      } else if (req.url.pathname.endsWith('/transactions')) {
        return res(
          ctx.status(200),
          ctx.json(getInvestorGoalsTransactionsMockReq)
        );
      } else {
        return res(
          ctx.status(200),
          ctx.json(getInvestorGoalDetailsMockResponse)
        );
      }
    }
  ),
];
