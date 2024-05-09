import { WealthKernelApiRepositoryModule } from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { BrokerageIntegrationDomainHelpersModule } from '../brokerage-integration-domain-helpers';
import { BrokerageIntegrationPortfoliosDomainServiceLocator } from './brokerage-integration-portfolios-domain-service.locator';
import { WealthKernelBrokerageIntegrationPortfoliosDomainService } from './wealth-kernel-brokerage-integration-portfolios-domain.service';

@Module({
  imports: [
    BrokerageIntegrationDomainHelpersModule,
    WealthKernelApiRepositoryModule,
  ],
  providers: [
    BrokerageIntegrationPortfoliosDomainServiceLocator,
    WealthKernelBrokerageIntegrationPortfoliosDomainService,
  ],
  exports: [BrokerageIntegrationPortfoliosDomainServiceLocator],
})
export class BrokerageIntegrationPortfoliosDomainModule {}
