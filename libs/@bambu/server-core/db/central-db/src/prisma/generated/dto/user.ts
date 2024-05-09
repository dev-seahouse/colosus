import { ConnectAdvisor } from './connect_advisor';
import { Tenant } from './tenant';

export class User {
  id: string;

  tenantId: string | null;

  Tenant?: Tenant;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  createdBy?: string = 'unknown';

  createdAt?: Date;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  updatedBy?: string = 'unknown';

  updatedAt?: Date;

  connectAdvisor?: ConnectAdvisor;
}
