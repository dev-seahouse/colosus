import { rest } from 'msw';
import { ConnectAdvisorGetPreferencesResponseDto } from '../Preferences';

const BASE_URL = 'http://localhost:9000/api/v1/connect/advisor/preferences';

export const connectAdvisorPreferencesApiHandler = [
  rest.get(BASE_URL, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<ConnectAdvisorGetPreferencesResponseDto>({
        minimumAnnualIncomeThreshold: 111111,
        minimumRetirementSavingsThreshold: 222222,
        createdAt: '2023-12-17T03:24:00' as unknown as Date,
        updatedAt: '2023-12-17T03:24:00' as unknown as Date,
      })
    );
  }),
  rest.put(BASE_URL, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<ConnectAdvisorGetPreferencesResponseDto>({
        minimumAnnualIncomeThreshold: 111111,
        minimumRetirementSavingsThreshold: 222222,
        createdAt: '2023-12-17T03:24:00' as unknown as Date,
        updatedAt: '2023-12-17T03:24:00' as unknown as Date,
      })
    );
  }),
];
