// noinspection ES6PreferShortImport

import { IBambuEmailerConfig } from '@bambu/server-core/configuration';
import {
  BambuEmailSendPayload,
  BambuEventEmitterService,
  EMAIL_EVENTS,
} from '@bambu/server-core/utilities';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { INotifyUserDto } from './i-notify-user.dto';
import { NotificationRepositoryServiceBase } from './notification-repository-service.base';
import { NotificationTypeEnum } from './notification-type.enum';

@Injectable()
export class NotificationRepositoryService
  implements NotificationRepositoryServiceBase
{
  readonly #logger: Logger = new Logger(NotificationRepositoryService.name);

  constructor(
    private readonly configService: ConfigService<IBambuEmailerConfig>,
    private readonly eventEmitterService: BambuEventEmitterService
  ) {}

  public async NotifyUser(input: INotifyUserDto): Promise<void> {
    const emailConfig = this.configService.get('defaultTransport', {
      infer: true,
    });
    if (!emailConfig) {
      throw new Error('Default email config not in place.');
    }

    const { to, from, subject, body, type } = input;

    if (!from && type === NotificationTypeEnum.EMAIL) {
      await this.#notifyUserViaEmail(
        to,
        emailConfig.fromEmailAddress,
        subject,
        body
      );
      return;
    }

    if (from && type === NotificationTypeEnum.EMAIL) {
      await this.#notifyUserViaEmail(to, from, subject, body);
      return;
    }

    const unsupportedErrorMessage = [
      'Notification not supported.',
      `Supported notification types are [${Object.keys(
        NotificationTypeEnum
      )}].`,
      `Supplied value was ${type}.`,
    ].join(' ');

    this.#logger.error(unsupportedErrorMessage);

    throw new Error(unsupportedErrorMessage);
  }

  async #notifyUserViaEmail(
    to: string,
    from: string,
    subject: string,
    body: string
  ): Promise<void> {
    const transportConfig = this.configService.get('defaultTransport', {
      infer: true,
    });

    if (!transportConfig) {
      const noTransportErrorMessage = 'Email transport not configured.';
      this.#logger.error(noTransportErrorMessage);
      throw new Error(noTransportErrorMessage);
    }

    // const { fromEmailAddress: defaultUsername } = transportConfig;

    const emailPayload: BambuEmailSendPayload = {
      header: {
        from,
        subject,
        to,
      },
      body: {
        html: body,
        text: body,
      },
    };

    await this.eventEmitterService.emitAsync<BambuEmailSendPayload>(
      EMAIL_EVENTS.SEND,
      emailPayload
    );

    // if (defaultUsername === from) {
    //   await this.eventEmitterService.emitAsync<BambuEmailSendPayload>(
    //     EMAIL_EVENTS.SEND,
    //     emailPayload
    //   );
    //   return;
    // }
    //
    // const errorMessage = [
    //   'Custom email transports are not supported.',
    //   'Only default email is supported for now.',
    // ].join(' ');
    //
    // this.#logger.error(errorMessage);
    //
    // throw new Error(errorMessage);
  }
}
