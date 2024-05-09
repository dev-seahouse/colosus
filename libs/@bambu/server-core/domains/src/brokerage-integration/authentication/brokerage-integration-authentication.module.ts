import { CentralDbRepositoryModule } from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { BrokerageIntegrationDomainHelpersModule } from '../brokerage-integration-domain-helpers';
import { BrokerageIntegrationAuthenticationDomainServiceLocator } from './brokerage-integration-authentication-domain.service-locator';
import { WealthKernelBrokerageIntegrationAuthenticationDomainService } from './wealth-kernel-brokerage-integration-authentication-domain.service';

@Module({
  imports: [CentralDbRepositoryModule, BrokerageIntegrationDomainHelpersModule],
  providers: [
    BrokerageIntegrationAuthenticationDomainServiceLocator,
    WealthKernelBrokerageIntegrationAuthenticationDomainService,
  ],
  exports: [BrokerageIntegrationAuthenticationDomainServiceLocator],
})
export class BrokerageIntegrationAuthenticationModule {}
