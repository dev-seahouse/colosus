// noinspection ES6PreferShortImport

import { SharedEnums } from '@bambu/shared';
import { Injectable } from '@nestjs/common';
import { IBrokerageIntegrationDomainServiceLocator } from '../i-brokerage-integration-domain-service.locator';
import { BrokerageIntegrationPartiesDomainBaseService } from './brokerage-integration-parties-domain-base.service';
import { WealthKernelBrokerageIntegrationPartiesDomainService } from './wealth-kernel-brokerage-integration-parties-domain.service';

@Injectable()
export class BrokerageIntegrationPartiesDomainServiceLocator
  implements
    IBrokerageIntegrationDomainServiceLocator<BrokerageIntegrationPartiesDomainBaseService>
{
  constructor(
    private readonly wealthKernelBrokerageIntegrationPartiesDomainService: WealthKernelBrokerageIntegrationPartiesDomainService
  ) {}

  GetService(
    brokerageIntegrationType: SharedEnums.SupportedBrokerageIntegrationEnum
  ): BrokerageIntegrationPartiesDomainBaseService {
    switch (brokerageIntegrationType) {
      case SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL:
        return this.wealthKernelBrokerageIntegrationPartiesDomainService;
      default:
        throw new Error(
          `Brokerage integration type ${brokerageIntegrationType} is not supported`
        );
    }
  }
}
