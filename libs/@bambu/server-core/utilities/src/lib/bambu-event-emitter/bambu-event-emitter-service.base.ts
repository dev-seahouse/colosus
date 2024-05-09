import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BambuEventEmitterServiceBase {
  /**
   * fires an event with a payload of the specified type.
   * @param eventName the name of the event to trigger
   * @param payload the data to send to the event handler
   * @returns true if the event was handled by a matching event handler
   */
  abstract emit<PAYLOAD = unknown>(
    eventName: string,
    payload: PAYLOAD
  ): boolean;

  /**
   * fires an event asynchronously with a payload of the specified type.
   * @param eventName the name of the event to trigger
   * @param payload the data to send to the event handler
   * @returns Return the results of the listeners via Promise.all
   */
  abstract emitAsync<PAYLOAD = unknown>(
    eventName: string,
    payload: PAYLOAD
  ): Promise<unknown[]>;
}
