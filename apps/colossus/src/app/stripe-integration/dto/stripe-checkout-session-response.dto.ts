import Stripe from 'stripe';
import { ApiProperty } from '@nestjs/swagger';

export class StripeCheckoutSessionResponseDto
  implements Stripe.Checkout.Session
{
  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  after_expiration: Stripe.Checkout.Session.AfterExpiration | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  allow_promotion_codes: boolean | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  amount_subtotal: number | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  amount_total: number | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  automatic_tax: Stripe.Checkout.Session.AutomaticTax;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  billing_address_collection: Stripe.Checkout.Session.BillingAddressCollection | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  cancel_url: string | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  client_reference_id: string | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  consent: Stripe.Checkout.Session.Consent | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  consent_collection: Stripe.Checkout.Session.ConsentCollection | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  created: number;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  currency: string | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  custom_fields: Array<Stripe.Checkout.Session.CustomField>;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  custom_text: Stripe.Checkout.Session.CustomText;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  customer_creation: Stripe.Checkout.Session.CustomerCreation | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  customer_details: Stripe.Checkout.Session.CustomerDetails | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  customer_email: string | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  expires_at: number;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  id: string;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  invoice: string | Stripe.Invoice | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  invoice_creation: Stripe.Checkout.Session.InvoiceCreation | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  line_items: Stripe.ApiList<Stripe.LineItem>;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  livemode: boolean;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  locale: Stripe.Checkout.Session.Locale | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  metadata: Stripe.Metadata | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  mode: Stripe.Checkout.Session.Mode;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  object: 'checkout.session';

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  payment_intent: string | Stripe.PaymentIntent | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  payment_link: string | Stripe.PaymentLink | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  payment_method_collection: Stripe.Checkout.Session.PaymentMethodCollection | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  payment_method_options: Stripe.Checkout.Session.PaymentMethodOptions | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  payment_method_types: Array<string>;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  payment_status: Stripe.Checkout.Session.PaymentStatus;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  phone_number_collection: Stripe.Checkout.Session.PhoneNumberCollection;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  recovered_from: string | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  setup_intent: string | Stripe.SetupIntent | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  shipping_address_collection: Stripe.Checkout.Session.ShippingAddressCollection | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  shipping_cost: Stripe.Checkout.Session.ShippingCost | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  shipping_details: Stripe.Checkout.Session.ShippingDetails | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  shipping_options: Array<Stripe.Checkout.Session.ShippingOption>;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  status: Stripe.Checkout.Session.Status | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  submit_type: Stripe.Checkout.Session.SubmitType | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  subscription: string | Stripe.Subscription | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  success_url: string;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  tax_id_collection: Stripe.Checkout.Session.TaxIdCollection;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  total_details: Stripe.Checkout.Session.TotalDetails | null;

  @ApiProperty({
    externalDocs: {
      description: 'The Checkout Session object',
      url: 'https://stripe.com/docs/api/checkout/sessions/object?lang=node',
    },
  })
  url: string | null;
}
