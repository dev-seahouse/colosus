import { WealthKernelApiRepositoryModule } from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { BrokerageIntegrationDomainHelpersModule } from '../brokerage-integration-domain-helpers';
import { BrokerageIntegrationDirectDebitDomainServiceLocator } from './brokerage-integration-direct-debit-domain-service.locator';
import { WealthKernelBrokerageIntegrationDirectDebitDomainService } from './wealth-kernel-brokerage-integration-direct-debit-domain.service';

@Module({
  imports: [
    BrokerageIntegrationDomainHelpersModule,
    WealthKernelApiRepositoryModule,
  ],
  providers: [
    BrokerageIntegrationDirectDebitDomainServiceLocator,
    WealthKernelBrokerageIntegrationDirectDebitDomainService,
  ],
  exports: [BrokerageIntegrationDirectDebitDomainServiceLocator],
})
export class BrokerageIntegrationDirectDebitDomainModule {}
