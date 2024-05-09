import Stripe from 'stripe';
import { ApiProperty } from '@nestjs/swagger';

export class StripeProductRowDto implements Stripe.Product {
  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  active: boolean;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  attributes: Array<string> | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  caption: string | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  created: number;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  deactivate_on: Array<string>;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  default_price: string | Stripe.Price | null;

  // @ApiProperty({
  //   externalDocs: {
  //     description: "Stripe documentation",
  //     url: "https://stripe.com/docs/api/products/object"
  //   }
  // })
  // deleted: void;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  description: string | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  id: string;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  images: Array<string>;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  livemode: boolean;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  metadata: Stripe.Metadata;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  name: string;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  object: 'product';

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  package_dimensions: Stripe.Product.PackageDimensions | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  shippable: boolean | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  statement_descriptor: string | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  tax_code: string | Stripe.TaxCode | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  type: Stripe.Product.Type;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  unit_label: string | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  updated: number;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
  })
  url: string | null;
}
