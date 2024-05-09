import { WealthKernelApiRepositoryModule } from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { BrokerageIntegrationDomainHelpersModule } from '../brokerage-integration-domain-helpers';
import { BrokerageIntegrationPartiesDomainServiceLocator } from './brokerage-integration-parties-domain.service-locator';
import { WealthKernelBrokerageIntegrationPartiesDomainService } from './wealth-kernel-brokerage-integration-parties-domain.service';

@Module({
  imports: [
    BrokerageIntegrationDomainHelpersModule,
    WealthKernelApiRepositoryModule,
  ],
  providers: [
    BrokerageIntegrationPartiesDomainServiceLocator,
    WealthKernelBrokerageIntegrationPartiesDomainService,
  ],
  exports: [BrokerageIntegrationPartiesDomainServiceLocator],
})
export class BrokerageIntegrationPartiesModule {}
