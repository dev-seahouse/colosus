import { Injectable, Logger } from '@nestjs/common';
import {
  TenantCentralDbRepositoryService,
  NotificationRepositoryServiceBase,
  NotificationTemplatesRepositoryServiceBase,
  NotificationTemplateChannelEnum,
  NotificationTypeEnum,
  TemplateNameEnum,
  IVerifyAccountOtpParameters,
  ILaunchPlatformParameters,
} from '@bambu/server-core/repositories';
import { ErrorUtils } from '@bambu/server-core/utilities';
import { LaunchServiceBase } from './launch.service.base';
import { IColossusTrackingDto } from '@bambu/server-core/dto';

@Injectable()
export class LaunchService implements LaunchServiceBase {
  readonly #logger = new Logger(LaunchService.name);

  constructor(
    private readonly tenantCentralDbRepositoryService: TenantCentralDbRepositoryService,
    private readonly notificationRepository: NotificationRepositoryServiceBase,
    private readonly notificationTemplatesRepository: NotificationTemplatesRepositoryServiceBase
  ) {}

  async SendLaunchEmailIfDomainConfigured(
    tenantId: string,
    email: string,
    tracking: IColossusTrackingDto
  ): Promise<boolean> {
    const logPrefix = `${this.SendLaunchEmailIfDomainConfigured.name} -`;
    try {
      const tenant = await this.tenantCentralDbRepositoryService.FindTenantById(
        tenantId
      );
      let url: string;
      if (tenant?.httpUrls?.length) {
        const urlObj = new URL(tenant.httpUrls[0].url);
        url = urlObj.origin;
      } else {
        this.#logger.debug(
          `${logPrefix} No httpUrls found for tenant ${tenantId}`
        );
        return false;
      }
      await this.notificationRepository.NotifyUser({
        body: await this.#getLaunchEmailTemplate(url),
        type: NotificationTypeEnum.EMAIL,
        to: email,
        subject: 'Your client platform is live!',
      });
      return true;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error sending launch email: ${error}, ${JSON.stringify(
          tracking
        )}`
      );
      throw error;
    }
  }

  async #getLaunchEmailTemplate(fullHost, supportEmail = 'support@bambu.co') {
    return await this.notificationTemplatesRepository.GenerateTemplatedMessage({
      channel: NotificationTemplateChannelEnum.EMAIL,
      templateName: TemplateNameEnum.LAUNCH_PLATFORM,
      parameters: {
        url: fullHost,
        supportEmail,
      },
    });
  }
}
