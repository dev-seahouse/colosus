import {
  getAzureBlobStorageConfiguration,
  getDefaultServerConfiguration,
} from '@bambu/server-core/configuration';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AzureBlobRepositoryWithInitializationService } from './azure-blob-repository-with-initialization.service';
import { BlobRepositoryServiceBase } from './blob-repository.service.base';

/**
 * If path is provided, it must end in `/` and it will be used as a prefix for all blob names.
 */
@Module({
  imports: [
    ConfigModule.forFeature(getDefaultServerConfiguration),
    ConfigModule.forFeature(getAzureBlobStorageConfiguration),
    HttpModule,
  ],
  providers: [
    {
      provide: BlobRepositoryServiceBase,
      useClass: AzureBlobRepositoryWithInitializationService,
    },
  ],
  exports: [BlobRepositoryServiceBase],
})
export class BlobRepositoryModule {}
