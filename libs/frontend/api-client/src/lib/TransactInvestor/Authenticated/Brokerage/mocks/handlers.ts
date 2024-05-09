import { rest } from 'msw';
import { getMockBaseApiUrl } from '../../../../../mocks/getMockBaseApiUrl';
import type { InvestorBrokerageApiRequestDto } from '../Brokerage';
import { kycBrokerageMockResponse } from './kycBrokerageMockResponse';
import type {
  InvestorBrokerageCancelDirectDebitSubscriptionRequestDto,
  InvestorBrokerageCreateBankAccountForPartyRequestDto,
  InvestorBrokerageCreateDirectDebitMandateRequestDto,
  InvestorBrokerageDirectDebitMandateCancelRequestDto,
  InvestorBrokerageDirectDebitMandateGetPdfPreviewRequestDto,
  InvestorBrokerageDirectDebitMandateGetPdfRequestDto,
  InvestorBrokerageGetBankAccountByIdRequestDto,
  InvestorBrokerageGetNextPossiblePaymentRequestDto,
  InvestorBrokerageUkDirectDebitCreatePaymentReqDto,
  InvestorBrokerageUkDirectDebitCreateSubscriptionReqDto,
  InvestorBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto,
  InvestorBrokerageWithdrawalRequestDto,
} from '../Brokerage.types';
import createDirectDebitMandateMockRes from './createDirectDebitMandateMockRes';
import { createBankAccountMockRes } from './createBankAccountMockRes';
import { getBankAccountsMockRes } from './getBankAccountsMockRes';
import { getDirectDebitPreviewPdfMockRes } from './getDirectDebitPreviewPdfMockRes';
import { getDirectDebitMandateMockRes } from './getDirectDebitMandateMockRes';

const API_URL =
  getMockBaseApiUrl() + '/api/v1/transact/investor/authenticated/brokerage';

export const transactInvestorAuthenticatedBrokerageMocksHandlers = [
  rest.post<InvestorBrokerageApiRequestDto>(
    `${API_URL}/accounts`,
    (req, res, ctx) => res(ctx.status(201), ctx.json(kycBrokerageMockResponse))
  ),
  rest.get<never>(`${API_URL}/accounts`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(kycBrokerageMockResponse))
  ),
  rest.post<InvestorBrokerageCreateBankAccountForPartyRequestDto>(
    `${API_URL}/bank-accounts`,
    (req, res, ctx) => res(ctx.status(201), ctx.json(createBankAccountMockRes))
  ),
  rest.get<never>(`${API_URL}/bank-accounts`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(getBankAccountsMockRes))
  ),
  rest.get<InvestorBrokerageGetBankAccountByIdRequestDto>(
    `${API_URL}/bank-accounts/*`,
    (req, res, ctx) => res(ctx.status(200), ctx.json(getBankAccountsMockRes[0]))
  ),
  rest.post<InvestorBrokerageCreateDirectDebitMandateRequestDto>(
    `${API_URL}/direct-debits/mandates`,
    (req, res, ctx) =>
      res(ctx.status(201), ctx.json(createDirectDebitMandateMockRes))
  ),
  rest.get(`${API_URL}/direct-debits/payments`, (req, res, ctx) =>
    res(ctx.status(200))
  ),
  rest.post<InvestorBrokerageUkDirectDebitCreatePaymentReqDto>(
    `${API_URL}/direct-debits/payments`,
    (req, res, ctx) => res(ctx.status(201))
  ),
  rest.get<never>(`${API_URL}/direct-debits/mandates`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(getDirectDebitMandateMockRes))
  ),
  rest.post<InvestorBrokerageDirectDebitMandateCancelRequestDto>(
    `${API_URL}/direct-debits/mandates/*/actions/cancel`,
    (req, res, ctx) => res(ctx.status(201))
  ),
  rest.get<InvestorBrokerageDirectDebitMandateGetPdfRequestDto>(
    `${API_URL}/direct-debits/mandates/*/pdf`,
    (req, res, ctx) => res(ctx.status(200))
  ),
  rest.get<InvestorBrokerageDirectDebitMandateGetPdfPreviewRequestDto>(
    `${API_URL}/direct-debits/mandates/preview-mandate-pdf?bankAccountId=*`,
    (req, res, ctx) =>
      res(ctx.status(200), ctx.body(getDirectDebitPreviewPdfMockRes))
  ),
  rest.get<InvestorBrokerageGetNextPossiblePaymentRequestDto>(
    `${API_URL}/direct-debits/mandates/*/next-possible-payment`,
    (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          date: '2023-08-24',
        })
      )
  ),
  rest.post<InvestorBrokerageUkDirectDebitCreateSubscriptionReqDto>(
    `${API_URL}/direct-debits/subscriptions`,
    (req, res, ctx) =>
      res(
        ctx.status(201),
        ctx.json({
          id: 'string',
        })
      )
  ),
  rest.post<InvestorBrokerageCancelDirectDebitSubscriptionRequestDto>(
    `${API_URL}/direct-debits/subscriptions/*/actions/cancel`,
    (req, res, ctx) => res(ctx.status(202))
  ),
  rest.get<InvestorBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto>(
    `${API_URL}/direct-debits/subscriptions`,
    (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json([
          {
            paginationToken: 'string',
            results: [
              {
                id: 'dds-34a67qfg7362me',
                mandateId: 'ddm-343lrhsth22c2i',
                portfolioId: 'prt-343lrwxvz22bxq',
                amount: {
                  amount: 1000,
                  currency: 'GBP',
                },
                status: 'Created',
                interval: 'Monthly',
                dayOfMonth: 25,
                month: 'March',
                createdAt: '2021-01-21T00:00:00.0000000Z',
              },
            ],
          },
        ])
      )
  ),
  rest.post<InvestorBrokerageWithdrawalRequestDto>(
    `${API_URL}/withdrawals`,
    (req, res, ctx) => res(ctx.status(201), ctx.json(createBankAccountMockRes))
  ),
];

export default transactInvestorAuthenticatedBrokerageMocksHandlers;
