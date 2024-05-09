import { getStripeIntegrationConfiguration } from '@bambu/server-core/configuration';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  StripeBillingPortalApiRepositoryService,
  StripeBillingPortalApiRepositoryServiceBase,
} from './stripe-billing-portal-api-repository.service';
import { StripeCheckoutApiRepositoryServiceBase } from './stripe-checkout-api-repository-service.base';
import { StripeCheckoutApiRepositoryService } from './stripe-checkout-api-repository.service';
import {
  StripeCustomerApiRepositoryService,
  StripeCustomerApiRepositoryServiceBase,
} from './stripe-customer-api-repository.service';
import { StripePriceApiRepositoryServiceBase } from './stripe-price-api-repository-service.base';
import { StripePriceApiRepositoryService } from './stripe-price-api-repository.service';
import {
  StripeProductApiRepositoryService,
  StripeProductApiRepositoryServiceBase,
} from './stripe-product-api-repository.service';
import {
  StripeSubscriptionApiRepositoryService,
  StripeSubscriptionApiRepositoryServiceBase,
} from './stripe-subscription-api-repository.service';

import {
  StripeInvoiceApiRepositoryServiceBase,
  StripeInvoiceApiRepositoryService,
} from './stripe-invoice-api-repository.service';

@Module({
  imports: [ConfigModule.forFeature(getStripeIntegrationConfiguration)],
  providers: [
    {
      provide: StripePriceApiRepositoryServiceBase,
      useClass: StripePriceApiRepositoryService,
    },
    {
      provide: StripeCheckoutApiRepositoryServiceBase,
      useClass: StripeCheckoutApiRepositoryService,
    },
    {
      provide: StripeProductApiRepositoryServiceBase,
      useClass: StripeProductApiRepositoryService,
    },
    {
      provide: StripeBillingPortalApiRepositoryServiceBase,
      useClass: StripeBillingPortalApiRepositoryService,
    },
    {
      provide: StripeCustomerApiRepositoryServiceBase,
      useClass: StripeCustomerApiRepositoryService,
    },
    {
      provide: StripeSubscriptionApiRepositoryServiceBase,
      useClass: StripeSubscriptionApiRepositoryService,
    },
    {
      provide: StripeInvoiceApiRepositoryServiceBase,
      useClass: StripeInvoiceApiRepositoryService,
    },
  ],
  exports: [
    StripePriceApiRepositoryServiceBase,
    StripeCheckoutApiRepositoryServiceBase,
    StripeProductApiRepositoryServiceBase,
    StripeBillingPortalApiRepositoryServiceBase,
    StripeCustomerApiRepositoryServiceBase,
    StripeSubscriptionApiRepositoryServiceBase,
    StripeInvoiceApiRepositoryServiceBase,
  ],
})
export class StripeIntegrationRepositoryModule {}
