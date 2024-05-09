import { Module } from '@nestjs/common';
import {
  BambuApiLibraryRepositoryModule,
  CacheManagerRepositoryModule,
  CentralDbRepositoryModule,
  StripeIntegrationRepositoryModule,
} from '@bambu/server-core/repositories';

import { StripeIntegrationDomainServiceBase } from './stripe-integration-domain-service.base';
import { StripeIntegrationDomainService } from './stripe-integration-domain.service';
import { BambuEventEmitterModule } from '@bambu/server-core/utilities';

@Module({
  imports: [
    StripeIntegrationRepositoryModule,
    CentralDbRepositoryModule,
    BambuApiLibraryRepositoryModule,
    CacheManagerRepositoryModule,
    BambuEventEmitterModule,
  ],
  providers: [
    {
      provide: StripeIntegrationDomainServiceBase,
      useClass: StripeIntegrationDomainService,
    },
  ],
  exports: [StripeIntegrationDomainServiceBase],
})
export class StripeIntegrationDomainModule {}
