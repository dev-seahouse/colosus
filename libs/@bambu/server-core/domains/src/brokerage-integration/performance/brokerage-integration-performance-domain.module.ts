import { WealthKernelApiRepositoryModule } from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { BrokerageIntegrationDomainHelpersModule } from '../brokerage-integration-domain-helpers';
import { BrokerageIntegrationPerformanceDomainServiceLocator } from './brokerage-integration-performance-domain-service.locator';
import { WealthKernelBrokerageIntegrationPerformanceDomainService } from './wealth-kernel-brokerage-integration-performance-domain.service';

@Module({
  imports: [
    BrokerageIntegrationDomainHelpersModule,
    WealthKernelApiRepositoryModule,
  ],
  providers: [
    BrokerageIntegrationPerformanceDomainServiceLocator,
    WealthKernelBrokerageIntegrationPerformanceDomainService,
  ],
  exports: [BrokerageIntegrationPerformanceDomainServiceLocator],
})
export class BrokerageIntegrationPerformanceDomainModule {}
