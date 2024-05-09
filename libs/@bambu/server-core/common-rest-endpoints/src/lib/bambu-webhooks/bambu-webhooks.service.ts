import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  filter,
  first,
  from,
  map,
  Observable,
  switchMap,
  tap,
  throwIfEmpty,
} from 'rxjs';
import { BambuEventEmitterService } from '@bambu/server-core/utilities';
import { BambuWebhookHandler } from './bambu-webhook-handler.base';
import { IWebhookPayload } from './types';

enum EVENTS {
  LOGGING = 'webhook.logging',
}

type WebhookEventDescription = {
  name: string;
  payload: unknown;
};

@Injectable()
export class BambuWebhooksService {
  #logger: Logger;
  #handlers: Record<string, BambuWebhookHandler> = {};

  constructor(private eventEmitter: BambuEventEmitterService) {
    this.#logger = new Logger(this.constructor.name);
  }

  RegisterWebhook(
    name: string,
    handler: BambuWebhookHandler
  ): BambuWebhookHandler {
    const replaced = this.#handlers[name];
    this.#handlers[name] = handler;
    return replaced;
  }

  UnregisterWebhook(name: string) {
    const handler = this.#handlers[name];
    delete this.#handlers[name];
    return handler;
  }

  getWebhooks() {
    return Object.keys(this.#handlers);
  }

  handleWebhook(
    path: string | undefined,
    headers: Record<string, unknown>,
    body: unknown,
    rawBody: Buffer,
    query: Record<string, unknown>
  ): Observable<unknown> {
    return from(Object.entries(this.#handlers)).pipe(
      filter(([handlerName, handler]) => {
        this.#logger.debug(`Testing handler ${handlerName}`);
        return handler.canHandle(headers, body, rawBody, query, path);
      }),
      // If no handler throw bad request
      throwIfEmpty(() => {
        return new BadRequestException('No handler found for webhook');
      }),
      // Find first handler that can parse this data
      first(),
      // Validate the data is coming from the expected source
      switchMap(([handlerName, handler]) => {
        return handler.validate(headers, body, rawBody, query, path).pipe(
          map((validationResult) => {
            return {
              name: handlerName,
              handler: handler,
              validation: validationResult,
              eventName: handler.getEventName(
                headers,
                body,
                rawBody,
                query,
                path,
                validationResult
              ),
            };
          })
        );
      }),
      // Prepare the data for the webhook event
      map((result) => {
        return {
          name: `webhook.${result.eventName}`,
          payload: {
            headers,
            body,
            rawBody,
            query,
            path,
            validationResult: result.validation,
          } as IWebhookPayload,
        };
      }),
      // Notify that an event has been triggered
      tap((eventPayload) => {
        this.eventEmitter.emit(EVENTS.LOGGING, eventPayload);
      }),
      // trigger the event
      switchMap((eventPayload) => {
        const { name, payload } = eventPayload;
        return this.eventEmitter.emitAsync(name, payload as IWebhookPayload);
      })
    );
  }

  @OnEvent(EVENTS.LOGGING)
  private logWebhookEvent(payload: WebhookEventDescription) {
    const parsedPayload = payload
      ? typeof payload === 'object'
        ? JSON.stringify(payload.payload)
        : payload
      : '';
    this.#logger.log(
      `Received webhook ${payload.name} with payload ${parsedPayload}`
    );
  }
}
