import {
  SupportedBrokerageIntegrationEnum,
  TenantTransactBrokerageStatusEnum,
} from '../../../enums';

export interface ITenantTransactBrokerageDto {
  id: string;
  brokerage: SupportedBrokerageIntegrationEnum;
  country: string;
  region?: string | null;
  status?: TenantTransactBrokerageStatusEnum | null;
  tenantId: string;
  createdBy?: string;
  createdAt?: Date | string;
  updatedBy?: string;
  updatedAt?: Date | string;
  // Tenant?: Tenant | null; // Assuming Tenant is another interface you've defined
}
