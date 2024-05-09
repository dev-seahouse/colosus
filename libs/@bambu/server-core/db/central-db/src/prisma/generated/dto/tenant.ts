import { ConnectAdvisor } from './connect_advisor';
import { Otp } from './otp';
import { TenantApiKey } from './tenant_api_key';
import { TenantHttpUrl } from './tenant_http_url';
import { TenantSubscription } from './tenant_subscription';
import { User } from './user';

export class Tenant {
  id: string;

  realm: string;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  linkedToKeyCloak: boolean = false;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  linkedToFusionAuth: boolean = false;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  usesIdInsteadOfRealm: boolean = false;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  createdBy: string = 'unknown';

  createdAt: Date;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  updatedBy: string = 'unknown';

  updatedAt: Date;

  apiKeys?: TenantApiKey[];

  httpUrls?: TenantHttpUrl[];

  users?: User[];

  otps?: Otp[];

  connectAdvisors?: ConnectAdvisor[];

  tenantSubscriptions?: TenantSubscription[];
}
