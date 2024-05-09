import { rest } from 'msw';
import type { StripeIntegrationGetPricesResponseDto } from '../Prices';

const pricesRes = {
  data: [
    {
      id: 'price_1Mr0HmFabpOjRn7HwuvraNAD',
      object: 'price',
      active: true,
      billing_scheme: 'per_unit',
      created: 1680101258,
      currency: 'usd',
      custom_unit_amount: null,
      livemode: false,
      lookup_key: null,
      metadata: {},
      nickname: null,
      product: {
        id: 'prod_NcEl4gKh6VbQdV',
        object: 'product',
        active: false,
        attributes: [],
        created: 1680101258,
        default_price: null,
        description: '(created by Stripe CLI)',
        images: [],
        livemode: false,
        metadata: {},
        name: 'myproduct',
        package_dimensions: null,
        shippable: null,
        statement_descriptor: null,
        tax_code: null,
        type: 'service',
        unit_label: null,
        updated: 1680101661,
        url: null,
      },
      recurring: null,
      tax_behavior: 'unspecified',
      tiers_mode: null,
      transform_quantity: null,
      type: 'one_time',
      unit_amount: 1500,
      unit_amount_decimal: '1500',
    },
    {
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
      product: {
        id: 'prod_NbLut6uJw85qmi',
        object: 'product',
        active: true,
        attributes: [],
        created: 1679897236,
        default_price: 'price_1Mq9D7FabpOjRn7HWILE9Cro',
        description: 'Product used for POC',
        images: [],
        livemode: false,
        metadata: { lookup_key: 'TESTING' },
        name: 'Ben POC Product',
        package_dimensions: null,
        shippable: null,
        statement_descriptor: null,
        tax_code: null,
        type: 'service',
        unit_label: null,
        updated: 1679905720,
        url: null,
      },
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
  ],
} as StripeIntegrationGetPricesResponseDto;

const BASE_URL = 'http://localhost:9000/api/v1/stripe-integration/prices';

export const stripeIntegrationPricesApiHandlers = [
  rest.get(BASE_URL, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<StripeIntegrationGetPricesResponseDto>({
        data: pricesRes.data,
      })
    );
  }),
];
