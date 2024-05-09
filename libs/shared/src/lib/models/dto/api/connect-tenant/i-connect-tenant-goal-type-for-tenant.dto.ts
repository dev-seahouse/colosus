import { IConnectTenantGoalTypeDto } from './i-connect-tenant-goal-type.dto';

export interface IConnectTenantGoalTypeForTenantDto
  extends IConnectTenantGoalTypeDto {
  enabled: boolean;
}
