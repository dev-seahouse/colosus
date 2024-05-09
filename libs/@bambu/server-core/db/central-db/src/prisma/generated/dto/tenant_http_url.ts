import { Tenant } from './tenant';

export class TenantHttpUrl {
  id: string;
  url: string;
  type: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
  Tenant?: Tenant;
  tenantId?: string | null;
}
