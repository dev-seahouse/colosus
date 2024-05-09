// noinspection ES6PreferShortImport

import { SharedEnums } from '@bambu/shared';
import { Injectable } from '@nestjs/common';
import { IBrokerageIntegrationDomainServiceLocator } from '../i-brokerage-integration-domain-service.locator';
import { BrokerageIntegrationDirectDebitDomainBaseService } from './brokerage-integration-direct-debit-domain-base.service';
import { WealthKernelBrokerageIntegrationDirectDebitDomainService } from './wealth-kernel-brokerage-integration-direct-debit-domain.service';

@Injectable()
export class BrokerageIntegrationDirectDebitDomainServiceLocator
  implements
    IBrokerageIntegrationDomainServiceLocator<BrokerageIntegrationDirectDebitDomainBaseService>
{
  constructor(
    private readonly wealthKernelBrokerageIntegrationDirectDebitDomainService: WealthKernelBrokerageIntegrationDirectDebitDomainService
  ) {}

  GetService(
    brokerageIntegrationType: SharedEnums.SupportedBrokerageIntegrationEnum
  ): BrokerageIntegrationDirectDebitDomainBaseService {
    if (
      brokerageIntegrationType ===
      SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
    ) {
      return this.wealthKernelBrokerageIntegrationDirectDebitDomainService;
    }

    throw new Error(
      `Brokerage integration type ${brokerageIntegrationType} is not supported`
    );
  }
}
