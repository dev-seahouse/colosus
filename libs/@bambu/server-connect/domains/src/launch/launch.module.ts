import { Module } from '@nestjs/common';
import { TenantModule } from '@bambu/server-core/domains';
import {
  CentralDbRepositoryModule,
  NotificationRepositoryModule,
  NotificationTemplatesRepositoryModule,
} from '@bambu/server-core/repositories';
import { ConfigModule } from '@nestjs/config';
import { LaunchServiceBase } from './launch.service.base';
import { LaunchService } from './launch.service';

@Module({
  imports: [
    TenantModule,
    NotificationRepositoryModule,
    NotificationTemplatesRepositoryModule,
    CentralDbRepositoryModule,
  ],
  providers: [
    {
      provide: LaunchServiceBase,
      useClass: LaunchService,
    },
  ],
  exports: [LaunchServiceBase],
})
export class LaunchModule {}
