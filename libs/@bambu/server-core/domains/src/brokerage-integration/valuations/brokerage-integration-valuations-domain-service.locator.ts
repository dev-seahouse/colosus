// noinspection ES6PreferShortImport

import { SharedEnums } from '@bambu/shared';
import { Injectable } from '@nestjs/common';
import { IBrokerageIntegrationDomainServiceLocator } from '../i-brokerage-integration-domain-service.locator';
import { BrokerageIntegrationValuationsDomainBaseService } from './brokerage-integration-valuations-domain-base.service';
import { WealthKernelBrokerageIntegrationValuationsDomainService } from './wealth-kernel-brokerage-integration-valuations-domain.service';

@Injectable()
export class BrokerageIntegrationValuationsDomainServiceLocator
  implements
    IBrokerageIntegrationDomainServiceLocator<BrokerageIntegrationValuationsDomainBaseService>
{
  constructor(
    private readonly wealthKernelBrokerageIntegrationValuationsDomainService: WealthKernelBrokerageIntegrationValuationsDomainService
  ) {}

  GetService(
    brokerageIntegrationType: SharedEnums.SupportedBrokerageIntegrationEnum
  ): BrokerageIntegrationValuationsDomainBaseService {
    if (
      brokerageIntegrationType ===
      SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
    ) {
      return this.wealthKernelBrokerageIntegrationValuationsDomainService;
    }

    throw new Error(
      `Brokerage integration type ${brokerageIntegrationType} is not supported`
    );
  }
}
