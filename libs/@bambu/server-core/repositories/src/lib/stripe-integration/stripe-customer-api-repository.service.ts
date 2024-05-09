import { Logger } from '@nestjs/common';
import Stripe from 'stripe';

import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';

import { BaseStripeRepositoryService } from './base-stripe-repository.service';

export abstract class StripeCustomerApiRepositoryServiceBase extends BaseStripeRepositoryService {
  public abstract GetCustomerById(
    requestId: string,
    stripeCustomerId: string,
    params?: Stripe.CustomerRetrieveParams,
    options?: Stripe.RequestOptions
  ): Promise<
    | (Stripe.Customer & {
        lastResponse: {
          headers: { [p: string]: string };
          requestId: string;
          statusCode: number;
          apiVersion?: string;
          idempotencyKey?: string;
          stripeAccount?: string;
        };
      })
    | (Stripe.DeletedCustomer & {
        lastResponse: {
          headers: { [p: string]: string };
          requestId: string;
          statusCode: number;
          apiVersion?: string;
          idempotencyKey?: string;
          stripeAccount?: string;
        };
      })
  >;
}

export class StripeCustomerApiRepositoryService extends StripeCustomerApiRepositoryServiceBase {
  readonly #logger: Logger = new Logger(
    StripeCustomerApiRepositoryService.name
  );

  public async GetCustomerById(
    requestId: string,
    stripeCustomerId: string,
    params?: Stripe.CustomerRetrieveParams,
    options?: Stripe.RequestOptions
  ): Promise<
    | (Stripe.Customer & {
        lastResponse: {
          headers: { [p: string]: string };
          requestId: string;
          statusCode: number;
          apiVersion?: string;
          idempotencyKey?: string;
          stripeAccount?: string;
        };
      })
    | (Stripe.DeletedCustomer & {
        lastResponse: {
          headers: { [p: string]: string };
          requestId: string;
          statusCode: number;
          apiVersion?: string;
          idempotencyKey?: string;
          stripeAccount?: string;
        };
      })
  > {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetCustomerById.name,
      requestId
    );
    const inputParameters = {
      stripeCustomerId,
      params,
      options,
    };
    this.#logger.debug(
      [
        `${logPrefix} Retrieving stripe customer by id (${stripeCustomerId}).`,
        `Inputs: ${JsonUtils.Stringify(inputParameters)}`,
      ].join(' ')
    );
    try {
      const result = await this.stripeClient.customers.retrieve(
        stripeCustomerId,
        params,
        options
      );
      this.#logger.debug(
        [
          `${logPrefix} Retrieved customer.`,
          `Details: ${JsonUtils.Stringify(result)}`,
        ].join(' ')
      );
      return result;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered when retrieving customer.`,
        `Error Message: ${(error as Error).message}.`,
        `Additional details: ${JsonUtils.Stringify({
          error,
          inputParameters,
        })}`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }
}
