import { WealthKernelApiRepositoryModule } from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { BrokerageIntegrationDomainHelpersModule } from '../brokerage-integration-domain-helpers';
import { BrokerageIntegrationModelsDomainServiceLocator } from './brokerage-integration-models-domain-service.locator';
import { WealthKernelBrokerageIntegrationModelsDomainService } from './wealth-kernel-brokerage-integration-models-domain.service';

@Module({
  imports: [
    BrokerageIntegrationDomainHelpersModule,
    WealthKernelApiRepositoryModule,
  ],
  providers: [
    BrokerageIntegrationModelsDomainServiceLocator,
    WealthKernelBrokerageIntegrationModelsDomainService,
  ],
  exports: [BrokerageIntegrationModelsDomainServiceLocator],
})
export class BrokerageIntegrationModelsDomainModule {}
