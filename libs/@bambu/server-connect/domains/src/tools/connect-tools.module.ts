import { Module } from '@nestjs/common';
import {
  ConnectToolsService,
  ConnectToolsServiceBase,
} from './connect-tools.service';
import { getInvestorClientConfiguration } from '@bambu/server-core/configuration';
import { ConfigModule } from '@nestjs/config';
import { CentralDbRepositoryModule } from '@bambu/server-core/repositories';

@Module({
  imports: [
    ConfigModule.forFeature(getInvestorClientConfiguration),
    CentralDbRepositoryModule,
  ],
  providers: [
    {
      provide: ConnectToolsServiceBase,
      useClass: ConnectToolsService,
    },
  ],
  exports: [ConnectToolsServiceBase],
})
export class ConnectToolsModule {}
