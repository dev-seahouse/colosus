import { rest } from 'msw';
import type { GetAdvisorBankAccountResponseDto } from '../AdvisorBankAccount';
const BASE_URL =
  'http://localhost:9000/api/v1/transact/advisor/advisor-bank-account';

export const transactAdvisorBankAccountApiHandlers = [
  rest.get(BASE_URL, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<GetAdvisorBankAccountResponseDto>({
        id: '667d9518-5e9a-43fc-934a-006fb436d4af',
        tenantId: '02da0240-79e3-4a8e-b16c-c84b5f1e4d1a',
        accountNumber: '12345678',
        sortCode: '123456',
        accountName: 'Fleetwood Mac Pte',
        annualManagementFee: '13',
        createdBy: 'COLOSSUS',
        createdAt: '2023-11-22T04:33:56.448Z',
        updatedBy: 'COLOSSUS',
        updatedAt: '2023-11-22T04:53:24.050Z',
      })
    );
  }),
  rest.post(BASE_URL, (req, res, ctx) => {
    return res(ctx.status(201));
  }),
  rest.patch(BASE_URL, (req, res, ctx) => {
    return res(ctx.status(201));
  }),
];
