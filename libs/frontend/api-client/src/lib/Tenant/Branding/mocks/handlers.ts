import { rest } from 'msw';
import type {
  TenantUpdateTenantBrandingRequestDto,
  TenantGetTenantBrandingResponseDto,
} from '../Branding';

const BASE_URL = 'http://localhost:9000/api/v1/tenant/branding';

export const tenantBrandingApiHandlers = [
  rest.patch<TenantUpdateTenantBrandingRequestDto, any, null>(
    BASE_URL,
    (req, res, ctx) => {
      return res(ctx.status(204));
    }
  ),
  rest.post(`${BASE_URL}/logo`, (req, res, ctx) => {
    return res(ctx.status(204));
  }),
  rest.delete(`${BASE_URL}/logo`, (req, res, ctx) => {
    return res(ctx.status(204));
  }),
  rest.get(BASE_URL, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json<TenantGetTenantBrandingResponseDto>({
        logoUrl: null,
        brandColor: '#00876A',
        headerBgColor: '#fff',
        tradeName: 'Wealth Avenue',
      })
    );
  }),
];
