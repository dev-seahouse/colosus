// noinspection ES6PreferShortImport

import { SharedEnums } from '@bambu/shared';
import { Injectable } from '@nestjs/common';
import { IBrokerageIntegrationDomainServiceLocator } from '../i-brokerage-integration-domain-service.locator';
import { BrokerageIntegrationWithdrawalsDomainBaseService } from './brokerage-integration-withdrawals-domain-base.service';
import { WealthKernelBrokerageIntegrationWithdrawalsDomainService } from './wealth-kernel-brokerage-integration-withdrawals-domain.service';

@Injectable()
export class BrokerageIntegrationWithdrawalsDomainServiceLocator
  implements
    IBrokerageIntegrationDomainServiceLocator<BrokerageIntegrationWithdrawalsDomainBaseService>
{
  constructor(
    private readonly wealthKernelBrokerageIntegrationWithdrawalsDomainService: WealthKernelBrokerageIntegrationWithdrawalsDomainService
  ) {}

  GetService(
    brokerageIntegrationType: SharedEnums.SupportedBrokerageIntegrationEnum
  ): BrokerageIntegrationWithdrawalsDomainBaseService {
    if (
      brokerageIntegrationType ===
      SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
    ) {
      return this.wealthKernelBrokerageIntegrationWithdrawalsDomainService;
    }

    throw new Error(
      `Brokerage integration type ${brokerageIntegrationType} is not supported`
    );
  }
}
