import { Module } from '@nestjs/common';
import { ConnectToolsModule } from './tools/connect-tools.module';
import { ConnectAdvisorModule } from './advisor/connect-advisor.module';

@Module({
  imports: [ConnectToolsModule, ConnectAdvisorModule],
  exports: [ConnectToolsModule, ConnectAdvisorModule],
})
export class ConnectDomainsModule {}
