import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { getDefaultBambuEmailerConfiguration } from '@bambu/server-core/configuration';
import { BambuEventEmitterModule } from '@bambu/server-core/utilities';

import { NotificationRepositoryServiceBase } from './notification-repository-service.base';
import { NotificationRepositoryService } from './notification-repository.service';

@Module({
  imports: [
    ConfigModule.forFeature(getDefaultBambuEmailerConfiguration),
    BambuEventEmitterModule,
  ],
  providers: [
    {
      provide: NotificationRepositoryServiceBase,
      useClass: NotificationRepositoryService,
    },
  ],
  exports: [NotificationRepositoryServiceBase],
})
export class NotificationRepositoryModule {}
