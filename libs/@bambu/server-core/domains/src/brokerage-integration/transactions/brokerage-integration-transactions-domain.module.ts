import { WealthKernelApiRepositoryModule } from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { BrokerageIntegrationDomainHelpersModule } from '../brokerage-integration-domain-helpers';
import { BrokerageIntegrationTransactionsDomainServiceLocator } from './brokerage-integration-transactions-domain-service.locator';
import { WealthKernelBrokerageIntegrationTransactionsDomainService } from './wealth-kernel-brokerage-integration-transactions-domain.service';

@Module({
  imports: [
    BrokerageIntegrationDomainHelpersModule,
    WealthKernelApiRepositoryModule,
  ],
  providers: [
    BrokerageIntegrationTransactionsDomainServiceLocator,
    WealthKernelBrokerageIntegrationTransactionsDomainService,
  ],
  exports: [BrokerageIntegrationTransactionsDomainServiceLocator],
})
export class BrokerageIntegrationTransactionsDomainModule {}
