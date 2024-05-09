import { rest } from 'msw';

import type { ConnectAdvisorGetBrandingResponseDto } from '../Branding';

const BASE_URL = 'http://localhost:9000/api/v1/connect/advisor/branding';

export const connectAdvisorBrandingApiHandlers = [
  rest.get(BASE_URL, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<ConnectAdvisorGetBrandingResponseDto>({
        logoUrl: null,
        brandColor: '#00876A',
        headerBgColor: '#fff',
        tradeName: 'Wealth Avenue',
      })
    );
  }),
];
