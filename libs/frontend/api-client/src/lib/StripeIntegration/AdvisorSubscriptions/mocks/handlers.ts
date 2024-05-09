import type {
  StripeIntegrationCreateCheckoutSessionResponseDto,
  StripeIntegrationGetSubscriptionsResponseDto,
} from '../AdvisorSubscriptions';
import { rest } from 'msw';

const mockGenerateCheckoutSessionRes: StripeIntegrationCreateCheckoutSessionResponseDto =
  {
    id: 'cs_test_a1za5i93y5sD2jGxoxYzfYIfdBZaEr1XZpPxw5z1AjMZbmiTzBsfGqyzA8',
    object: 'checkout.session',
    after_expiration: null,
    allow_promotion_codes: null,
    amount_subtotal: 2000,
    amount_total: 2000,
    automatic_tax: {
      enabled: false,
      status: null,
    },
    billing_address_collection: 'required',
    cancel_url: 'http://localhost:9000/cancel.html',
    client_reference_id: null,
    consent: null,
    consent_collection: null,
    created: 1681269583,
    currency: 'myr',
    custom_fields: [],
    custom_text: {
      shipping_address: null,
      submit: null,
    },
    customer: null,
    customer_creation: 'always',
    customer_details: {
      address: null,
      email: 'matius+0@bambu.co',
      name: null,
      phone: null,
      tax_exempt: null,
      tax_ids: null,
    },
    customer_email: 'matius+0@bambu.co',
    expires_at: 1681355982,
    invoice: null,
    invoice_creation: null,
    livemode: false,
    locale: null,
    metadata: {
      bambuGoProductId: 'CONNECT',
      email: 'matius+0@bambu.co',
      priceId: 'price_1Mq9D7FabpOjRn7HWILE9Cro',
      realm: 'matius_0_at_bambu_co',
      requestId: '369e2e7a-5532-4b0f-816b-2ec40c1b244d',
      tenantId: '5ac43138-68a7-44a7-b72d-21512e4ba0e8',
      userId: 'd638f87b-31a6-45c7-bdb7-bb85daf1bc05',
    },
    mode: 'subscription',
    payment_intent: null,
    payment_link: null,
    payment_method_collection: 'always',
    payment_method_options: null,
    payment_method_types: ['card'],
    payment_status: 'unpaid',
    phone_number_collection: {
      enabled: false,
    },
    recovered_from: null,
    setup_intent: null,
    shipping_address_collection: null,
    shipping_cost: null,
    shipping_details: null,
    shipping_options: [],
    status: 'open',
    submit_type: null,
    subscription: null,
    success_url:
      'http://localhost:9000/success.html?session_id={CHECKOUT_SESSION_ID}',
    total_details: {
      amount_discount: 0,
      amount_shipping: 0,
      amount_tax: 0,
    },
    url: 'https://checkout.stripe.com/c/pay/cs_test_a1za5i93y5sD2jGxoxYzfYIfdBZaEr1XZpPxw5z1AjMZbmiTzBsfGqyzA8#fidkdWxOYHwnPyd1blpxYHZxWjA0SGpIYnFDZGd1Sm9XazJNNHVfZzJNT31fZHZ1Rj08Z3NLXW9sUlVGbEYwYGt2b1Z%2FR0JvSWBpbmM3ZFFRTFNVZzRKdFFocUlRTDAzaXVgNXQ2SzNqbUB2NTVyX202UmFPNCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl',
  };

const mockGetSubscriptionsRes: StripeIntegrationGetSubscriptionsResponseDto = {
  subscriptions: [
    {
      id: 'sub_1Mvv7lFabpOjRn7HMNhMYiGf',
      object: 'subscription',
      application: null,
      application_fee_percent: null,
      automatic_tax: {
        enabled: false,
      },
      billing_cycle_anchor: 1681273057,
      billing_thresholds: null,
      cancel_at: null,
      cancel_at_period_end: false,
      canceled_at: null,
      cancellation_details: {
        comment: null,
        feedback: null,
        reason: null,
      },
      collection_method: 'charge_automatically',
      created: 1681273057,
      currency: 'myr',
      current_period_end: 1683865057,
      current_period_start: 1681273057,
      customer: 'cus_NhJlr0T3WH1vsd',
      days_until_due: null,
      default_payment_method: 'pm_1Mvv7kFabpOjRn7HpDkDMI2d',
      default_source: null,
      default_tax_rates: [],
      description: null,
      discount: null,
      ended_at: null,
      items: {
        object: 'list',
        data: [
          {
            id: 'si_NhJlx6OkheunGI',
            object: 'subscription_item',
            billing_thresholds: null,
            created: 1681273058,
            metadata: {},
            plan: {
              id: 'price_1Mq9D7FabpOjRn7HWILE9Cro',
              object: 'plan',
              active: true,
              aggregate_usage: null,
              amount: 2000,
              amount_decimal: '2000',
              billing_scheme: 'per_unit',
              created: 1679897237,
              currency: 'myr',
              interval: 'month',
              interval_count: 1,
              livemode: false,
              metadata: {},
              nickname: 'Connect',
              product: 'prod_NbLut6uJw85qmi',
              tiers_mode: null,
              transform_usage: null,
              trial_period_days: null,
              usage_type: 'licensed',
            },
            price: {
              id: 'price_1Mq9D7FabpOjRn7HWILE9Cro',
              object: 'price',
              active: true,
              billing_scheme: 'per_unit',
              created: 1679897237,
              currency: 'myr',
              custom_unit_amount: null,
              livemode: false,
              lookup_key: null,
              metadata: {},
              nickname: 'Connect',
              product: 'prod_NbLut6uJw85qmi',
              recurring: {
                aggregate_usage: null,
                interval: 'month',
                interval_count: 1,
                trial_period_days: null,
                usage_type: 'licensed',
              },
              tax_behavior: 'unspecified',
              tiers_mode: null,
              transform_quantity: null,
              type: 'recurring',
              unit_amount: 2000,
              unit_amount_decimal: '2000',
            },
            quantity: 1,
            subscription: 'sub_1Mvv7lFabpOjRn7HMNhMYiGf',
            tax_rates: [],
          },
        ],
        has_more: false,
        url: '/v1/subscription_items?subscription=sub_1Mvv7lFabpOjRn7HMNhMYiGf',
      },
      latest_invoice: 'in_1Mvv7lFabpOjRn7HFfMfy19X',
      livemode: false,
      metadata: {},
      next_pending_invoice_item_invoice: null,
      on_behalf_of: null,
      pause_collection: null,
      payment_settings: {
        payment_method_options: null,
        payment_method_types: null,
        save_default_payment_method: 'off',
      },
      pending_invoice_item_interval: null,
      pending_setup_intent: null,
      pending_update: null,
      schedule: null,
      start_date: 1681273057,
      status: 'active',
      test_clock: null,
      transfer_data: null,
      trial_end: null,
      trial_settings: {
        end_behavior: {
          missing_payment_method: 'create_invoice',
        },
      },
      trial_start: null,
    },
  ],
};

const BASE_URL =
  'http://localhost:9000/api/v1/stripe-integration/advisor-subscriptions';

export const stripeIntegrationAdvisorSubscriptionsApiHandlers = [
  rest.post(`${BASE_URL}/checkout/session`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<StripeIntegrationCreateCheckoutSessionResponseDto>(
        mockGenerateCheckoutSessionRes
      )
    );
  }),
  rest.get(BASE_URL, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<StripeIntegrationGetSubscriptionsResponseDto>(
        mockGetSubscriptionsRes
      )
    );
  }),
];
