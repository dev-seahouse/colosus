import type { StripeIntegrationCreateBillingPortalSessionResponseDto } from '../BillingPortal';
import { rest } from 'msw';

const mockCreateBillingPortalSession: StripeIntegrationCreateBillingPortalSessionResponseDto =
  {
    id: 'bps_1My8imFabpOjRn7HotpzaMsH',
    object: 'billing_portal.session',
    configuration: 'bpc_1MqdTLFabpOjRn7HkkDptkDE',
    created: 1681801980,
    customer: 'cus_NjaxQisg68yfMP',
    flow: null,
    livemode: false,
    locale: null,
    on_behalf_of: null,
    return_url: 'http://localhost:9000/',
    url: 'https://billing.stripe.com/p/session/test_YWNjdF8xTW9NZ3RGYWJwT2pSbjdILF9OamJ3a3Z2NDdoTDdBSDNJWjdIRUJ0ZHpmZ3FIZ3Vr0100q4zg56E1',
  };

const BASE_URL =
  'http://localhost:9000/api/v1/stripe-integration/billing-portal';

export const stripeIntegrationBillingPortalApiHandlers = [
  rest.post(`${BASE_URL}/sessions`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json<StripeIntegrationCreateBillingPortalSessionResponseDto>(
        mockCreateBillingPortalSession
      )
    );
  }),
];
