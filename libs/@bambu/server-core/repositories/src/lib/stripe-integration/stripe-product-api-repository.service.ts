import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';

import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';

import { BaseStripeRepositoryService } from './base-stripe-repository.service';
import { SharedEnums } from '@bambu/shared';

export abstract class StripeProductApiRepositoryServiceBase extends BaseStripeRepositoryService {
  public abstract List(
    requestId: string,
    params?: Stripe.ProductListParams,
    options?: Stripe.RequestOptions
  ): Promise<
    Stripe.ApiList<Stripe.Product> & {
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
    productId: string,
    params?: Stripe.ProductRetrieveParams,
    options?: Stripe.RequestOptions
  ): Promise<
    Stripe.Product & {
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
export class StripeProductApiRepositoryService extends StripeProductApiRepositoryServiceBase {
  readonly #logger: Logger = new Logger(StripeProductApiRepositoryService.name);

  public async List(
    requestId: string,
    params?: Stripe.ProductListParams,
    options?: Stripe.RequestOptions
  ): Promise<
    Stripe.ApiList<Stripe.Product> & {
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
          `${logPrefix} Listing available products.`,
          `Parameters: ${JsonUtils.Stringify(parametersForLogs)}.`,
        ].join(' ')
      );
      const result = await this.stripeClient.products.list(params, options);
      this.#logger.debug(
        [
          `${logPrefix} Listed available products.`,
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

  public async GetById(
    requestId: string,
    productId: string,
    params?: Stripe.ProductRetrieveParams,
    options?: Stripe.RequestOptions
  ) {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetById.name,
      requestId
    );
    const parametersForLogs = { params, options, productId };
    try {
      this.#logger.debug(
        [
          `${logPrefix} Getting product by id from Stripe.`,
          `Inputs: ${JsonUtils.Stringify(parametersForLogs)}.`,
        ].join(' ')
      );
      const response = await this.stripeClient.products.retrieve(
        productId,
        params,
        options
      );
      this.#logger.debug(
        [
          `${logPrefix} Acquired product data from stripe for id (${productId}).`,
          `Details: ${JsonUtils.Stringify(response)}.`,
        ].join(' ')
      );
      return response;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).statusCode) {
        const invalidProductIdError = new ErrorUtils.ColossusError(
          'The product product id is invalid.',
          requestId,
          { parametersForLogs },
          404,
          SharedEnums.ErrorCodes.StripeIntegrationErrorCodesEnum.STRIPE_PRODUCT_ID_INVALID
        );
        this.#logger.error(
          `${logPrefix} ${JsonUtils.Stringify(invalidProductIdError)}`
        );
        throw invalidProductIdError;
      }
      throw error;
    }
  }
}
