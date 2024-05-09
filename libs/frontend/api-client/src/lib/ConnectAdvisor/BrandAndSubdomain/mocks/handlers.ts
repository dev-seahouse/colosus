import { rest } from 'msw';

import type { ConnectAdvisorGetBrandAndSubdomainResponseDto } from '../BrandAndSubdomain';

const mockGetSubdomainResponse: ConnectAdvisorGetBrandAndSubdomainResponseDto =
  {
    subdomain: '',
    tradeName: '',
  };

const BASE_URL =
  'http://localhost:9000/api/v1/connect/advisor/brand-and-subdomain';

export const connectAdvisorBrandAndSubdomainApiHandlers = [
  rest.get(BASE_URL, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<ConnectAdvisorGetBrandAndSubdomainResponseDto>(
        mockGetSubdomainResponse
      )
    );
  }),
  rest.patch(BASE_URL, (req, res, ctx) => {
    return res(ctx.status(204));
  }),
];
