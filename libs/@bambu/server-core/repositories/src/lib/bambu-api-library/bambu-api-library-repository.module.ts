import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { getBambuApiLibraryConfiguration } from '@bambu/server-core/configuration';

import {
  BambuApiLibraryGraphRepositoryServiceBase,
  BambuApiLibraryGraphRepositoryService,
} from './bambu-api-library-graph-repository.service';
import {
  BambuApiLibraryCountriesRepositoryService,
  BambuApiLibraryCountriesRepositoryServiceBase,
} from './bambu-api-library-countries-repository.service';
import {
  BambuApiLibraryHouseRepositoryService,
  BambuApiLibraryHouseRepositoryServiceBase,
} from './bambu-api-library-house-repository.service';
import {
  BambuApiLibraryEducationRepositoryServiceBase,
  BambuApiLibraryEducationRepositoryService,
} from './bambu-api-library-education-repository.service';
import {
  BambuApiLibraryRetirementRepositoryService,
  BambuApiLibraryRetirementRepositoryServiceBase,
} from './bambu-api-library-retirement-repository.service';
import {
  BambuApiLibraryAccessRepositoryService,
  BambuApiLibraryAccessRepositoryServiceBase,
} from './bambu-api-library-access-repository.service';
import {
  BambuApiLibraryClientConfigRepositoryServiceBase,
  BambuApiLibraryClientConfigRepositoryService,
} from './bambu-api-library-client-config-repository.service';

import {
  BambuApiLibraryRiskProflingRepositoryService,
  BambuApiLibraryRiskProflingRepositoryServiceBase,
} from './bambu-api-library-risk-profling-repositrory.service';

@Module({
  imports: [
    ConfigModule.forFeature(getBambuApiLibraryConfiguration),
    HttpModule,
  ],
  providers: [
    {
      provide: BambuApiLibraryGraphRepositoryServiceBase,
      useClass: BambuApiLibraryGraphRepositoryService,
    },
    {
      provide: BambuApiLibraryCountriesRepositoryServiceBase,
      useClass: BambuApiLibraryCountriesRepositoryService,
    },
    {
      provide: BambuApiLibraryHouseRepositoryServiceBase,
      useClass: BambuApiLibraryHouseRepositoryService,
    },
    {
      provide: BambuApiLibraryEducationRepositoryServiceBase,
      useClass: BambuApiLibraryEducationRepositoryService,
    },
    {
      provide: BambuApiLibraryRetirementRepositoryServiceBase,
      useClass: BambuApiLibraryRetirementRepositoryService,
    },
    {
      provide: BambuApiLibraryAccessRepositoryServiceBase,
      useClass: BambuApiLibraryAccessRepositoryService,
    },
    {
      provide: BambuApiLibraryClientConfigRepositoryServiceBase,
      useClass: BambuApiLibraryClientConfigRepositoryService,
    },
    {
      provide: BambuApiLibraryRiskProflingRepositoryServiceBase,
      useClass: BambuApiLibraryRiskProflingRepositoryService,
    },
  ],
  exports: [
    BambuApiLibraryGraphRepositoryServiceBase,
    BambuApiLibraryCountriesRepositoryServiceBase,
    BambuApiLibraryHouseRepositoryServiceBase,
    BambuApiLibraryEducationRepositoryServiceBase,
    BambuApiLibraryRetirementRepositoryServiceBase,
    BambuApiLibraryAccessRepositoryServiceBase,
    BambuApiLibraryClientConfigRepositoryServiceBase,
    BambuApiLibraryRiskProflingRepositoryServiceBase,
  ],
})
export class BambuApiLibraryRepositoryModule {}
