import { WealthKernelApiRepositoryModule } from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { BrokerageIntegrationDomainHelpersModule } from '../brokerage-integration-domain-helpers';
import { BrokerageIntegrationValuationsDomainServiceLocator } from './brokerage-integration-valuations-domain-service.locator';
import { WealthKernelBrokerageIntegrationValuationsDomainService } from './wealth-kernel-brokerage-integration-valuations-domain.service';

@Module({
  imports: [
    BrokerageIntegrationDomainHelpersModule,
    WealthKernelApiRepositoryModule,
  ],
  providers: [
    BrokerageIntegrationValuationsDomainServiceLocator,
    WealthKernelBrokerageIntegrationValuationsDomainService,
  ],
  exports: [BrokerageIntegrationValuationsDomainServiceLocator],
})
export class BrokerageIntegrationValuationsDomainModule {}
