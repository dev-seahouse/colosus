import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Stringify } from '../json-utils';
import { BambuEventEmitterServiceBase } from './bambu-event-emitter-service.base';

export class BambuEventEmitterService extends BambuEventEmitterServiceBase {
  constructor(
    private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2
  ) {
    super();
  }

  emit<PAYLOAD = unknown>(eventName: string, payload: PAYLOAD): boolean {
    this.logger.debug(`Firing Event: ${eventName}.`);
    return this.eventEmitter.emit(eventName, payload);
  }

  emitAsync<PAYLOAD = unknown>(
    eventName: string,
    payload: PAYLOAD
  ): Promise<unknown[]> {
    this.logger.debug(`Firing Async Event: ${eventName}.`);
    try {
      return this.eventEmitter.emitAsync(eventName, payload);
    } catch (error) {
      this.logger.error(
        `Error firing async event: ${eventName}. Error: ${Stringify(error)}.`
      );
      return Promise.resolve([]);
    }
  }
}
