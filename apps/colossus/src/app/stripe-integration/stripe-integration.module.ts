import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { StripeIntegrationDomainModule } from '@bambu/server-core/domains';
import { getStripeIntegrationConfiguration } from '@bambu/server-core/configuration';
import { StripeIntegrationWebhooksService } from './stripe-integration-webhooks.service';
import { StripeIntegrationController } from './stripe-integration.controller';

@Module({
  imports: [
    ConfigModule.forFeature(getStripeIntegrationConfiguration),
    StripeIntegrationDomainModule,
  ],
  providers: [StripeIntegrationWebhooksService],
  controllers: [StripeIntegrationController],
})
export class StripeIntegrationModule {}
