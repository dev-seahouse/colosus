// noinspection ES6PreferShortImport

import { SharedEnums } from '@bambu/shared';
import { Injectable } from '@nestjs/common';
import { IBrokerageIntegrationDomainServiceLocator } from '../i-brokerage-integration-domain-service.locator';
import { BrokerageIntegrationAccountsDomainBaseService } from './brokerage-integration-accounts-domain-base.service';
import { WealthKernelBrokerageIntegrationAccountsDomainService } from './wealth-kernel-brokerage-integration-accounts-domain.service';

@Injectable()
export class BrokerageIntegrationAccountsDomainServiceLocator
  implements
    IBrokerageIntegrationDomainServiceLocator<BrokerageIntegrationAccountsDomainBaseService>
{
  constructor(
    private readonly wealthKernelBrokerageIntegrationAccountsDomainService: WealthKernelBrokerageIntegrationAccountsDomainService
  ) {}

  GetService(
    brokerageIntegrationType: SharedEnums.SupportedBrokerageIntegrationEnum
  ): BrokerageIntegrationAccountsDomainBaseService {
    if (
      brokerageIntegrationType ===
      SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
    ) {
      return this.wealthKernelBrokerageIntegrationAccountsDomainService;
    }

    throw new Error(
      `Brokerage integration type ${brokerageIntegrationType} is not supported`
    );
  }
}
