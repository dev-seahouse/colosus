import { getInvestorClientConfiguration } from '@bambu/server-core/configuration';
import {
  AuthenticationModule,
  IamAdminModule,
  TenantBrandingModule,
  TenantModule,
  RiskProfilingDomainModule,
} from '@bambu/server-core/domains';
import {
  BlobRepositoryModule,
  CacheManagerRepositoryModule,
  CentralDbRepositoryModule,
} from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConnectToolsModule } from '../tools';
import { ConnectAdvisorService } from './connect-advisor.service';
import { ConnectAdvisorServiceBase } from './connect-advisor.service.base';

@Module({
  imports: [
    ConfigModule.forFeature(getInvestorClientConfiguration),
    BlobRepositoryModule,
    ConnectToolsModule,
    TenantModule,
    AuthenticationModule,
    IamAdminModule,
    CentralDbRepositoryModule,
    TenantBrandingModule,
    CacheManagerRepositoryModule,
    RiskProfilingDomainModule,
  ],
  providers: [
    {
      provide: ConnectAdvisorServiceBase,
      useClass: ConnectAdvisorService,
    },
  ],
  exports: [ConnectAdvisorServiceBase],
})
export class ConnectAdvisorModule {}
