// noinspection ES6PreferShortImport

import { SharedEnums } from '@bambu/shared';
import { Injectable } from '@nestjs/common';
import { IBrokerageIntegrationDomainServiceLocator } from '../i-brokerage-integration-domain-service.locator';
import { BrokerageIntegrationModelsDomainBaseService } from './brokerage-integration-models-domain-base.service';
import { WealthKernelBrokerageIntegrationModelsDomainService } from './wealth-kernel-brokerage-integration-models-domain.service';

@Injectable()
export class BrokerageIntegrationModelsDomainServiceLocator
  implements
    IBrokerageIntegrationDomainServiceLocator<BrokerageIntegrationModelsDomainBaseService>
{
  constructor(
    private readonly wealthKernelBrokerageIntegrationModelsDomainService: WealthKernelBrokerageIntegrationModelsDomainService
  ) {}

  GetService(
    brokerageIntegrationType: SharedEnums.SupportedBrokerageIntegrationEnum
  ): BrokerageIntegrationModelsDomainBaseService {
    if (
      brokerageIntegrationType ===
      SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
    ) {
      return this.wealthKernelBrokerageIntegrationModelsDomainService;
    }

    throw new Error(
      `Brokerage integration type ${brokerageIntegrationType} is not supported`
    );
  }
}
