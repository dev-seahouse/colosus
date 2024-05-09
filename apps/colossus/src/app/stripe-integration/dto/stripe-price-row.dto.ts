import Stripe from 'stripe';
import { ApiProperty } from '@nestjs/swagger';
import { StripeIntegrationDto } from '@bambu/shared';

export class StripePriceRowDto implements Stripe.Price {
  @ApiProperty({
    type: 'boolean',
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  active: boolean;

  @ApiProperty({
    description:
      'Describes how to compute the price per period. Either per_unit or tiered. per_unit indicates that the fixed amount (specified in unit_amount or unit_amount_decimal) will be charged per unit in quantity (for prices with usage_type=licensed), or per unit of total usage (for prices with usage_type=metered). tiered indicates that the unit pricing will be computed using a tiering strategy as defined using the tiers and tiers_mode attributes.',
    enum: StripeIntegrationDto.StripeBillingSchemeEnum,
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  billing_scheme: Stripe.Price.BillingScheme;

  @ApiProperty({
    type: 'integer',
    description:
      'Describes how to compute the price per period. Either per_unit or tiered. per_unit indicates that the fixed amount (specified in unit_amount or unit_amount_decimal) will be charged per unit in quantity (for prices with usage_type=licensed), or per unit of total usage (for prices with usage_type=metered). tiered indicates that the unit pricing will be computed using a tiering strategy as defined using the tiers and tiers_mode attributes.',
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  created: number;

  @ApiProperty({
    type: 'string',
    description:
      'Three-letter ISO currency code, in lowercase. Must be a supported currency.',
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  currency: string;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  currency_options?: { [p: string]: Stripe.Price.CurrencyOptions };

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  custom_unit_amount: Stripe.Price.CustomUnitAmount | null;

  // @ApiProperty({
  //   externalDocs: {
  //     description: 'Stripe documentation',
  //     url: 'https://stripe.com/docs/api/prices/object'
  //   }
  // })
  // deleted?: void;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  id: string;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  livemode: boolean;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  lookup_key: string | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  metadata: Stripe.Metadata;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  nickname: string | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  object: 'price';

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  product: string | Stripe.Product | Stripe.DeletedProduct;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  recurring: Stripe.Price.Recurring | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  tax_behavior: Stripe.Price.TaxBehavior | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  tiers?: Array<Stripe.Price.Tier>;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  tiers_mode: Stripe.Price.TiersMode | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  transform_quantity: Stripe.Price.TransformQuantity | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  type: Stripe.Price.Type;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  unit_amount: number | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
  })
  unit_amount_decimal: string | null;
}
