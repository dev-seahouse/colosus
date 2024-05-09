// noinspection ES6PreferShortImport

import { Logger } from '@nestjs/common';
import Stripe from 'stripe';

import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';

import { StripeCheckoutApiRepositoryServiceBase } from './stripe-checkout-api-repository-service.base';

export class StripeCheckoutApiRepositoryService extends StripeCheckoutApiRepositoryServiceBase {
  readonly #logger = new Logger(StripeCheckoutApiRepositoryService.name);

  public async CreateSession(
    requestId: string,
    params: Stripe.Checkout.SessionCreateParams,
    options?: Stripe.RequestOptions
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.CreateSession.name,
      requestId
    );
    const inputParameters = {
      params,
      options,
    };

    try {
      this.#logger.debug(
        [
          `${logPrefix} Creating checkout session.`,
          `Input parameters: ${JsonUtils.Stringify(inputParameters)}.`,
        ].join(' ')
      );
      const session = this.stripeClient.checkout.sessions.create(
        params,
        options
      );
      this.#logger.debug(
        `${logPrefix} Session created. Output: ${JsonUtils.Stringify(session)}.`
      );
      return session;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered when generating session.`,
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
