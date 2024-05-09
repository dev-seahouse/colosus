import { Tenant } from './tenant';
import { JSONObject } from '@bambu/shared';

export class TenantBranding {
  id: string;
  Tenant?: Tenant;
  tenantId: string;
  branding: JSONObject;
  createdBy = 'unknown';
  createdAt: Date;
  updatedBy = 'unknown';
  updatedAt: Date;
}
