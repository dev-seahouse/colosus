import { WealthKernelApiRepositoryModule } from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { BrokerageIntegrationDomainHelpersModule } from '../brokerage-integration-domain-helpers';
import { BrokerageIntegrationAccountsDomainServiceLocator } from './brokerage-integration-accounts-domain-service.locator';
import { WealthKernelBrokerageIntegrationAccountsDomainService } from './wealth-kernel-brokerage-integration-accounts-domain.service';

@Module({
  imports: [
    BrokerageIntegrationDomainHelpersModule,
    WealthKernelApiRepositoryModule,
  ],
  providers: [
    BrokerageIntegrationAccountsDomainServiceLocator,
    WealthKernelBrokerageIntegrationAccountsDomainService,
  ],
  exports: [BrokerageIntegrationAccountsDomainServiceLocator],
})
export class BrokerageIntegrationAccountsModule {}
