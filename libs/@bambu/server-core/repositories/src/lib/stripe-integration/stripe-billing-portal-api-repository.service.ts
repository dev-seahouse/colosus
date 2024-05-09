import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';

import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';

import { BaseStripeRepositoryService } from './base-stripe-repository.service';

export abstract class StripeBillingPortalApiRepositoryServiceBase extends BaseStripeRepositoryService {
  public abstract Create(
    requestId: string,
    params: Stripe.BillingPortal.SessionCreateParams,
    options?: Stripe.RequestOptions
  ): Promise<
    Stripe.BillingPortal.Session & {
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
export class StripeBillingPortalApiRepositoryService extends StripeBillingPortalApiRepositoryServiceBase {
  readonly #logger: Logger = new Logger(
    StripeBillingPortalApiRepositoryService.name
  );
  public async Create(
    requestId: string,
    params: Stripe.BillingPortal.SessionCreateParams,
    options?: Stripe.RequestOptions
  ): Promise<
    Stripe.BillingPortal.Session & {
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
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.Create.name,
      requestId
    );
    const parametersForLogs = { params, options };
    try {
      this.#logger.debug(
        [
          `${logPrefix} Generating Stripe portal session.`,
          `Parameters: ${JsonUtils.Stringify(parametersForLogs)}.`,
        ].join(' ')
      );
      const portalSession =
        await super.stripeClient.billingPortal.sessions.create(params, options);
      this.#logger.debug(
        [
          `${logPrefix} Generated Stripe portal session.`,
          `Parameters: ${JsonUtils.Stringify(parametersForLogs)}.`,
        ].join(' ')
      );
      return portalSession;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Unable to generate a Stripe billing portal session.`,
        `Unexpected error encountered.`,
        `Parameters: ${JsonUtils.Stringify(parametersForLogs)}.`,
        `Error details: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }
}
