import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';

import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';

import { BaseStripeRepositoryService } from './base-stripe-repository.service';

export abstract class StripeInvoiceApiRepositoryServiceBase extends BaseStripeRepositoryService {
  public abstract GetUpcoming(
    requestId: string,
    customerId: string,
    subscriptionId: string,
    subscriptionItemId: string,
    priceId: string,
    prorationDate: number
  ): Promise<Stripe.UpcomingInvoice>;
}

@Injectable()
export class StripeInvoiceApiRepositoryService extends StripeInvoiceApiRepositoryServiceBase {
  readonly #logger: Logger = new Logger(StripeInvoiceApiRepositoryService.name);

  public async GetUpcoming(
    requestId: string,
    customerId: string,
    subscriptionId: string,
    subscriptionItemId: string,
    priceId: string,
    prorationDate: number
  ): Promise<Stripe.UpcomingInvoice> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetUpcoming.name,
      requestId
    );
    const parametersForLogs = { requestId };
    try {
      this.#logger.debug(
        `${logPrefix} Getting upcoming invoice from Stripe. Inputs: ${JsonUtils.Stringify(
          parametersForLogs
        )}.`
      );

      return await this.stripeClient.invoices.retrieveUpcoming({
        customer: customerId,
        subscription: subscriptionId,
        subscription_items: [
          {
            id: subscriptionItemId,
            price: priceId,
          },
        ],
        subscription_proration_date: prorationDate,
      });
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
}
