import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { BaseStripeRepositoryService } from './base-stripe-repository.service';

export abstract class StripeSubscriptionApiRepositoryServiceBase extends BaseStripeRepositoryService {
  public abstract List(
    requestId: string,
    params?: Stripe.SubscriptionListParams,
    options?: Stripe.RequestOptions
  ): Promise<
    Stripe.ApiList<Stripe.Subscription> & {
      lastResponse: {
        headers: { [p: string]: string };
        requestId: string;
        statusCode: number;
        apiVersion?: string;
        idempotencyKey?: string;
        stripeAccount?: string;
      };
    }
  >;

  public abstract GetById(
    requestId: string,
    subscriptionId: string,
    params?: Stripe.SubscriptionRetrieveParams,
    options?: Stripe.RequestOptions
  ): Promise<
    Stripe.Subscription & {
      lastResponse: {
        headers: { [p: string]: string };
        requestId: string;
        statusCode: number;
        apiVersion?: string;
        idempotencyKey?: string;
        stripeAccount?: string;
      };
    }
  >;

  public abstract UpdateSubscription(
    requestId: string,
    subscriptionId: string,
    subscriptionItemId: string,
    priceId: string,
    prorationDate: number
  ): Promise<
    Stripe.Subscription & {
      lastResponse: {
        headers: { [p: string]: string };
        requestId: string;
        statusCode: number;
        apiVersion?: string;
        idempotencyKey?: string;
        stripeAccount?: string;
      };
    }
  >;
}

@Injectable()
export class StripeSubscriptionApiRepositoryService extends StripeSubscriptionApiRepositoryServiceBase {
  readonly #logger: Logger = new Logger(
    StripeSubscriptionApiRepositoryService.name
  );

  public async List(
    requestId: string,
    params?: Stripe.SubscriptionListParams,
    options?: Stripe.RequestOptions
  ): Promise<
    Stripe.ApiList<Stripe.Subscription> & {
      lastResponse: {
        headers: { [p: string]: string };
        requestId: string;
        statusCode: number;
        apiVersion?: string;
        idempotencyKey?: string;
        stripeAccount?: string;
      };
    }
  > {
    const logPrefix = LoggingUtils.generateLogPrefix(this.List.name, requestId);
    const parametersForLogs = { params, options };
    try {
      this.#logger.debug(
        [
          `${logPrefix} Listing available subscriptions.`,
          `Parameters: ${JsonUtils.Stringify(parametersForLogs)}.`,
        ].join(' ')
      );
      const result = await this.stripeClient.subscriptions.list(
        params,
        options
      );
      this.#logger.debug(
        [
          `${logPrefix} Listed available subscriptions.`,
          `Parameters: ${JsonUtils.Stringify(parametersForLogs)}.`,
          `Output: ${JsonUtils.Stringify(result)}.`,
        ].join(' ')
      );
      return result;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Unable to list subscriptions in Stripe.`,
        `Unexpected error encountered.`,
        `Parameters: ${JsonUtils.Stringify(parametersForLogs)}.`,
        `Error details: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }
  public async GetById(
    requestId: string,
    subscriptionId: string,
    params?: Stripe.SubscriptionRetrieveParams,
    options?: Stripe.RequestOptions
  ) {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetById.name,
      requestId
    );
    const parametersForLogs = { params, options, subscriptionId };
    try {
      this.#logger.debug(
        [
          `${logPrefix} Getting subscription by id from Stripe.`,
          `Inputs: ${JsonUtils.Stringify(parametersForLogs)}.`,
        ].join(' ')
      );
      const response = await this.stripeClient.subscriptions.retrieve(
        subscriptionId,
        params,
        options
      );
      this.#logger.debug(
        [
          `${logPrefix} Acquired subscription data from stripe for id (${subscriptionId}).`,
          `Details: ${JsonUtils.Stringify(response)}.`,
        ].join(' ')
      );
      return response;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Unable to get subscriptions by id in Stripe.`,
        `Unexpected error encountered.`,
        `Parameters: ${JsonUtils.Stringify(parametersForLogs)}.`,
        `Error details: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }

  public async UpdateSubscription(
    requestId: string,
    subscriptionId: string,
    subscriptionItemId: string,
    priceId: string,
    prorationDate: number
  ) {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetById.name,
      requestId
    );
    const parametersForLogs = { subscriptionId, priceId };
    this.#logger.debug(
      `${logPrefix} Updating subscription by id from Stripe. Inputs: ${JsonUtils.Stringify(
        parametersForLogs
      )}.`
    );

    try {
      const updatedSubscription = await this.stripeClient.subscriptions.update(
        subscriptionId,
        {
          items: [
            {
              id: subscriptionItemId,
              price: priceId,
            },
          ],
          proration_date: prorationDate,
        }
      );
      this.#logger.debug(
        `${logPrefix} Updated subscription data from stripe for id (${subscriptionId}). Details: ${JsonUtils.Stringify(
          updatedSubscription
        )}.`
      );
      return updatedSubscription;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Unable to update subscriptions by id in Stripe.`,
        `Unexpected error encountered.`,
        `Parameters: ${JsonUtils.Stringify(parametersForLogs)}.`,
        `Error details: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }
}
