// noinspection ES6PreferShortImport

import { SharedEnums } from '@bambu/shared';
import { Injectable } from '@nestjs/common';
import { IBrokerageIntegrationDomainServiceLocator } from '../i-brokerage-integration-domain-service.locator';
import { BrokerageIntegrationTransactionsDomainBaseService } from './brokerage-integration-transactions-domain-base.service';
import { WealthKernelBrokerageIntegrationTransactionsDomainService } from './wealth-kernel-brokerage-integration-transactions-domain.service';

@Injectable()
export class BrokerageIntegrationTransactionsDomainServiceLocator
  implements
    IBrokerageIntegrationDomainServiceLocator<BrokerageIntegrationTransactionsDomainBaseService>
{
  constructor(
    private readonly wealthKernelBrokerageIntegrationTransactionsDomainService: WealthKernelBrokerageIntegrationTransactionsDomainService
  ) {}

  GetService(
    brokerageIntegrationType: SharedEnums.SupportedBrokerageIntegrationEnum
  ): BrokerageIntegrationTransactionsDomainBaseService {
    if (
      brokerageIntegrationType ===
      SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
    ) {
      return this.wealthKernelBrokerageIntegrationTransactionsDomainService;
    }

    throw new Error(
      `Brokerage integration type ${brokerageIntegrationType} is not supported`
    );
  }
}
