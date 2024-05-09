import { getMockBaseApiUrl } from '../../../../../../mocks/getMockBaseApiUrl';
import type { InvestorBrokerageIntegrationListAllQueryParamsBaseDto } from '../../Brokerage.types';
import getBankAccountsPagedMockRes from './getBankAccountsPagedMockRes';
import { rest } from 'msw';

const API_URL =
  getMockBaseApiUrl() +
  '/api/v2/transact/investor/authenticated/brokerage/bank-accounts';

export const transactInvestorAuthenticatedBrokerageBankAccountsHandlersV2 = [
  rest.get<InvestorBrokerageIntegrationListAllQueryParamsBaseDto>(
    API_URL,
    (req, res, ctx) =>
      res(ctx.status(200), ctx.json(getBankAccountsPagedMockRes))
  ),
];

export default transactInvestorAuthenticatedBrokerageBankAccountsHandlersV2;
