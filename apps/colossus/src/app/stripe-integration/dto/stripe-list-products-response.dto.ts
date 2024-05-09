import Stripe from 'stripe';
import { ApiProperty } from '@nestjs/swagger';
import { StripeProductRowDto } from './stripe-product-row.dto';

export class StripeListProductsResponseDto
  implements Stripe.ApiList<StripeProductRowDto>
{
  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/products/object',
    },
    type: StripeProductRowDto,
    isArray: true,
  })
  data: Array<StripeProductRowDto>;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
    type: 'boolean',
  })
  has_more: boolean;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
    type: 'string',
    example: 'list',
  })
  object: 'list';

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
    type: 'string',
  })
  url: string;
}
