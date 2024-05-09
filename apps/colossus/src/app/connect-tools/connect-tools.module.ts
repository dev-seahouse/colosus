import { Module } from '@nestjs/common';

import { ConnectDomainsModule } from '@bambu/server-connect/domains';

import { ConnectToolsController } from './connect-tools.controller';
import { CentralDbRepositoryModule } from '@bambu/server-core/repositories';

@Module({
  imports: [ConnectDomainsModule, CentralDbRepositoryModule],
  controllers: [ConnectToolsController],
})
export class ConnectToolsModule {}
