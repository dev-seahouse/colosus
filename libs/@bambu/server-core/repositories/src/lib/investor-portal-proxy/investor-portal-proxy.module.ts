import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { getInvestorPortalProxyConfig } from '@bambu/server-core/configuration';

import {
  InvestorPortalProxyRepositoryService,
  InvestorPortalProxyRepositoryServiceBase,
} from './investor-portal-proxy-repository.service';

@Module({
  imports: [ConfigModule.forFeature(getInvestorPortalProxyConfig), HttpModule],
  providers: [
    {
      provide: InvestorPortalProxyRepositoryServiceBase,
      useClass: InvestorPortalProxyRepositoryService,
    },
  ],
  exports: [InvestorPortalProxyRepositoryServiceBase],
})
export class InvestorPortalProxyModule {}
