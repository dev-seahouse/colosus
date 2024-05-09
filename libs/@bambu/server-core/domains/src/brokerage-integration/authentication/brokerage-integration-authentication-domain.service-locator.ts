import { SharedEnums } from '@bambu/shared';
import { Injectable } from '@nestjs/common';
import { IBrokerageIntegrationDomainServiceLocator } from '../i-brokerage-integration-domain-service.locator';
import { BrokerageIntegrationAuthenticationDomainBaseService } from './brokerage-integration-authentication-domain-base.service';
import { WealthKernelBrokerageIntegrationAuthenticationDomainService } from './wealth-kernel-brokerage-integration-authentication-domain.service';

@Injectable()
export class BrokerageIntegrationAuthenticationDomainServiceLocator
  implements
    IBrokerageIntegrationDomainServiceLocator<BrokerageIntegrationAuthenticationDomainBaseService>
{
  constructor(
    private readonly wealthKernelBrokerageIntegrationAuthenticationService: WealthKernelBrokerageIntegrationAuthenticationDomainService
  ) {}

  GetService(
    brokerageIntegrationType: SharedEnums.SupportedBrokerageIntegrationEnum
  ): BrokerageIntegrationAuthenticationDomainBaseService {
    if (
      brokerageIntegrationType ===
      SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
    ) {
      return this.wealthKernelBrokerageIntegrationAuthenticationService;
    }

    throw new Error(
      `BrokerageIntegrationAuthenticationServiceLocator.GetService - Unsupported brokerageIntegrationType: ${brokerageIntegrationType}`
    );
  }
}
