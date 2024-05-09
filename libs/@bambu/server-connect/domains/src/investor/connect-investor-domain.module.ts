import { getAzureBlobStorageConfiguration } from '@bambu/server-core/configuration';
import {
  LegalDocumentsModule,
  BambuApiLibraryIntegrationDomainModule,
} from '@bambu/server-core/domains';
import {
  CacheManagerRepositoryModule,
  CentralDbRepositoryModule,
  InvestorPortalProxyModule,
  NotificationRepositoryModule,
  NotificationTemplatesRepositoryModule,
  StripeIntegrationRepositoryModule,
} from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConnectToolsModule } from '../tools';
import {
  ConnectInvestorDomainService,
  ConnectInvestorDomainServiceBase,
} from './connect-investor-domain.service';

@Module({
  imports: [
    CentralDbRepositoryModule,
    StripeIntegrationRepositoryModule,
    InvestorPortalProxyModule,
    CacheManagerRepositoryModule,
    ConnectToolsModule,
    LegalDocumentsModule,
    NotificationTemplatesRepositoryModule,
    NotificationRepositoryModule,
    BambuApiLibraryIntegrationDomainModule,
    ConfigModule.forFeature(getAzureBlobStorageConfiguration),
  ],
  providers: [
    {
      provide: ConnectInvestorDomainServiceBase,
      useClass: ConnectInvestorDomainService,
    },
  ],
  exports: [ConnectInvestorDomainServiceBase],
})
export class ConnectInvestorDomainModule {}
