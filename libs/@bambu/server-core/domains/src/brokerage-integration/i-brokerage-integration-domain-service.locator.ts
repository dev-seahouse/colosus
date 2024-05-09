import { SharedEnums } from '@bambu/shared';

export interface IBrokerageIntegrationDomainServiceLocator<T> {
  GetService(
    brokerageIntegrationType: SharedEnums.SupportedBrokerageIntegrationEnum
  ): T;
}
