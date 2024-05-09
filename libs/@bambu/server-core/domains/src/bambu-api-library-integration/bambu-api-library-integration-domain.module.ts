import { Module } from '@nestjs/common';

import { RepositoriesModule } from '@bambu/server-core/repositories';

import { BambuApiLibraryIntegrationDomainService } from './bambu-api-library-integration-domain.service';
import { BambuApiLibraryIntegrationDomainServiceBase } from './bambu-api-library-integration-domain-service.base';

@Module({
  imports: [RepositoriesModule],
  providers: [
    {
      provide: BambuApiLibraryIntegrationDomainServiceBase,
      useClass: BambuApiLibraryIntegrationDomainService,
    },
  ],
  exports: [BambuApiLibraryIntegrationDomainServiceBase],
})
export class BambuApiLibraryIntegrationDomainModule {}
