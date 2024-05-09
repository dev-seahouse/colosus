import { getOpenPgpConfiguration } from '@bambu/server-core/configuration';
import {
  CacheManagerRepositoryModule,
  CentralDbRepositoryModule,
  WealthKernelApiRepositoryModule,
} from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  WealthKernelBrokerageIntegrationDomainHelpersService,
  WealthKernelIntegrationHelpersServiceBase,
} from './wealth-kernel-brokerage-integration-domain-helpers.service';

@Module({
  imports: [
    CentralDbRepositoryModule,
    CacheManagerRepositoryModule,
    WealthKernelApiRepositoryModule,
    ConfigModule.forFeature(getOpenPgpConfiguration),
  ],
  providers: [
    {
      provide: WealthKernelIntegrationHelpersServiceBase,
      useClass: WealthKernelBrokerageIntegrationDomainHelpersService,
    },
  ],
  exports: [WealthKernelIntegrationHelpersServiceBase],
})
export class BrokerageIntegrationDomainHelpersModule {}
