import { ApiProperty } from '@nestjs/swagger';
import Stripe from 'stripe';
import { StripeIntegrationDto } from '@bambu/shared';

export class RequestAdvisorSubscriptionListResponseSubscriptionDto
  implements Stripe.Subscription
{
  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  application: string | Stripe.Application | Stripe.DeletedApplication | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  application_fee_percent: number | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  automatic_tax: Stripe.Subscription.AutomaticTax;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  billing_cycle_anchor: number;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  billing_thresholds: Stripe.Subscription.BillingThresholds | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  cancel_at: number | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  cancel_at_period_end: boolean;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  canceled_at: number | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  cancellation_details: Stripe.Subscription.CancellationDetails | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  collection_method: Stripe.Subscription.CollectionMethod;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  created: number;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  currency: string;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  current_period_end: number;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  current_period_start: number;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  customer: string | Stripe.Customer | Stripe.DeletedCustomer;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  days_until_due: number | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  default_payment_method: string | Stripe.PaymentMethod | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  default_source: string | Stripe.CustomerSource | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  description: string | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  discount: Stripe.Discount | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  ended_at: number | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  id: string;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  items: Stripe.ApiList<Stripe.SubscriptionItem>;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  latest_invoice: string | Stripe.Invoice | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  livemode: boolean;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  metadata: Stripe.Metadata;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  next_pending_invoice_item_invoice: number | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  object: 'subscription';

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  on_behalf_of: string | Stripe.Account | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  pause_collection: Stripe.Subscription.PauseCollection | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  payment_settings: Stripe.Subscription.PaymentSettings | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  pending_invoice_item_interval: Stripe.Subscription.PendingInvoiceItemInterval | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  pending_setup_intent: string | Stripe.SetupIntent | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  pending_update: Stripe.Subscription.PendingUpdate | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  schedule: string | Stripe.SubscriptionSchedule | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  start_date: number;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  status: Stripe.Subscription.Status;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  test_clock: string | Stripe.TestHelpers.TestClock | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  transfer_data: Stripe.Subscription.TransferData | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  trial_end: number | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  trial_settings: Stripe.Subscription.TrialSettings | null;

  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
  })
  trial_start: number | null;
}

export class RequestAdvisorSubscriptionListResponseDto
  implements StripeIntegrationDto.IRequestAdvisorSubscriptionListResponseDto
{
  @ApiProperty({
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/subscriptions/object',
    },
    type: RequestAdvisorSubscriptionListResponseSubscriptionDto,
    isArray: true,
  })
  subscriptions: RequestAdvisorSubscriptionListResponseSubscriptionDto[];
}
