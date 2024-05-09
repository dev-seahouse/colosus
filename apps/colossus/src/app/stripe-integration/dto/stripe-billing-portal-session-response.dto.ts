import Stripe from 'stripe';
import { ApiProperty } from '@nestjs/swagger';

export class StripeBillingPortalSessionResponseDto
  implements Stripe.BillingPortal.Session
{
  @ApiProperty({
    externalDocs: {
      url: 'https://stripe.com/docs/api/customer_portal/session',
      description: 'The portal session object',
    },
  })
  configuration: string | Stripe.BillingPortal.Configuration;

  @ApiProperty({
    externalDocs: {
      url: 'https://stripe.com/docs/api/customer_portal/session',
      description: 'The portal session object',
    },
  })
  created: number;

  @ApiProperty({
    externalDocs: {
      url: 'https://stripe.com/docs/api/customer_portal/session',
      description: 'The portal session object',
    },
  })
  customer: string;

  @ApiProperty({
    externalDocs: {
      url: 'https://stripe.com/docs/api/customer_portal/session',
      description: 'The portal session object',
    },
  })
  flow: Stripe.BillingPortal.Session.Flow | null;

  @ApiProperty({
    externalDocs: {
      url: 'https://stripe.com/docs/api/customer_portal/session',
      description: 'The portal session object',
    },
  })
  id: string;

  @ApiProperty({
    externalDocs: {
      url: 'https://stripe.com/docs/api/customer_portal/session',
      description: 'The portal session object',
    },
  })
  livemode: boolean;

  @ApiProperty({
    externalDocs: {
      url: 'https://stripe.com/docs/api/customer_portal/session',
      description: 'The portal session object',
    },
  })
  locale: Stripe.BillingPortal.Session.Locale | null;

  @ApiProperty({
    externalDocs: {
      url: 'https://stripe.com/docs/api/customer_portal/session',
      description: 'The portal session object',
    },
  })
  object: 'billing_portal.session';

  @ApiProperty({
    externalDocs: {
      url: 'https://stripe.com/docs/api/customer_portal/session',
      description: 'The portal session object',
    },
  })
  on_behalf_of: string | null;

  @ApiProperty({
    externalDocs: {
      url: 'https://stripe.com/docs/api/customer_portal/session',
      description: 'The portal session object',
    },
  })
  return_url: string | null;

  @ApiProperty({
    externalDocs: {
      url: 'https://stripe.com/docs/api/customer_portal/session',
      description: 'The portal session object',
    },
  })
  url: string;
}
