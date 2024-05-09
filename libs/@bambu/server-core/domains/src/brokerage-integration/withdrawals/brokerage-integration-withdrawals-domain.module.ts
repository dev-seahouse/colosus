import { WealthKernelApiRepositoryModule } from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { BrokerageIntegrationDomainHelpersModule } from '../brokerage-integration-domain-helpers';
import { BrokerageIntegrationWithdrawalsDomainServiceLocator } from './brokerage-integration-withdrawals-domain-service.locator';
import { WealthKernelBrokerageIntegrationWithdrawalsDomainService } from './wealth-kernel-brokerage-integration-withdrawals-domain.service';

@Module({
  imports: [
    BrokerageIntegrationDomainHelpersModule,
    WealthKernelApiRepositoryModule,
  ],
  providers: [
    BrokerageIntegrationWithdrawalsDomainServiceLocator,
    WealthKernelBrokerageIntegrationWithdrawalsDomainService,
  ],
  exports: [BrokerageIntegrationWithdrawalsDomainServiceLocator],
})
export class BrokerageIntegrationWithdrawalsDomainModule {}
