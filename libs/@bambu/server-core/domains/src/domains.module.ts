import { Module } from '@nestjs/common';

import { AuthenticationModule } from './auth';
import { BambuApiLibraryIntegrationDomainModule } from './bambu-api-library-integration';
import { IamAdminModule } from './iam/iam-admin.module';
import { TenantBrandingModule } from './tenant-branding';
import { TenantModule } from './tenant/tenant.module';
import { StripeIntegrationDomainModule } from './stripe-integration';

@Module({
  imports: [
    BambuApiLibraryIntegrationDomainModule,
    IamAdminModule,
    TenantModule,
    TenantBrandingModule,
    AuthenticationModule,
    StripeIntegrationDomainModule,
  ],
  exports: [
    BambuApiLibraryIntegrationDomainModule,
    IamAdminModule,
    TenantModule,
    TenantBrandingModule,
    AuthenticationModule,
    StripeIntegrationDomainModule,
  ],
})
export class DomainsModule {}
