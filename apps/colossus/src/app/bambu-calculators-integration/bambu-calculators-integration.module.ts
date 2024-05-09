import { Module } from '@nestjs/common';

import { BambuApiLibraryIntegrationDomainModule } from '@bambu/server-core/domains';

import {
  BambuCalculatorsIntegrationService,
  BambuCalculatorsIntegrationServiceBase,
} from './bambu-calculators-integration.service';
import { BambuCalculatorsIntegrationController } from './bambu-calculators-integration.controller';

@Module({
  imports: [BambuApiLibraryIntegrationDomainModule],
  controllers: [BambuCalculatorsIntegrationController],
  providers: [
    {
      provide: BambuCalculatorsIntegrationServiceBase,
      useClass: BambuCalculatorsIntegrationService,
    },
  ],
})
export class BambuCalculatorsIntegrationModule {}
