// noinspection ES6PreferShortImport

import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';

import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';

import { StripePriceApiRepositoryServiceBase } from './stripe-price-api-repository-service.base';
import { SharedEnums } from '@bambu/shared';

@Injectable()
export class StripePriceApiRepositoryService extends StripePriceApiRepositoryServiceBase {
  readonly #logger: Logger = new Logger(StripePriceApiRepositoryService.name);

  public async List(
    requestId: string,
    params?: Stripe.PriceListParams,
    options?: Stripe.RequestOptions
  ): Promise<
    Stripe.ApiList<Stripe.Price> & {
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
    const parametersForLogs = {
      params,
      options,
    };

    try {
      this.#logger.debug(
        [
          `${logPrefix} Listing available prices.`,
          `Parameters: ${JsonUtils.Stringify(parametersForLogs)}.`,
        ].join(' ')
      );

      const client = this.stripeClient;

      let result: Stripe.ApiList<Stripe.Price> & {
        lastResponse: {
          headers: { [p: string]: string };
          requestId: string;
          statusCode: number;
          apiVersion?: string;
          idempotencyKey?: string;
          stripeAccount?: string;
        };
      };

      if (!params && !options) {
        result = await client.prices.list();
      } else if (params && !options) {
        result = await client.prices.list(params);
      } else if (!params && options) {
        result = await client.prices.list(options);
      } else if (params && options) {
        result = await client.prices.list(params, options);
      } else {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error('Failed to list prices from stripe API');
      }

      this.#logger.debug(
        [
          `${logPrefix} Listed available prices.`,
          `Parameters: ${JsonUtils.Stringify(parametersForLogs)}.`,
          `Output: ${JsonUtils.Stringify(result)}.`,
        ].join(' ')
      );

      return result;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Unable to list prices in Stripe.`,
        `Unexpected error encountered.`,
        `Parameters: ${JsonUtils.Stringify(parametersForLogs)}.`,
        `Error details: ${JsonUtils.Stringify(error)}`,
      ].join(' ');

      this.#logger.error(errorMessage);

      throw error;
    }
  }

  public async Search(
    requestId: string,
    params: Stripe.PriceSearchParams,
    options?: Stripe.RequestOptions
  ): Promise<
    Stripe.ApiSearchResult<Stripe.Price> & {
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
      this.Search.name,
      requestId
    );
    const parametersForLogs = {
      params,
      options,
    };

    try {
      this.#logger.debug(
        [
          `${logPrefix} Searching prices in Stripe.`,
          `Parameters: ${JsonUtils.Stringify(parametersForLogs)}.`,
        ].join(' ')
      );

      const client = this.stripeClient;
      const result = await client.prices.search(params, options);

      this.#logger.debug(
        [
          `${logPrefix} Searching prices in Stripe complete.`,
          `Result: ${JsonUtils.Stringify(result)}.`,
        ].join(' ')
      );

      return result;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Unable to search for prices in Stripe.`,
        `Unexpected error encountered.`,
        `Parameters: ${JsonUtils.Stringify(parametersForLogs)}.`,
        `Error details: ${JsonUtils.Stringify(error)}`,
      ].join(' ');

      this.#logger.error(errorMessage);

      throw error;
    }
  }

  public async GetById(
    id: string,
    requestId: string,
    params?: Stripe.PriceRetrieveParams,
    options?: Stripe.RequestOptions
  ): Promise<
    Stripe.Price & {
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
      this.GetById.name,
      requestId
    );
    const parametersForLogs = {
      id,
      params,
      options,
    };

    this.#logger.debug(
      [
        `${logPrefix} Getting price by id from Stripe.`,
        `Inputs: ${JsonUtils.Stringify(parametersForLogs)}.`,
      ].join(' ')
    );

    try {
      const response = await this.stripeClient.prices.retrieve(
        id,
        params,
        options
      );

      this.#logger.debug(
        [
          `${logPrefix} Acquired price data from stripe for id (${id}).`,
          `Details: ${JsonUtils.Stringify(response)}.`,
        ].join(' ')
      );
      return response;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).statusCode === 404) {
        const invalidPriceIdError = new ErrorUtils.ColossusError(
          'The product price id is invalid.',
          requestId,
          { parametersForLogs },
          404,
          SharedEnums.ErrorCodes.StripeIntegrationErrorCodesEnum.STRIPE_PRICE_ID_INVALID
        );
        this.#logger.error(
          `${logPrefix} ${JsonUtils.Stringify(invalidPriceIdError)}`
        );

        throw invalidPriceIdError;
      }

      const errorMessage = [
        `${logPrefix} Unable price by id(${id}) from Stripe.`,
        `Unexpected error encountered.`,
        `Parameters: ${JsonUtils.Stringify(parametersForLogs)}.`,
        `Error details: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }
}
