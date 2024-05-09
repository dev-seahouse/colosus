/**
 * TODO:
 * We really should move this somewhere else.
 *
 * This will cause circular dependencies at some point.
 *
 * Will do this later due to time constraints.
 */

import {
  getOpenPgpConfiguration,
  getWealthKernelEmailsConfiguration,
} from '@bambu/server-core/configuration';
import {
  BlobRepositoryModule,
  CentralDbRepositoryModule,
  FusionAuthIamRepositoryModule,
  NotificationRepositoryService,
  NotificationRepositoryServiceBase,
  NotificationTemplatesRepositoryService,
  NotificationTemplatesRepositoryServiceBase,
} from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  TransactAdvisorService,
  TransactAdvisorServiceBase,
} from './transact-advisor.service';

@Module({
  imports: [
    CentralDbRepositoryModule,
    BlobRepositoryModule,
    ConfigModule.forFeature(getOpenPgpConfiguration),
    ConfigModule.forFeature(getWealthKernelEmailsConfiguration),
    FusionAuthIamRepositoryModule,
  ],
  providers: [
    {
      provide: TransactAdvisorServiceBase,
      useClass: TransactAdvisorService,
    },
    {
      provide: NotificationRepositoryServiceBase,
      useClass: NotificationRepositoryService,
    },
    {
      provide: NotificationTemplatesRepositoryServiceBase,
      useClass: NotificationTemplatesRepositoryService,
    },
  ],
  exports: [TransactAdvisorServiceBase],
})
export class TransactAdvisorModule {}
