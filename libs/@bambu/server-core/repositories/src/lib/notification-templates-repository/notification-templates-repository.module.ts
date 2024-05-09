import { getAzureBlobStorageConfiguration } from '@bambu/server-core/configuration';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationTemplatesRepositoryServiceBase } from './notification-templates-repository-service.base';
import { NotificationTemplatesRepositoryService } from './notification-templates-repository.service';

@Module({
  imports: [ConfigModule.forFeature(getAzureBlobStorageConfiguration)],
  providers: [
    {
      provide: NotificationTemplatesRepositoryServiceBase,
      useClass: NotificationTemplatesRepositoryService,
    },
  ],
  exports: [NotificationTemplatesRepositoryServiceBase],
})
export class NotificationTemplatesRepositoryModule {}
