// noinspection ES6PreferShortImport

import { SharedEnums } from '@bambu/shared';
import { Injectable } from '@nestjs/common';
import { IBrokerageIntegrationDomainServiceLocator } from '../i-brokerage-integration-domain-service.locator';
import { BrokerageIntegrationPortfoliosDomainBaseService } from './brokerage-integration-portfolios-domain-base.service';
import { WealthKernelBrokerageIntegrationPortfoliosDomainService } from './wealth-kernel-brokerage-integration-portfolios-domain.service';

@Injectable()
export class BrokerageIntegrationPortfoliosDomainServiceLocator
  implements
    IBrokerageIntegrationDomainServiceLocator<BrokerageIntegrationPortfoliosDomainBaseService>
{
  constructor(
    private readonly wealthKernelBrokerageIntegrationPortfoliosDomainService: WealthKernelBrokerageIntegrationPortfoliosDomainService
  ) {}

  GetService(
    brokerageIntegrationType: SharedEnums.SupportedBrokerageIntegrationEnum
  ): BrokerageIntegrationPortfoliosDomainBaseService {
    if (
      brokerageIntegrationType ===
      SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
    ) {
      return this.wealthKernelBrokerageIntegrationPortfoliosDomainService;
    }

    throw new Error(
      `Brokerage integration type ${brokerageIntegrationType} is not supported`
    );
  }
}
