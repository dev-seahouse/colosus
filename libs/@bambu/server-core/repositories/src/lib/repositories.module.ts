import { Module } from '@nestjs/common';
import { BambuApiLibraryRepositoryModule } from './bambu-api-library';
import { CacheManagerRepositoryModule } from './cache-manager';
import { CentralDbRepositoryModule } from './central-db-repository';
import { FusionAuthIamRepositoryModule } from './fusion-auth-iam';
import { IamRepositoryModule } from './iam';
import { InvestorPortalProxyModule } from './investor-portal-proxy';
import { NotificationRepositoryModule } from './notification-repository';
import { NotificationTemplatesRepositoryModule } from './notification-templates-repository';
import { OtpStoreRepositoryModule } from './otp-store-repository';
import { StripeIntegrationRepositoryModule } from './stripe-integration';

@Module({
  imports: [
    BambuApiLibraryRepositoryModule,
    CentralDbRepositoryModule,
    IamRepositoryModule,
    OtpStoreRepositoryModule,
    NotificationRepositoryModule,
    NotificationTemplatesRepositoryModule,
    StripeIntegrationRepositoryModule,
    InvestorPortalProxyModule,
    CacheManagerRepositoryModule,
    FusionAuthIamRepositoryModule,
  ],
  exports: [
    BambuApiLibraryRepositoryModule,
    CentralDbRepositoryModule,
    IamRepositoryModule,
    OtpStoreRepositoryModule,
    NotificationRepositoryModule,
    NotificationTemplatesRepositoryModule,
    StripeIntegrationRepositoryModule,
    InvestorPortalProxyModule,
    CacheManagerRepositoryModule,
    FusionAuthIamRepositoryModule,
  ],
})
export class RepositoriesModule {}
