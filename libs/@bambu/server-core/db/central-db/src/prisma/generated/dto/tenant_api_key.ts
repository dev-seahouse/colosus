import { Tenant } from './tenant';

export class TenantApiKey {
  id?: string;

  Tenant?: Tenant;

  tenantId?: string;

  keyType: string;

  keyConfig: object;

  createdBy?: string;

  createdAt?: Date;

  updatedBy?: string;

  updatedAt?: Date;
}
