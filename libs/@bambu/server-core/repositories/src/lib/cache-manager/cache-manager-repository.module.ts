import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import {
  CacheManagerRepositoryService,
  CacheManagerRepositoryServiceBase,
} from './cache-manager-repository.service';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: CacheManagerRepositoryServiceBase,
      useClass: CacheManagerRepositoryService,
    },
  ],
  exports: [CacheManagerRepositoryServiceBase],
})
export class CacheManagerRepositoryModule {}
