import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Observable, of } from 'rxjs';
import { IStripeIntegrationConfigDto } from '@bambu/server-core/configuration';
import { JsonUtils } from '@bambu/server-core/utilities';
import {
  BambuWebhookHandler,
  BambuWebhooksService,
} from '@bambu/server-core/common-rest-endpoints';

import { StripeIntegrationServerDto } from '@bambu/server-core/dto';

const WEBHOOK_HANDLER_NAME = 'StripeWebhook';
const PAYMENT_GATEWAY_NAME = 'STRIPE';

@Injectable()
export class StripeIntegrationWebhooksService
  implements
    BambuWebhookHandler<StripeIntegrationServerDto.IStripeWebhookHandlerValidationResultDto>
{
  readonly #logger = new Logger(StripeIntegrationWebhooksService.name);

  constructor(
    private readonly bambuWebhooksService: BambuWebhooksService,
    private readonly configurationService: ConfigService<IStripeIntegrationConfigDto>
  ) {
    this.#logger.log(
      `Registering the ${WEBHOOK_HANDLER_NAME} webhook handler.`
    );
    this.bambuWebhooksService.RegisterWebhook(WEBHOOK_HANDLER_NAME, this);
    this.#logger.log(`Registered the ${WEBHOOK_HANDLER_NAME} webhook handler.`);
  }

  canHandle(
    headers: Record<string, unknown>,
    body: unknown,
    rawBody: Buffer,
    query: Record<string, unknown>,
    path: string | undefined
  ): boolean {
    const logPrefix = `${this.canHandle.name} -`;
    this.#logger.log(
      `${logPrefix} Checking if request is valid for the ${WEBHOOK_HANDLER_NAME} handler.`
    );

    const debugLoggerParameters = {
      headers,
      body,
      rawBody,
      query,
      path,
    };
    this.#logger.debug(
      `${logPrefix} The input parameters are ${JsonUtils.Stringify(
        debugLoggerParameters
      )}.`
    );

    const isValid = this.#checkIfPathIsValid(path);

    if (isValid) {
      this.#logger.log(
        `${logPrefix} Request is valid for the ${WEBHOOK_HANDLER_NAME} handler.`
      );
      return true;
    }

    this.#logger.log(
      `${logPrefix} Request is not valid for the ${WEBHOOK_HANDLER_NAME} handler.`
    );
    return false;
  }

  #checkIfPathIsValid(path) {
    if (path === null || path === undefined) {
      return false;
    }

    const insensitivePath = String(path).toUpperCase();

    return insensitivePath === PAYMENT_GATEWAY_NAME;
  }

  getEventName(
    headers: Record<string, unknown>,
    body: unknown,
    rawBody: Buffer,
    query: Record<string, unknown>,
    path: string | undefined,
    validation: StripeIntegrationServerDto.IStripeWebhookHandlerValidationResultDto
  ): string {
    const logPrefix = `${this.canHandle.name} -`;

    this.#guardPath(logPrefix, path, headers, body, rawBody, query, validation);
    this.#guardValidationPayload(logPrefix, validation);

    return `${PAYMENT_GATEWAY_NAME.toLowerCase()}.${validation.parsedEventPayload.type.toLowerCase()}`;
  }

  #guardValidationPayload(logPrefix: string, validation: unknown) {
    const isValidationPayloadCorrect: boolean =
      StripeIntegrationServerDto.isStripeWebhookHandlerValidationResultDto(
        validation
      );

    if (!isValidationPayloadCorrect) {
      const invalidValidationPayloadErrorMessage = [
        `${logPrefix} The validation payload is not valid for ${WEBHOOK_HANDLER_NAME}.`,
        `Expected type is IStripeWebhookHandlerValidationResultDto and is not null.`,
        !validation
          ? 'The validation payload is null.'
          : `Validation supplied is as follows: ${JsonUtils.Stringify(
              validation
            )}.`,
      ].join(' ');

      this.#logger.error(invalidValidationPayloadErrorMessage);

      throw new Error(invalidValidationPayloadErrorMessage);
    }
  }

  validate(
    headers: Record<string, unknown>,
    body: unknown,
    rawBody: Buffer,
    query: Record<string, unknown>,
    path: string | undefined
  ): Observable<StripeIntegrationServerDto.IStripeWebhookHandlerValidationResultDto> {
    const logPrefix = `${this.canHandle.name} -`;

    this.#guardPath(logPrefix, path, headers, body, rawBody, query);

    try {
      this.#logger.log(
        `${logPrefix} Processing and validating Stripe webhook payload.`
      );
      const event = this.#getStripeEvent(
        rawBody,
        headers['stripe-signature'] as string
      );
      this.#logger.log(
        `${logPrefix} Processed and validating Stripe webhook payload.`
      );

      const validationResult: StripeIntegrationServerDto.IStripeWebhookHandlerValidationResultDto =
        {
          isValid: true,
          parsedEventPayload: event,
        };

      return of(validationResult);
    } catch (error) {
      throw new BadRequestException('Webhook request is malformed or invalid.');
    }
  }

  #guardPath(logPrefix, path, ...additionalData) {
    this.#logger.log(
      `${logPrefix} Checking if handler path is valid for Stripe webhook calls`
    );
    const debugLoggerParameters = {
      path,
      additionalData,
    };
    this.#logger.debug(
      `${logPrefix} The input parameters are ${JsonUtils.Stringify(
        debugLoggerParameters
      )}.`
    );

    const isPathValid = this.#checkIfPathIsValid(path);

    if (!isPathValid) {
      const invalidPathErrorMessage = [
        `The path supplied is invalid for this hook.`,
        `The path supplied was ${path}.`,
        `The supported path is ${PAYMENT_GATEWAY_NAME}.`,
      ].join(' ');
      this.#logger.error(invalidPathErrorMessage);
      throw new Error(invalidPathErrorMessage);
    }
  }

  #getStripeEvent(rawBody: Buffer, signature: string): Stripe.Event {
    const webhookEndpointSecret = this.configurationService.get(
      'webhookEndpointSecret'
    );
    const stripeSecretKey = this.configurationService.get('secretKey');
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: this.configurationService.get('apiVersion'),
    });

    try {
      return stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookEndpointSecret
      );
    } catch (error) {
      /**
       * No punctuation/full stop/period added.
       * Stripe messages already have those :D.
       */
      const baseErrorMessage = `Webhook Error. ${error.message}`;

      this.#logger.error(
        `${baseErrorMessage} Details: ${JsonUtils.Stringify(error)}.`
      );

      throw error;
    }
  }
}
