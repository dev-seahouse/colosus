import {
  AuthenticationGuard,
  RoleAuthorizationGuard,
} from '@bambu/server-core/common-guards';
import {
  BambuWebhooksModule,
  HeartbeatModule,
} from '@bambu/server-core/common-rest-endpoints';
import { DomainsModule } from '@bambu/server-core/domains';
import {
  BambuApiLibraryRepositoryModule,
  CentralDbRepositoryModule,
  IamRepositoryModule,
} from '@bambu/server-core/repositories';
import {
  BambuEmailerModule,
  BambuEventEmitterModule,
  BambuHubspotModule,
} from '@bambu/server-core/utilities';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AccountModule } from './account/account.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { BambuCalculatorsIntegrationModule } from './bambu-calculators-integration/bambu-calculators-integration.module';
import { ConnectAdvisorModule } from './connect-advisor/connect-advisor.module';
import { ConnectInvestorModule } from './connect-investor/connect-investor.module';
import { ConnectToolsModule } from './connect-tools/connect-tools.module';
import { StripeIntegrationModule } from './stripe-integration/stripe-integration.module';
import { TenantBrandingModule } from './tenant-branding/tenant-branding.module';
import { TransactAdvisorModule } from './transact-advisor/transact-advisor.module';
import { TransactInvestorModule } from './transact-investor/transact-investor.module';

@Module({
  imports: [
    BambuApiLibraryRepositoryModule,
    CentralDbRepositoryModule,
    IamRepositoryModule, // necessary for the AuthGuard to work
    DomainsModule,
    HeartbeatModule,
    AccountModule,
    AuthenticationModule,
    BambuCalculatorsIntegrationModule,
    BambuEmailerModule,
    BambuEventEmitterModule,
    BambuWebhooksModule.forRoot({
      path: 'webhooks',
    }),
    BambuHubspotModule,
    ConnectAdvisorModule,
    ConnectInvestorModule,
    ConnectToolsModule,
    StripeIntegrationModule,
    TenantBrandingModule,
    TransactInvestorModule,
    TransactAdvisorModule,
  ],
  providers: [
    // Global guards are executed in order that they appear in this list
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleAuthorizationGuard,
    },
  ],
})
export class AppModule {}
