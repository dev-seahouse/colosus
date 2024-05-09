// noinspection ES6PreferShortImport

import { SharedEnums } from '@bambu/shared';
import { Injectable } from '@nestjs/common';
import { IBrokerageIntegrationDomainServiceLocator } from '../i-brokerage-integration-domain-service.locator';
import { BrokerageIntegrationPerformanceDomainBaseService } from './brokerage-integration-performance-domain-base.service';
import { WealthKernelBrokerageIntegrationPerformanceDomainService } from './wealth-kernel-brokerage-integration-performance-domain.service';

@Injectable()
export class BrokerageIntegrationPerformanceDomainServiceLocator
  implements
    IBrokerageIntegrationDomainServiceLocator<BrokerageIntegrationPerformanceDomainBaseService>
{
  constructor(
    private readonly wealthKernelBrokerageIntegrationPerformanceDomainService: WealthKernelBrokerageIntegrationPerformanceDomainService
  ) {}

  GetService(
    brokerageIntegrationType: SharedEnums.SupportedBrokerageIntegrationEnum
  ): BrokerageIntegrationPerformanceDomainBaseService {
    if (
      brokerageIntegrationType ===
      SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
    ) {
      return this.wealthKernelBrokerageIntegrationPerformanceDomainService;
    }

    throw new Error(
      `Brokerage integration type ${brokerageIntegrationType} is not supported`
    );
  }
}
