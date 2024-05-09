import { IBambuEmailerConfig } from '@bambu/server-core/configuration';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { createTransport, Transporter } from 'nodemailer';

import * as JsonUtils from '../json-utils';

import { BambuEventEmitterService } from '../bambu-event-emitter';
import { BambuEmailerServiceBase } from './bambu-emailer-service.base';
import { EmailResponseInfo } from './types';
import { BambuEmailSendPayload } from './types/bambu-email-send-payload.type';
import { EmailContentOptions } from './types/email-content.type';
import { EmailError } from './types/email-error.type';
import { EMAIL_EVENTS } from './types/email-events.type';
import { EmailHeaderOptions } from './types/email-header-options.type';
import { EmailMailbox } from './types/email-mailbox.type';

import {
  EmailTransportOptions,
  isEmailTransportSecure,
} from './types/email-transport-options.type';

export class BambuEmailerService extends BambuEmailerServiceBase {
  constructor(
    protected readonly emailerConfig: IBambuEmailerConfig,
    protected readonly eventEmitter: BambuEventEmitterService,
    protected readonly logger: Logger
  ) {
    super();
  }

  private createTransporter(transportConfig?: EmailTransportOptions): {
    transporter: Transporter;
    config: EmailTransportOptions;
  } {
    try {
      // If no transporter, use the default
      let transportOptions: any = null;
      if (!transportConfig) {
        transportOptions = {
          host: this.emailerConfig.defaultTransport.host,
          port: this.emailerConfig.defaultTransport.port,
          secure: this.emailerConfig.defaultTransport.secure,
          auth: this.emailerConfig.defaultTransport.secure
            ? {
                user: this.emailerConfig.defaultTransport.username,
                pass: this.emailerConfig.defaultTransport.password,
              }
            : undefined,
        };
      } else if (isEmailTransportSecure(transportConfig)) {
        transportOptions = {
          ...transportConfig,
          auth: {
            user: transportConfig?.auth?.user,
            pass: transportConfig?.auth?.password,
          },
        };
      } else {
        transportOptions = transportConfig;
      }
      return {
        transporter: createTransport(transportOptions),
        config: transportOptions,
      };
    } catch (err) {
      if (transportConfig) {
        this.eventEmitter.emitAsync<EmailError>(EMAIL_EVENTS.TRANSPORT_ERROR, {
          transport: transportConfig,
          error: err,
        });
      }

      throw err;
    }
  }

  private stringFromMailbox(email: string | EmailMailbox): string {
    if (typeof email === 'string') {
      return email;
    } else {
      return `"${email.displayName || email.address}" <${email.address}>`;
    }
  }

  private createEmailPacket(
    header: EmailHeaderOptions,
    content: EmailContentOptions
  ) {
    return {
      from: this.stringFromMailbox(header.from),
      to:
        typeof header.to === 'string'
          ? header.to
          : header.to.map(this.stringFromMailbox).join(', '),
      subject: header.subject,
      text: content.text,
      html: content.html,
    };
  }

  async sendEmail(
    emailDefinition: BambuEmailSendPayload
  ): Promise<EmailResponseInfo | EmailError> {
    const { transport, header, body } = emailDefinition;

    // Create the mail transporter
    const { transporter, config } = this.createTransporter(transport);

    if (!transporter) {
      throw new Error('Invalid state: no default transporter');
    }

    try {
      const emailPackage = this.createEmailPacket(header, body);

      const info: EmailResponseInfo = await transporter.sendMail(emailPackage);

      await this.eventEmitter.emitAsync<EmailResponseInfo>(
        EMAIL_EVENTS.SENT,
        info
      );

      return info;
    } catch (err) {
      const errorInfo: EmailError = {
        transport: {
          host: config.host,
          port: config.port,
          secure: config.secure,
        },
        error: err,
      };
      if ((err as any).code === 'EDNS') {
        await this.eventEmitter.emitAsync<EmailError>(
          EMAIL_EVENTS.TRANSPORT_ERROR,
          errorInfo
        );
      } else {
        await this.eventEmitter.emitAsync<EmailError>(
          EMAIL_EVENTS.SEND_ERROR,
          errorInfo
        );
      }
      return errorInfo;
    } finally {
      transporter.close();
    }
  }

  @OnEvent(EMAIL_EVENTS.TRANSPORT_ERROR)
  handleEmailTransportError(err: EmailError) {
    this.logger.error(
      this.#generateEventHandlerMessage(EMAIL_EVENTS.TRANSPORT_ERROR, err)
    );
  }

  @OnEvent(EMAIL_EVENTS.SEND_ERROR)
  handleEmailSendError(err: EmailError) {
    this.logger.error(
      this.#generateEventHandlerMessage(EMAIL_EVENTS.SEND_ERROR, err)
    );
  }

  @OnEvent(EMAIL_EVENTS.SENT)
  handleEmailSent(info: EmailResponseInfo) {
    this.logger.log(this.#generateEventHandlerMessage(EMAIL_EVENTS.SENT, info));
  }

  @OnEvent(EMAIL_EVENTS.SEND)
  handleEmailSendEvent(payload: BambuEmailSendPayload) {
    this.logger.debug(
      this.#generateEventHandlerMessage(EMAIL_EVENTS.SEND, payload)
    );
    this.sendEmail(payload);
  }

  #generateEventHandlerMessage(
    eventName: string,
    additionalMetadata?: object
  ): string {
    const message = [`The email event ${eventName} has been dispatched.`];

    if (additionalMetadata) {
      message.push(
        `Event payload: ${JsonUtils.Stringify(additionalMetadata)}.`
      );
    }

    return message.join(' ');
  }
}
