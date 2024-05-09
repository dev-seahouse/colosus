import { IColossusTrackingDto } from '@bambu/server-core/dto';

export abstract class LaunchServiceBase {
  abstract SendLaunchEmailIfDomainConfigured(
    tenantId: string,
    email: string,
    tracking: IColossusTrackingDto
  ): Promise<boolean>;
}
