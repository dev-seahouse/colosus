import Stripe from 'stripe';
import { ApiProperty } from '@nestjs/swagger';
import { StripePriceRowDto } from './stripe-price-row.dto';

export class StripeListPricesResponseDto
  implements Stripe.ApiList<StripePriceRowDto>
{
  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation',
      url: 'https://stripe.com/docs/api/prices/object',
    },
    type: StripePriceRowDto,
    isArray: true,
  })
  data: Array<StripePriceRowDto>;

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
