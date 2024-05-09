/// <reference types="stripe-event-types" />
// noinspection ES6PreferShortImport

import {
  PrismaModel,
  SubscriptionProviderEnum,
  SubscriptionStatusEnum,
} from '@bambu/server-core/db/central-db';
import { IWebhookPayload } from '@bambu/server-core/dto';
import {
  BambuApiLibraryAccessRepositoryServiceBase,
  CacheManagerRepositoryServiceBase,
  StripeBillingPortalApiRepositoryServiceBase,
  StripeCheckoutApiRepositoryServiceBase,
  StripeCustomerApiRepositoryServiceBase,
  StripeInvoiceApiRepositoryServiceBase,
  StripePriceApiRepositoryServiceBase,
  StripeProductApiRepositoryServiceBase,
  StripeSubscriptionApiRepositoryServiceBase,
  TenantApiKeyCentralDbRepository,
  TenantCentralDbRepositoryService,
  TenantSubscriptionsCentralDbRepositoryService,
  UserCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import {
  BambuEventEmitterService,
  ErrorUtils,
  HUBSPOT_EVENTS,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { SharedEnums } from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import * as crypto from 'crypto';
import * as ejs from 'ejs';
import * as _ from 'lodash';
import * as Luxon from 'luxon';
import Stripe from 'stripe';

import {
  ICheckoutSubscriptionSessionDomainRequestDto,
  ICheckoutSubscriptionSessionRequestLineItemsDto,
  ICheckSubscriptionEligibilityRequestDto,
  IGetSubscriptionUpgradeDetailsResponseDto,
  IListProductsDomainRequestDto,
  IRequestAdvisorSubscriptionListRequestDto,
  IRequestAdvisorSubscriptionListResponseDto,
  IStripeGenerateBillingPortalSessionDomainRequestDto,
  IStripeListPricesRequestDto,
  IStripeSearchPricesRequestDto,
  IStripeWebhookHandlerValidationResultDto,
  StripeIntegrationDomainServiceBase,
} from './stripe-integration-domain-service.base';

export enum ColossusStripeEventNameEnum {
  CHECKOUT_SESSION_COMPLETED = 'webhook.stripe.checkout.session.completed',
  INVOICE_PAYMENT_FAILED = 'webhook.stripe.invoice.payment_failed',
  SUBSCRIPTION_DELETED = 'webhook.stripe.customer.subscription.deleted',
  SUBSCRIPTION_RESUMED = 'webhook.stripe.customer.subscription.resumed',
  SUBSCRIPTION_UPDATED = 'webhook.stripe.customer.subscription.updated',
}

const PROVIDER_CUSTOMER_ID_PLACEHOLDER = 'PENDING';

@Injectable()
export class StripeIntegrationDomainService
  implements StripeIntegrationDomainServiceBase
{
  readonly #logger: Logger = new Logger(StripeIntegrationDomainService.name);

  constructor(
    private readonly stripePriceApi: StripePriceApiRepositoryServiceBase,
    private readonly stripeCheckoutApi: StripeCheckoutApiRepositoryServiceBase,
    private readonly stripeProductApi: StripeProductApiRepositoryServiceBase,
    private readonly stripeBillingPortalApi: StripeBillingPortalApiRepositoryServiceBase,
    private readonly stripeCustomerApi: StripeCustomerApiRepositoryServiceBase,
    private readonly stripeSubscriptionApi: StripeSubscriptionApiRepositoryServiceBase,
    private readonly stripeInvoiceApi: StripeInvoiceApiRepositoryServiceBase,
    private readonly bambuApiLibraryAccessApi: BambuApiLibraryAccessRepositoryServiceBase,
    private readonly tenantUsersDb: UserCentralDbRepositoryService,
    private readonly tenantSubscriptionDb: TenantSubscriptionsCentralDbRepositoryService,
    private readonly tenantApiKeyDb: TenantApiKeyCentralDbRepository,
    private readonly tenantCentralDb: TenantCentralDbRepositoryService,
    private readonly cacheManagerRepository: CacheManagerRepositoryServiceBase,
    private readonly eventEmitterService: BambuEventEmitterService
  ) {}

  public async ListPrices(input: IStripeListPricesRequestDto): Promise<
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
    const { requestId } = input;
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.ListPrices.name,
      requestId
    );

    this.#logger.debug(
      [
        `${logPrefix} Request to list prices in Stripe received.`,
        `Input: ${JsonUtils.Stringify(input)}.`,
      ].join(' ')
    );

    const apiPayload = _.cloneDeep<IStripeListPricesRequestDto>(input);
    delete apiPayload.requestId;

    if (!apiPayload.expand) {
      this.#logger.log(
        `${logPrefix} No expansion parameter specified. Adding default expansion parameter.`
      );
      apiPayload.expand = ['data.product'];
    }

    const apiResponse = await this.stripePriceApi.List(requestId, {
      ...apiPayload,
    });

    this.#logger.debug(
      [
        `${logPrefix} Request to list prices in Stripe completed.`,
        `Output: ${JsonUtils.Stringify(apiResponse)}.`,
      ].join(' ')
    );

    // Sorting of items with inactive product coming first.
    const clonedApiResponse: Stripe.ApiList<Stripe.Price> & {
      lastResponse: {
        headers: { [p: string]: string };
        requestId: string;
        statusCode: number;
        apiVersion?: string;
        idempotencyKey?: string;
        stripeAccount?: string;
      };
    } = _.cloneDeep(apiResponse);

    const sortedPrices: Stripe.Price[] = [];
    sortedPrices.push(
      ...apiResponse.data.filter(
        (price: Stripe.Price): boolean =>
          (price.product as Stripe.Product).active === true
      )
    );
    sortedPrices.push(
      ...apiResponse.data.filter(
        (price: Stripe.Price): boolean =>
          (price.product as Stripe.Product).active === false
      )
    );

    clonedApiResponse.data = sortedPrices;

    return clonedApiResponse;
  }

  public async SearchPrices(input: IStripeSearchPricesRequestDto): Promise<
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
    const { requestId, page, query, limit } = input;
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.SearchPrices.name,
      requestId
    );

    this.#logger.debug(
      [
        `${logPrefix} Received request to search for prices.`,
        `Input: ${JsonUtils.Stringify(input)}.`,
        `Processing.`,
      ].join(' ')
    );
    const result = await this.stripePriceApi.Search(requestId, {
      page,
      query,
      limit,
    });

    this.#logger.debug(
      [
        `${logPrefix} Processed request to search for prices.`,
        `Input: ${JsonUtils.Stringify(input)}.`,
      ].join(' ')
    );
    return result;
  }

  public async GenerateCheckoutSession(
    input: ICheckoutSubscriptionSessionDomainRequestDto
  ): Promise<
    Stripe.Checkout.Session & {
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
    const {
      originUrl,
      requestId,
      userId,
      email,
      billingAddressCollection,
      lineItems,
      realmId,
      realm,
      allowPromotionCodes = false,
    } = input;

    let { priceId } = lineItems[0];
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GenerateCheckoutSession.name,
      requestId
    );
    const serializedInput = JsonUtils.Stringify(input);

    try {
      this.#logger.debug(
        `${logPrefix} Begin request of checkout session. Input: ${serializedInput}.`
      );

      const tenantId: string = await this.#getTenantIdForUserId(
        requestId,
        userId
      );

      const [{ cancelUrl, successUrl }, existingSubscriptions, stripePrice] =
        await Promise.all([
          this.#generateRedirectUrls(originUrl, requestId),
          this.#getExistingSubscriptions(
            tenantId,
            SubscriptionProviderEnum.STRIPE,
            requestId
          ),
          this.#getStripePriceById(
            input.lineItems,
            userId,
            tenantId,
            requestId
          ),
        ]);

      let bambuGoProductId = null;
      if (
        stripePrice?.metadata?.bambuGoProductId &&
        Object.values(SharedEnums.BambuGoProductIdEnum).includes(
          stripePrice?.metadata
            ?.bambuGoProductId as SharedEnums.BambuGoProductIdEnum
        )
      ) {
        bambuGoProductId = stripePrice?.metadata?.bambuGoProductId;
      }

      if (bambuGoProductId === null) {
        const stripePriceMetadataError = new ErrorUtils.ColossusError(
          'bambuGoProductId does not exist in stripe price metadata.',
          requestId,
          { ...stripePrice },
          400,
          SharedEnums.ErrorCodes.StripeIntegrationErrorCodesEnum.STRIPE_PRICE_METADATA_INVALID
        );

        this.#logger.error(
          `${logPrefix} ${JSON.stringify(stripePriceMetadataError)}`
        );

        throw stripePriceMetadataError;
      }

      // Create connect subscription if transact is selected
      let isInterestedInTransact = false;
      if (bambuGoProductId === SharedEnums.BambuGoProductIdEnum.TRANSACT) {
        isInterestedInTransact = true;
        const connectStripePrices = await this.stripePriceApi.Search(
          requestId,
          {
            query: `metadata['bambuGoProductId']:'${SharedEnums.BambuGoProductIdEnum.CONNECT}'`,
            limit: 1,
          }
        );

        if (connectStripePrices.data.length < 1) {
          const stripePriceConnectNotFoundError = new ErrorUtils.ColossusError(
            'Stripe price with connect type does not exist.',
            requestId,
            { ...connectStripePrices },
            404,
            SharedEnums.ErrorCodes.StripeIntegrationErrorCodesEnum.STRIPE_PRICE_TYPE_CONNECT_NOT_FOUND
          );

          this.#logger.error(
            `${logPrefix} ${JSON.stringify(stripePriceConnectNotFoundError)}`
          );

          throw stripePriceConnectNotFoundError;
        }

        bambuGoProductId = SharedEnums.BambuGoProductIdEnum.CONNECT;
        for (let i = 0; i < lineItems.length; i++) {
          lineItems[i].priceId = connectStripePrices.data[0].id;
        }

        priceId = connectStripePrices.data[0].id;
      }

      const isEligibleComputation =
        await this.#checkIfAdvisorIsEligibleToSubscribe(
          tenantId,
          SubscriptionProviderEnum.STRIPE,
          priceId,
          existingSubscriptions,
          requestId
        );

      if (!isEligibleComputation.isEligible) {
        const existingSubscriptionError = new ErrorUtils.ColossusError(
          'User already has subscription to the product.',
          requestId,
          { ...isEligibleComputation },
          400,
          SharedEnums.ErrorCodes.StripeIntegrationErrorCodesEnum.STRIPE_SUBSCRIPTION_EXISTS
        );

        this.#logger.error(
          `${logPrefix} ${JSON.stringify(existingSubscriptionError)}`
        );

        // noinspection ExceptionCaughtLocallyJS
        throw existingSubscriptionError;
      }

      await this.#flushHtmlCacheOfInvestorPortal(requestId, tenantId);

      const subscriptionProviderCustomerId =
        !isEligibleComputation.providerCustomerId
          ? PROVIDER_CUSTOMER_ID_PLACEHOLDER
          : isEligibleComputation.providerCustomerId;

      await this.tenantSubscriptionDb.UpsertRow(
        {
          id: `${tenantId}-${bambuGoProductId}`,
          tenantId,
          subscriptionProviderName: SubscriptionProviderEnum.STRIPE,
          subscriptionProviderCustomerId,
          status: SubscriptionStatusEnum.PENDING,
          subscriptionProviderProductId: priceId,
          bambuGoProductId,
          isInterestedInTransact,
        },
        requestId
      );

      const sessionCreationPayload: Stripe.Checkout.SessionCreateParams = {
        billing_address_collection: billingAddressCollection,
        line_items: lineItems.map((x) => ({
          price: x.priceId,
          quantity: x.quantity,
        })),
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: email,
        allow_promotion_codes: allowPromotionCodes,
        metadata: {
          userId,
          email,
          realmId,
          realm,
          tenantId,
          priceId,
          bambuGoProductId,
          requestId,
          isInterestedInTransact: +isInterestedInTransact, // See: https://stackoverflow.com/questions/7820683/convert-boolean-result-into-number-integer
        },
      };

      if (
        subscriptionProviderCustomerId &&
        subscriptionProviderCustomerId !== PROVIDER_CUSTOMER_ID_PLACEHOLDER
      ) {
        sessionCreationPayload.customer = subscriptionProviderCustomerId;
        delete sessionCreationPayload.customer_email;
      }

      const result = await this.stripeCheckoutApi.CreateSession(
        requestId,
        sessionCreationPayload
      );

      this.#logger.debug(
        `${logPrefix} Session created. Session: ${JsonUtils.Stringify(result)}.`
      );
      return result;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Failed to create checkout session.`,
        `Error details: ${JsonUtils.Stringify(error)}.`,
        `Input: ${serializedInput}.`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }

  async #getStripePriceById(
    lineItems: ICheckoutSubscriptionSessionRequestLineItemsDto[],
    userId: string,
    tenantId: string,
    requestId: string
  ): Promise<Stripe.Price> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#getStripePriceById.name,
      requestId
    );
    const loggingInputs = { lineItems, userId, tenantId };

    if (!lineItems || !Array.isArray(lineItems)) {
      const error = new ErrorUtils.ColossusError(
        `The line items submitted was not a valid array`,
        requestId,
        { input: loggingInputs },
        400
      );
      this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(error)}`);

      throw error;
    }

    if (lineItems.length < 1) {
      const error = new ErrorUtils.ColossusError(
        'The line items submitted was empty',
        requestId,
        { input: loggingInputs },
        400
      );
      this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(error)}`);

      throw error;
    }

    if (lineItems.length > 1) {
      const error = new ErrorUtils.ColossusError(
        'More than 1 line item was submitted. This is not permitted.',
        requestId,
        { input: loggingInputs },
        400
      );
      this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(error)}`);

      throw error;
    }

    try {
      return await this.stripePriceApi.GetById(lineItems[0].priceId, requestId);
    } catch (error) {
      if (
        error instanceof ErrorUtils.ColossusError &&
        error.colossusErrorCode ===
          SharedEnums.ErrorCodes.StripeIntegrationErrorCodesEnum
            .STRIPE_PRICE_ID_INVALID
      ) {
        const error = new ErrorUtils.ColossusError(
          'The product price line item is invalid.',
          requestId,
          { input: loggingInputs },
          400,
          SharedEnums.ErrorCodes.StripeIntegrationErrorCodesEnum.STRIPE_PRICE_LINE_ITEM_INVALID
        );
        this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(error)}`);

        throw error;
      }

      throw error;
    }
  }

  async #generateRedirectUrls(origin: string, requestId: string) {
    /**
     * This will probably come from the DB later.
     * This is just to give a brief item on how I think this works.
     */
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#generateRedirectUrls.name,
      requestId
    );

    this.#logger.debug(
      `${logPrefix} Deriving URLs from ${JSON.stringify({ origin })}.`
    );
    const successUrl = await ejs.render(
      '<%=origin%>/dashboard/home?successful_payment=true&session_id={CHECKOUT_SESSION_ID}',
      {
        origin,
      },
      {
        async: true,
      }
    );
    this.#logger.debug(
      `${logPrefix} Successfully derived success url. Value: ${successUrl}.`
    );

    const cancelUrl = await ejs.render(
      '<%=origin%>/select-subscription',
      {
        origin,
      },
      {
        async: true,
      }
    );
    this.#logger.debug(
      `${logPrefix} Successfully derived cancel url. Value: ${cancelUrl}.`
    );

    return {
      successUrl,
      cancelUrl,
    };
  }

  async #getTenantIdForUserId(
    requestId: string,
    userId: string
  ): Promise<string> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#getTenantIdForUserId.name,
      requestId
    );

    this.#logger.debug(
      `${logPrefix} Getting tenant id for user id (${userId}).`
    );

    try {
      const dbResult = (await this.tenantUsersDb.findFirst({
        where: {
          id: userId,
        },
      })) as PrismaModel.User;

      if (!dbResult.tenantId) {
        const noTenantError = new ErrorUtils.ColossusError(
          'Tenant not found for user.',
          requestId,
          {
            userId,
          },
          404
        );

        this.#logger.error(
          `${logPrefix} ${JsonUtils.Stringify(noTenantError)}`
        );
        // noinspection ExceptionCaughtLocallyJS
        throw noTenantError;
      }

      return dbResult.tenantId;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Failed to acquire tenant id for user id (${userId}).`,
        `Unhandled error occurred`,
        `Error details: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }

  async #getExistingSubscriptions(
    tenantId: string,
    subscriptionProviderName: SubscriptionProviderEnum,
    requestId: string
  ): Promise<PrismaModel.TenantSubscription[] | []> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#getExistingSubscriptions.name,
      requestId
    );
    const inputsForLogging = { tenantId, subscriptionProviderName, requestId };

    this.#logger.debug(
      `${logPrefix} Retrieving existing subscriptions. Input: ${JsonUtils.Stringify(
        inputsForLogging
      )}.`
    );

    try {
      const dbResult = await this.tenantSubscriptionDb.findMany({
        where: {
          tenantId,
          subscriptionProviderName: subscriptionProviderName,
        },
      });

      this.#logger.debug(
        [
          `${logPrefix} Retrieved existing subscriptions for tenant id ${tenantId}.`,
          `Output: ${JsonUtils.Stringify(dbResult)}.`,
        ].join(' ')
      );

      return dbResult as PrismaModel.TenantSubscription[] | [];
    } catch (error) {
      const errorMessage =
        'Unable to retrieve existing subscriptions from the database.';
      const errorObject = new ErrorUtils.ColossusError(
        errorMessage,
        requestId,
        inputsForLogging
      );

      this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(errorObject)}`);

      throw error;
    }
  }

  async #checkIfAdvisorIsEligibleToSubscribe(
    targetTenantId: string,
    targetSubscriptionProviderName: SubscriptionProviderEnum,
    targetProductId: string,
    subscriptionsInDb: PrismaModel.TenantSubscription[],
    requestId: string
  ): Promise<{
    isEligible: boolean;
    providerCustomerId: string;
    providerProductId: string;
    providerName: SubscriptionProviderEnum;
  }> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#checkIfAdvisorIsEligibleToSubscribe.name,
      requestId
    );
    const inputsForLogging = {
      targetTenantId,
      targetSubscriptionProviderName,
      targetProductId,
      subscriptions: subscriptionsInDb,
    };

    this.#logger.debug(
      [
        `${logPrefix} Checking if existing subscription is in place.`,
        `Inputs: ${JsonUtils.Stringify(inputsForLogging)}.`,
      ].join(' ')
    );

    try {
      const existingSubscriptionInDb = subscriptionsInDb.find(
        (x) =>
          x.tenantId === targetTenantId &&
          x.subscriptionProviderProductId === targetProductId &&
          x.subscriptionProviderName === targetSubscriptionProviderName
      );

      const providerCustomerId: string | null | undefined =
        existingSubscriptionInDb?.subscriptionProviderCustomerId;

      const returnPayload = {
        isEligible: false,
        providerCustomerId,
        providerProductId: targetProductId,
        providerName: targetSubscriptionProviderName,
      };

      if (
        !existingSubscriptionInDb ||
        existingSubscriptionInDb?.status === SubscriptionStatusEnum.INACTIVE ||
        existingSubscriptionInDb?.status === SubscriptionStatusEnum.PENDING ||
        (existingSubscriptionInDb?.status === SubscriptionStatusEnum.ACTIVE &&
          existingSubscriptionInDb?.bambuGoProductId ===
            SharedEnums.BambuGoProductIdEnum.CONNECT)
      ) {
        returnPayload.isEligible = true;
      }

      if (
        !providerCustomerId ||
        providerCustomerId === PROVIDER_CUSTOMER_ID_PLACEHOLDER
      ) {
        return returnPayload;
      }

      this.#logger.log(
        [
          `${logPrefix} Stripe customer id (${providerCustomerId}) is found for tenant id (${targetTenantId}).`,
          `Checking data in Stripe.`,
        ].join(' ')
      );

      const existingCustomer = await this.#getStripeCustomerByStripeId(
        requestId,
        providerCustomerId
      );

      const { subscriptions: stripeSubscriptions } =
        existingCustomer as Stripe.Customer;

      const numberOfSubscriptions = stripeSubscriptions.data.length;

      for (let i = 0; i < numberOfSubscriptions; i += 1) {
        const subscription = stripeSubscriptions.data[i];
        const {
          items: { data: stripeSubscriptionLineItems },
        } = subscription;

        const stripeSubscriptionItem = stripeSubscriptionLineItems.find(
          (x) => x.price.id === targetProductId
        );

        if (
          stripeSubscriptionItem !== undefined &&
          stripeSubscriptionItem !== null
        ) {
          this.#logger.log(
            [
              `${logPrefix} An active subscription is found in Stripe.`,
              `The price product ${targetProductId} is already bound to user.`,
            ].join(' ')
          );

          returnPayload.isEligible = false;
          return returnPayload;
        }
      }

      return returnPayload;
    } catch (error) {
      if (error instanceof ErrorUtils.ColossusError) {
        this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(error)}`);
        throw error;
      }

      const errorMessage = `Unexpected error occurred when checking for existing subscriptions.`;

      const colossusError = new ErrorUtils.ColossusError(
        errorMessage,
        requestId,
        {
          input: inputsForLogging,
        }
      );

      this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(colossusError)}`);

      throw error;
    }
  }

  public async ListProducts(input: IListProductsDomainRequestDto): Promise<
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
    const { requestId, parameters } = input;
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.ListProducts.name,
      requestId
    );
    const serializedParameters = JsonUtils.Stringify(parameters);

    try {
      this.#logger.debug(
        `${logPrefix} Original request payload: ${serializedParameters}.`
      );

      if (!parameters.expand) {
        this.#logger.log(
          `${logPrefix} No expansion parameter specified. Adding default expansion parameter.`
        );
        parameters.expand = ['data.default_price'];
      }

      const result = await this.stripeProductApi.List(requestId, parameters);

      this.#logger.debug(
        `${logPrefix} Product list retrieved. Values: ${JsonUtils.Stringify(
          result
        )}.`
      );

      return result;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Failed to list products.`,
        `Error details: ${JsonUtils.Stringify(error)}.`,
        `Input: ${serializedParameters}.`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }

  public async GenerateBillingPortalSession(
    input: IStripeGenerateBillingPortalSessionDomainRequestDto
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
    const { requestId, userId, returnUrl, origin } = input;

    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GenerateBillingPortalSession.name,
      requestId
    );
    const parametersForLogging = { userId, returnUrl };

    this.#logger.debug(
      [
        `${logPrefix} Generating billing portal session.`,
        `Input: ${JsonUtils.Stringify(parametersForLogging)}.`,
      ].join(' ')
    );
    try {
      const tenantId: string = await this.#getTenantIdForUserId(
        requestId,
        userId
      );

      const [portalReturnUrl, subscriptionDetails] = await Promise.all([
        this.#generateBillingPortalRedirectUrl(origin, requestId, returnUrl),
        this.#ensureTenantSubscriptionInPlace(tenantId, requestId),
      ]);
      return await this.stripeBillingPortalApi.Create(requestId, {
        customer: subscriptionDetails.subscriptionProviderCustomerId,
        return_url: portalReturnUrl,
      });
    } catch (error) {
      if (error instanceof ErrorUtils.ColossusError) {
        throw error;
      }
      const errorMessage = [
        `${logPrefix} Unable to generate billing portal session.`,
        `Error details: ${JsonUtils.Stringify(error)}.`,
        `Input: ${JsonUtils.Stringify(parametersForLogging)}.`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }

  async #generateBillingPortalRedirectUrl(
    origin: string,
    requestId: string,
    returnUrl?: string
  ) {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#generateBillingPortalRedirectUrl.name,
      requestId
    );
    const parametersForLogging = { returnUrl, origin };

    this.#logger.log(
      [
        `${logPrefix} Generating return URL for billing portal.`,
        `Input: ${JsonUtils.Stringify(parametersForLogging)}.`,
      ].join(' ')
    );

    if (returnUrl) {
      this.#logger.log(
        `${logPrefix} Return URL is specified (${returnUrl}). Aborting return URL generation.`
      );
      return returnUrl;
    }

    const url = await ejs.render(
      '<%=origin%>/',
      {
        origin,
      },
      {
        async: true,
      }
    );

    this.#logger.log(
      `${logPrefix} Billing portal return URL generated, ${url}.`
    );

    return url;
  }

  async #ensureTenantSubscriptionInPlace(
    tenantId: string,
    requestId: string
  ): Promise<PrismaModel.TenantSubscription> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#ensureTenantSubscriptionInPlace.name,
      requestId
    );

    this.#logger.log(
      `${logPrefix} Ensuring tenant id ${tenantId} has a subscription.`
    );

    let result: PrismaModel.TenantSubscription | null = null;

    try {
      result = (await this.tenantSubscriptionDb.findFirst({
        where: {
          tenantId,
        },
      })) as PrismaModel.TenantSubscription | null;
    } catch (error) {
      const ormLevelError = new ErrorUtils.ColossusError(
        'Unable to retrieve subscription due to unexpected DB retrieval error.',
        requestId,
        {
          error,
        }
      );

      this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(ormLevelError)}`);

      throw ormLevelError;
    }

    if (!result) {
      const missingDataError = new ErrorUtils.ColossusError(
        'Subscription not in place.',
        requestId,
        {
          tenantId,
        },
        422,
        SharedEnums.ErrorCodes.StripeIntegrationErrorCodesEnum.STRIPE_SUBSCRIPTION_NOT_IN_PLACE
      );

      this.#logger.error(
        `${logPrefix} ${JsonUtils.Stringify(missingDataError)}`
      );

      throw missingDataError;
    }

    return result as PrismaModel.TenantSubscription;
  }

  public async CheckIfUserIsEligibleForSubscription(
    input: ICheckSubscriptionEligibilityRequestDto
  ): Promise<boolean> {
    const { userId, requestId, priceId } = input;
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.CheckIfUserIsEligibleForSubscription.name,
      requestId
    );
    this.#logger.log(
      `${logPrefix} Checking if user (${userId}) is eligible to subscribe to ${priceId}`
    );
    this.#logger.log(
      `${logPrefix} Checking if user (${userId}) is eligible to subscribe to ${priceId}`
    );
    const tenantId: string = await this.#getTenantIdForUserId(
      requestId,
      userId
    );
    const [existingSubscriptions] = await Promise.all([
      this.#getExistingSubscriptions(
        tenantId,
        SubscriptionProviderEnum.STRIPE,
        requestId
      ),
      // The function below will throw error if product does not exist.
      this.stripePriceApi.GetById(priceId, requestId),
    ]);
    const eligibilityComputation =
      await this.#checkIfAdvisorIsEligibleToSubscribe(
        tenantId,
        SubscriptionProviderEnum.STRIPE,
        priceId,
        existingSubscriptions,
        requestId
      );
    return eligibilityComputation.isEligible;
  }

  public async GetSubscriptionsForTenantByUserId(
    input: IRequestAdvisorSubscriptionListRequestDto
  ): Promise<IRequestAdvisorSubscriptionListResponseDto> {
    const { userId, requestId } = input;
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetSubscriptionsForTenantByUserId.name,
      requestId
    );
    this.#logger.log(
      `${logPrefix} Acquiring subscriptions for tenant this user (${userId}) belongs to.`
    );
    const tenantId: string = await this.#getTenantIdForUserId(
      requestId,
      userId
    );

    return this.GetSubscriptionsForTenantByTenantId({
      tenantId,
      requestId,
    });
  }

  public async GetSubscriptionsForTenantByTenantId({
    requestId,
    tenantId,
  }: {
    requestId: string;
    tenantId: string;
  }): Promise<IRequestAdvisorSubscriptionListResponseDto> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetSubscriptionsForTenantByTenantId.name,
      requestId
    );

    const returnPayload: IRequestAdvisorSubscriptionListResponseDto = {
      subscriptions: [],
    };

    const customers = await this.GetStripeCustomersByTenantId({
      requestId,
      tenantId,
    });

    if (!customers || customers.length < 1) {
      return returnPayload;
    }

    for (let i = 0; i < customers.length; i += 1) {
      const customer = customers[i] as Stripe.Customer;
      const { subscriptions } = customer;
      if (!subscriptions) {
        continue;
      }
      const { data } = subscriptions;
      if (data.length < 1) {
        continue;
      }
      returnPayload.subscriptions.push(...data);
    }
    this.#logger.log(
      `${logPrefix} Retrieved subscriptions. Number of subscriptions: ${returnPayload.subscriptions.length}.`
    );
    this.#logger.debug(
      `${logPrefix} Details: ${JsonUtils.Stringify(returnPayload)}`
    );
    return returnPayload;
  }

  public async GetStripeCustomersByTenantId({
    requestId,
    tenantId,
  }: {
    requestId: string;
    tenantId: string;
  }): Promise<
    | null
    | Awaited<
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
      >[]
  > {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetSubscriptionsForTenantByTenantId.name,
      requestId
    );
    this.#logger.log(
      `${logPrefix} Extracting STRIPE users for existing STRIPE subscriptions for tenant ${tenantId}.`
    );
    const existingSubscriptions: PrismaModel.TenantSubscription[] | [] =
      await this.#getExistingSubscriptions(
        tenantId,
        SubscriptionProviderEnum.STRIPE,
        requestId
      );
    if (!existingSubscriptions) {
      this.#logger.log(
        `${logPrefix} No existing STRIPE subscriptions found for tenant ${tenantId}.`
      );
      return null;
    }
    const stripeCustomerIds: string[] = existingSubscriptions.map(
      (x) => x.subscriptionProviderCustomerId as string
    );

    const stripeCustomerIdsSansPlaceholder: string[] = stripeCustomerIds.filter(
      (x) => x !== PROVIDER_CUSTOMER_ID_PLACEHOLDER
    );

    if (stripeCustomerIdsSansPlaceholder.length < 1) {
      return null;
    }

    const customers = await Promise.all(
      stripeCustomerIdsSansPlaceholder.map((stripeCustomerId) => {
        return this.#getStripeCustomerByStripeId(requestId, stripeCustomerId);
      })
    );
    this.#logger.log(
      `${logPrefix} Extracted STRIPE users for existing STRIPE subscriptions for tenant ${tenantId}.`
    );
    this.#logger.debug(
      `${logPrefix} Existing STRIPE subscriptions users: ${JsonUtils.Stringify(
        customers
      )}.`
    );
    return customers;
  }

  async #getStripeCustomerByStripeId(
    requestId: string,
    providerCustomerId: string,
    expand = ['subscriptions']
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
      this.#getStripeCustomerByStripeId.name,
      requestId
    );
    const inputForLogging = {
      providerCustomerId,
      expand,
    };

    this.#logger.log(
      `${logPrefix} Acquiring data for Stripe customer id ${providerCustomerId}.`
    );
    this.#logger.debug(
      `${logPrefix} Parameters: ${JsonUtils.Stringify(inputForLogging)}`
    );

    const existingCustomer = await this.stripeCustomerApi.GetCustomerById(
      requestId,
      providerCustomerId,
      {
        expand,
      }
    );

    this.#logger.log(
      `${logPrefix} Acquired data for Stripe customer id ${providerCustomerId}.`
    );

    return existingCustomer;
  }

  public async GetPriceDataById(
    requestId: string,
    priceId: string
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
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.GetPriceDataById.name,
      requestId
    );
    this.#logger.log(
      `${logPrefix} Acquiring data from Stripe for price id (${priceId}).`
    );
    const price: Stripe.Price & {
      lastResponse: {
        headers: { [p: string]: string };
        requestId: string;
        statusCode: number;
        apiVersion?: string;
        idempotencyKey?: string;
        stripeAccount?: string;
      };
    } = await this.stripePriceApi.GetById(priceId, requestId, {
      expand: ['product'],
    });
    this.#logger.log(
      `${logPrefix} Acquired data from stripe for price id (${priceId}).`
    );
    this.#logger.debug(`${logPrefix} Output: ${JsonUtils.Stringify(price)}.`);
    return price;
  }

  public async GetUpgradeSubscriptionDetails({
    requestId,
    userId,
  }): Promise<IGetSubscriptionUpgradeDetailsResponseDto> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.GetUpgradeSubscriptionDetails.name,
      requestId
    );
    const loggingInputs = { requestId, userId };
    this.#logger.log(
      `${logPrefix} Acquiring upgrade subscription data from Stripe for user id (${userId}).`
    );
    try {
      const tenantId: string = await this.#getTenantIdForUserId(
        requestId,
        userId
      );
      const subscriptions = await this.#getExistingSubscriptions(
        tenantId,
        SubscriptionProviderEnum.STRIPE,
        requestId
      );

      if (subscriptions.length < 1) {
        const subscriptionNotFoundError = new ErrorUtils.ColossusError(
          'Tenant subscription(s) cannot be found.',
          requestId,
          { ...loggingInputs },
          404,
          SharedEnums.ErrorCodes.StripeIntegrationErrorCodesEnum.STRIPE_SUBSCRIPTIONS_NOT_FOUND
        );

        this.#logger.error(
          `${logPrefix} ${JSON.stringify(subscriptionNotFoundError)}`
        );

        throw subscriptionNotFoundError;
      }

      const currentSubscription: Stripe.Subscription =
        await this.stripeSubscriptionApi.GetById(
          requestId,
          subscriptions[0].providerSubscriptionId
        );

      const subscriptionItems = currentSubscription.items.data;
      const isPriceConnect = subscriptionItems.find((subscriptionItem) => {
        return (
          subscriptionItem.price.metadata.bambuGoProductId ===
          SharedEnums.BambuGoProductIdEnum.CONNECT
        );
      });

      if (!isPriceConnect) {
        const error = new ErrorUtils.ColossusError(
          `Current subscription is not Connect.`,
          requestId,
          { input: loggingInputs },
          400,
          SharedEnums.ErrorCodes.StripeIntegrationErrorCodesEnum.STRIPE_SUBSCRIPTION_NOT_CONNECT
        );
        this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(error)}`);

        throw error;
      }

      const transactStripePrices = await this.stripePriceApi.Search(requestId, {
        query: `metadata['bambuGoProductId']:'${SharedEnums.BambuGoProductIdEnum.TRANSACT}'`,
        limit: 1,
      });

      if (transactStripePrices.data.length < 1) {
        const stripePriceConnectNotFoundError = new ErrorUtils.ColossusError(
          'Stripe price with transact type does not exist.',
          requestId,
          { ...transactStripePrices },
          404,
          SharedEnums.ErrorCodes.StripeIntegrationErrorCodesEnum.STRIPE_PRICE_TYPE_TRANSACT_NOT_FOUND
        );

        this.#logger.error(
          `${logPrefix} ${JSON.stringify(stripePriceConnectNotFoundError)}`
        );

        throw stripePriceConnectNotFoundError;
      }

      const newPriceId = transactStripePrices.data[0].id;
      const stripeInvoice = await this.stripeInvoiceApi.GetUpcoming(
        requestId,
        subscriptions[0].subscriptionProviderCustomerId,
        subscriptions[0].providerSubscriptionId,
        subscriptionItems[0].id,
        newPriceId,
        Math.floor(Date.now() / 1000)
      );

      const cost =
        (transactStripePrices.data[0].unit_amount -
          (stripeInvoice.lines.data[0].plan.amount +
            stripeInvoice.lines.data[0].amount)) /
        100;

      return {
        cost,
        startDate: Luxon.DateTime.fromJSDate(
          new Date(stripeInvoice.period_end * 1000)
        ).toISO(),
      };
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered while getting subscription upgrade details. Error details: ${JsonUtils.Stringify(
          error
        )}. Input: ${JsonUtils.Stringify(loggingInputs)}`
      );

      throw error;
    }
  }

  public async UpdateSubscriptionById({
    requestId,
    userId,
  }: {
    requestId: string;
    userId: string;
  }): Promise<void> {
    const loggingInputs = { requestId, userId };
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.UpdateSubscriptionById.name,
      requestId
    );
    this.#logger.log(
      `${logPrefix} Upgrade subscription from connect to transact initiated for user id (${userId}).`
    );
    try {
      const tenantId: string = await this.#getTenantIdForUserId(
        requestId,
        userId
      );
      const subscriptions = await this.#getExistingSubscriptions(
        tenantId,
        SubscriptionProviderEnum.STRIPE,
        requestId
      );

      if (subscriptions.length < 1) {
        const subscriptionNotFoundError = new ErrorUtils.ColossusError(
          'Tenant subscription(s) cannot be found.',
          requestId,
          { ...loggingInputs },
          404,
          SharedEnums.ErrorCodes.StripeIntegrationErrorCodesEnum.STRIPE_SUBSCRIPTIONS_NOT_FOUND
        );

        this.#logger.error(
          `${logPrefix} ${JSON.stringify(subscriptionNotFoundError)}`
        );

        throw subscriptionNotFoundError;
      }

      const currentSubscription: Stripe.Subscription =
        await this.stripeSubscriptionApi.GetById(
          requestId,
          subscriptions[0].providerSubscriptionId
        );

      const subscriptionItems = currentSubscription.items.data;
      const isPriceConnect = subscriptionItems.find((subscriptionItem) => {
        return (
          subscriptionItem.price.metadata.bambuGoProductId ===
          SharedEnums.BambuGoProductIdEnum.CONNECT
        );
      });

      if (!isPriceConnect) {
        const error = new ErrorUtils.ColossusError(
          `Current subscription is not Connect.`,
          requestId,
          { input: loggingInputs },
          400,
          SharedEnums.ErrorCodes.StripeIntegrationErrorCodesEnum.STRIPE_SUBSCRIPTION_NOT_CONNECT
        );
        this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(error)}`);

        throw error;
      }

      const transactStripePrices = await this.stripePriceApi.Search(requestId, {
        query: `metadata['bambuGoProductId']:'${SharedEnums.BambuGoProductIdEnum.TRANSACT}'`,
        limit: 1,
      });

      if (transactStripePrices.data.length < 1) {
        const stripePriceConnectNotFoundError = new ErrorUtils.ColossusError(
          'Stripe price with transact type does not exist.',
          requestId,
          { ...transactStripePrices },
          404,
          SharedEnums.ErrorCodes.StripeIntegrationErrorCodesEnum.STRIPE_PRICE_TYPE_TRANSACT_NOT_FOUND
        );

        this.#logger.error(
          `${logPrefix} ${JSON.stringify(stripePriceConnectNotFoundError)}`
        );

        throw stripePriceConnectNotFoundError;
      }

      const newPriceId = transactStripePrices.data[0].id;

      const updatedSubscription =
        await this.stripeSubscriptionApi.UpdateSubscription(
          requestId,
          subscriptions[0].providerSubscriptionId,
          subscriptionItems[0].id,
          newPriceId,
          Math.floor(Date.now() / 1000)
        );

      const upsertPayload = { ...subscriptions[0] };
      upsertPayload.subscriptionProviderProductId = newPriceId;
      upsertPayload.bambuGoProductId =
        SharedEnums.BambuGoProductIdEnum.TRANSACT;
      upsertPayload.updatedAt = Luxon.DateTime.fromJSDate(new Date()).toISO();
      const updatedMetadata = upsertPayload.subscriptionMetadata;
      updatedMetadata.push(updatedSubscription);
      upsertPayload.subscriptionMetadata = updatedMetadata;

      await this.tenantSubscriptionDb.UpdateRow(upsertPayload, requestId);
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Failed to update subscription by id. Error details: ${JsonUtils.Stringify(
          error
        )}. Input: ${loggingInputs}.`
      );
      throw error;
    }
  }

  public async GetProductById(
    requestId: string,
    productId: string
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
  > {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.GetProductById.name,
      requestId
    );
    this.#logger.log(
      `${logPrefix} Acquiring data from Stripe for product id (${productId}).`
    );
    const product: Stripe.Product & {
      lastResponse: {
        headers: { [p: string]: string };
        requestId: string;
        statusCode: number;
        apiVersion?: string;
        idempotencyKey?: string;
        stripeAccount?: string;
      };
    } = await this.stripeProductApi.GetById(requestId, productId, {
      expand: ['default_price'],
    });
    this.#logger.log(
      `${logPrefix} Acquired data from stripe for product id (${productId}).`
    );
    this.#logger.debug(`${logPrefix} Output: ${JsonUtils.Stringify(product)}.`);
    return product;
  }

  async #flushHtmlCacheOfInvestorPortal(
    requestId: string,
    tenantId: string
  ): Promise<void> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.GetProductById.name,
      requestId
    );
    this.#logger.log(
      `${logPrefix} Flushing Investor Portal HTML cache via tenant id (${tenantId}).`
    );

    const tenant = await this.tenantCentralDb.FindTenantById(tenantId);

    if (!tenant) {
      const missingTenantError = ErrorUtils.getDefaultMissingTenantInDbError({
        requestId,
        metadata: {
          tenantId,
        },
      });

      this.#logger.error(
        `${logPrefix} ${JsonUtils.Stringify(missingTenantError)}`
      );

      throw missingTenantError;
    }

    const { httpUrls } = tenant;

    if (httpUrls.length < 1) {
      this.#logger.log(`${logPrefix} No urls found.`);
      return;
    }

    await Promise.all(
      httpUrls.map((x) => {
        const { url } = x;

        return this.cacheManagerRepository.DeleteInvestorProxyHtmlCache(
          requestId,
          url
        );
      })
    );
  }

  // Webhook Event Handlers - Start

  /**
   * Handles subscription successful/completed.
   *
   * Function does not use # to denote private due to the @OnEvent decorator
   * not liking that. Sad :(
   * @param eventEmitterPayload {Object} Object passed in from event emitter.
   * @private
   */
  @OnEvent(ColossusStripeEventNameEnum.CHECKOUT_SESSION_COMPLETED)
  private async handleCheckoutSessionCompleteEvent(
    eventEmitterPayload: IWebhookPayload<
      IStripeWebhookHandlerValidationResultDto,
      Stripe.DiscriminatedEvent
    >
  ): Promise<void> {
    const requestId = crypto.randomUUID();
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.handleCheckoutSessionCompleteEvent.name,
      requestId
    );

    this.#logger.log(
      `${logPrefix} Received ${ColossusStripeEventNameEnum.CHECKOUT_SESSION_COMPLETED} event. Processing.`
    );
    this.#logger.debug(
      `Event Payload: ${JsonUtils.Stringify(eventEmitterPayload)}.`
    );

    const event = eventEmitterPayload.body;
    const targetEventName = 'checkout.session.completed';

    if (event.type === targetEventName) {
      const {
        id,
        type,
        data: {
          object: {
            customer,
            metadata: {
              tenantId,
              bambuGoProductId,
              priceId,
              isInterestedInTransact,
            },
            subscription,
          },
        },
      } = event;

      this.#logger.log(
        `${logPrefix} Processing webhook event (${type}) id (${id}) for tenant ${tenantId}.`
      );

      const checkoutMetadata =
        _.cloneDeep<Stripe.DiscriminatedEvent.CheckoutSessionEvent>(event);

      // Stripping PII data.
      delete checkoutMetadata.data.object.customer_details.address;
      delete checkoutMetadata.data.object.customer_details.email;
      delete checkoutMetadata.data.object.customer_details.name;
      delete checkoutMetadata.data.object.customer_details.phone;
      delete checkoutMetadata.data.object.customer_email;
      if (checkoutMetadata.data.object.metadata.email) {
        delete checkoutMetadata.data.object.metadata.email;
      }
      const rowId = `${tenantId}-${bambuGoProductId}`;
      const existingRecord = (await this.tenantSubscriptionDb.findFirst({
        where: {
          id: rowId,
        },
      })) as PrismaModel.TenantSubscription | null;

      const subscriptionMetadata = [];

      if (existingRecord?.subscriptionMetadata) {
        subscriptionMetadata.push(
          ...(existingRecord.subscriptionMetadata as any[])
        );
      }
      subscriptionMetadata.push(checkoutMetadata);

      await this.tenantSubscriptionDb.deleteMany({
        where: {
          id: `${tenantId}-${SharedEnums.BambuGoProductIdEnum.CONNECT}`,
          status: { not: SubscriptionStatusEnum.ACTIVE },
          providerSubscriptionId: { equals: null },
        },
      });

      await this.tenantSubscriptionDb.deleteMany({
        where: {
          id: `${tenantId}-${SharedEnums.BambuGoProductIdEnum.TRANSACT}`,
          status: { not: SubscriptionStatusEnum.ACTIVE },
          providerSubscriptionId: { equals: null },
        },
      });

      const upsertPayload: PrismaModel.TenantSubscription = {
        id: rowId,
        tenantId,
        subscriptionProviderName: SubscriptionProviderEnum.STRIPE,
        subscriptionProviderCustomerId: customer as string,
        status: SubscriptionStatusEnum.ACTIVE,
        subscriptionProviderProductId: priceId,
        bambuGoProductId,
        updatedAt: Luxon.DateTime.fromJSDate(new Date()).toISO(),
        providerSubscriptionId: subscription as string,
        subscriptionMetadata,
        isInterestedInTransact: Boolean(
          Number.parseInt(isInterestedInTransact)
        ),
      };

      await this.tenantSubscriptionDb.UpsertRow(upsertPayload, requestId);

      this.#logger.log(
        `${logPrefix} Getting Bambu Api Library Key for tenant.`
      );
      const apiKey = await this.bambuApiLibraryAccessApi.ProvisionApiKey(
        requestId
      );
      this.#logger.log(`${logPrefix} Gotten Bambu Api Library Key for tenant.`);

      this.#logger.log(
        `${logPrefix} Persisting Bambu API Library key config for tenant.`
      );
      await this.tenantApiKeyDb.UpsertRow(requestId, {
        keyType: SharedEnums.ApiKeyTypeEnum.BAMBU_API_LIB,
        tenantId,
        keyConfig: apiKey,
      });
      this.#logger.log(
        `${logPrefix} Persisted Bambu API Library key config for tenant.`
      );

      await this.#flushHtmlCacheOfInvestorPortal(requestId, tenantId);

      this.#logger.log(
        `${logPrefix} Processed string webhook event (${type}) id (${id}).`
      );

      const subscriberEmail = event.data.object.customer_details.email;

      await this.eventEmitterService.emitAsync(
        HUBSPOT_EVENTS.MOVE_DEAL_TO_WON,
        subscriberEmail
      );
      return;
    }

    this.#handleInvalidWebhookEventPassing(
      logPrefix,
      requestId,
      targetEventName,
      event.type,
      eventEmitterPayload
    );
  }

  #handleInvalidWebhookEventPassing(
    logPrefix: string,
    requestId: string,
    expectedEventName: string,
    receivedEventName: string,
    eventEmitterPayload: unknown
  ): void {
    const invalidEvent = new ErrorUtils.ColossusError(
      `${logPrefix} Unexpected event received, was expecting ${expectedEventName} but got ${receivedEventName} instead`,
      requestId,
      {
        eventEmitterPayload,
      }
    );

    this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(invalidEvent)}`);

    throw invalidEvent;
  }

  @OnEvent(ColossusStripeEventNameEnum.INVOICE_PAYMENT_FAILED)
  private async handleInvoicePaymentFailedEvent(
    eventEmitterPayload: IWebhookPayload<
      IStripeWebhookHandlerValidationResultDto,
      Stripe.DiscriminatedEvent
    >
  ): Promise<void> {
    const requestId = crypto.randomUUID();
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.handleInvoicePaymentFailedEvent.name,
      requestId
    );

    this.#logger.log(
      `${logPrefix} Received ${ColossusStripeEventNameEnum.INVOICE_PAYMENT_FAILED} event. Processing.`
    );
    this.#logger.debug(
      `Event Payload: ${JsonUtils.Stringify(eventEmitterPayload)}.`
    );

    const event = eventEmitterPayload.validationResult
      .parsedEventPayload as Stripe.DiscriminatedEvent;

    const targetEventName = 'invoice.payment_failed';

    if (event.type !== targetEventName) {
      this.#handleInvalidWebhookEventPassing(
        logPrefix,
        requestId,
        targetEventName,
        event.type,
        eventEmitterPayload
      );
      return;
    }

    const {
      id,
      type,
      data: {
        object: {
          id: invoiceId,
          amount_due: amountDue,
          charge: chargeId,
          customer: stripeCustomerId,
          lines: lineItems,
          next_payment_attempt: nextPaymentAttempt,
        },
      },
    } = event;

    const tenantSubscriptions = (await this.tenantSubscriptionDb.findMany({
      where: {
        subscriptionProviderCustomerId: stripeCustomerId as string,
      },
    })) as PrismaModel.TenantSubscription[];

    const parametersForLogging = {
      id,
      type,
      invoiceId,
      amountDue,
      chargeId,
      lineItems,
      nextPaymentAttempt,
    };

    if (tenantSubscriptions.length < 1) {
      const noSubscriberError = new ErrorUtils.ColossusError(
        `Unable to find tenant that has the stripe customer id (${stripeCustomerId})`,
        requestId,
        parametersForLogging
      );

      this.#logger.error(
        `${logPrefix} ${JsonUtils.Stringify(noSubscriberError)}`
      );

      throw noSubscriberError;
    }

    const tenantIds = tenantSubscriptions.map((x) => x.tenantId);

    if (tenantIds.length > 1) {
      const multipleTenantErrorMessage = [
        `Multiple tenants seem to be bound by the same Stripe customer id (${stripeCustomerId}).`,
        `This is highly unusual and processing will be aborted to prevent data pollution.`,
        `Affected tenants are: [${tenantIds.join(',')}].`,
      ].join(' ');
      const multipleTenantError = new ErrorUtils.ColossusError(
        multipleTenantErrorMessage,
        requestId,
        parametersForLogging
      );

      this.#logger.error(
        `${logPrefix} ${JsonUtils.Stringify(multipleTenantError)}`
      );

      throw multipleTenantError;
    }

    const processingMessage = [
      `${logPrefix} Processing webhook event (${type}) id (${id}) for Stripe customer (${stripeCustomerId}).`,
      `This belongs to the following tenants: [${tenantIds.join(',')}].`,
    ].join(' ');
    this.#logger.log(processingMessage);

    this.#logger.debug(
      `${logPrefix} Processing inputs: ${JsonUtils.Stringify(
        parametersForLogging
      )}.`
    );

    const { tenantId } = tenantSubscriptions[0];

    this.#logger.log(
      [
        `${logPrefix} A tenant (${tenantId}) is having trouble paying the invoice.`,
        `This potentially can mean this tenant has a subscription discontinued.`,
        `The invoice number is (${invoiceId})`,
      ].join(' ')
    );

    await this.#flushHtmlCacheOfInvestorPortal(requestId, tenantId);

    await this.#triggerHubSpotEventWithEmailAddressViaTenantId({
      event: HUBSPOT_EVENTS.MOVE_DEAL_TO_LOST,
      tenantId,
      requestId,
    });
  }

  async #triggerHubSpotEventWithEmailAddressViaTenantId({
    event,
    requestId,
    tenantId,
  }: {
    event: HUBSPOT_EVENTS;
    requestId: string;
    tenantId: string;
  }) {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#triggerHubSpotEventWithEmailAddressViaTenantId.name,
      requestId
    );
    const loggingInput = {
      event,
      tenantId,
    };
    this.#logger.log(
      `${logPrefix} Triggering HubSpot event ${event} for tenant ${tenantId}.`
    );

    try {
      const stripeCustomers = await this.GetStripeCustomersByTenantId({
        requestId,
        tenantId,
      });

      if (
        stripeCustomers &&
        Array.isArray(stripeCustomers) &&
        stripeCustomers.length > 0
      ) {
        const numberOfStripeCustomers = stripeCustomers.length;

        /**
         * TODO:
         * We may need to deal with Stripe.Deleted Customer.
         * Deleted customers have no emails attached :(
         */
        for (let i = 0; i < numberOfStripeCustomers; i++) {
          const stripeCustomer = stripeCustomers[i] as Stripe.Customer;
          const stripeCustomerEmail = stripeCustomer.email;

          await this.eventEmitterService.emitAsync(event, stripeCustomerEmail);
        }
      }
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered while triggering HubSpot event.`,
        `Input: ${JsonUtils.Stringify(loggingInput)}.`,
        `Details: ${JsonUtils.Stringify(error)}.`,
      ].join('');
      this.#logger.error(errorMessage);

      throw error;
    }
  }

  @OnEvent(ColossusStripeEventNameEnum.SUBSCRIPTION_DELETED)
  private async handleSubscriptionDeleted(
    eventEmitterPayload: IWebhookPayload<
      IStripeWebhookHandlerValidationResultDto,
      Stripe.DiscriminatedEvent
    >
  ): Promise<void> {
    const requestId = crypto.randomUUID();
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.handleSubscriptionDeleted.name,
      requestId
    );

    this.#logger.log(
      `${logPrefix} Received ${ColossusStripeEventNameEnum.INVOICE_PAYMENT_FAILED} event. Processing.`
    );
    this.#logger.debug(
      `${logPrefix} Event Payload: ${JsonUtils.Stringify(eventEmitterPayload)}.`
    );

    const event = eventEmitterPayload.validationResult
      .parsedEventPayload as Stripe.DiscriminatedEvent;

    const targetEventName = 'customer.subscription.deleted';

    if (event.type !== targetEventName) {
      this.#handleInvalidWebhookEventPassing(
        logPrefix,
        requestId,
        targetEventName,
        event.type,
        eventEmitterPayload
      );
      return;
    }

    const {
      id: eventId,
      data: {
        object: {
          id: stripeSubscriptionId,
          status: stripeStatus,
          customer: stripeCustomerId,
        },
      },
    } = event;

    const subscriptionProviderCustomerId = stripeCustomerId as string;

    const existingSubscription =
      await this.#getExistingSubscriptionBySubscriptionIdAndStripeCustomerId(
        stripeSubscriptionId,
        subscriptionProviderCustomerId,
        requestId
      );

    this.#guardSubscriptionInDb(
      existingSubscription,
      event,
      subscriptionProviderCustomerId,
      stripeSubscriptionId,
      stripeStatus,
      eventId,
      logPrefix,
      requestId
    );

    const {
      tenantId,
      bambuGoProductId,
      id: dbRowId,
      subscriptionMetadata,
    } = existingSubscription;

    const subscriptionFoundMessage = [
      `${logPrefix} subscription id (${stripeSubscriptionId}) for stripe customer id (${subscriptionProviderCustomerId}).`,
      `It appears to belong to tenant id (${tenantId}) for the ${bambuGoProductId} product subscription.`,
    ].join(' ');
    this.#logger.log(subscriptionFoundMessage);
    this.#logger.debug(
      `${logPrefix} ${JsonUtils.Stringify({
        existingSubscription,
        event,
      })}.`
    );

    const subscriptionStatus = SubscriptionStatusEnum.INACTIVE;

    this.#logger.log(
      `${logPrefix} This subscription has ended. Moving status to ${subscriptionStatus}.`
    );

    const updatedMetadata = [];

    if (subscriptionMetadata) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updatedMetadata.push(...(subscriptionMetadata as any));
    }

    updatedMetadata.push(event);

    await this.#updateSubscriptionStatusForSubscriptionEvent(
      dbRowId,
      subscriptionStatus,
      updatedMetadata,
      logPrefix,
      requestId,
      existingSubscription,
      event
    );

    this.#logger.log(
      `Removing persisted Bambu API Library Key config for tenant.`
    );

    await this.tenantApiKeyDb.deleteMany({
      where: {
        tenantId,
        keyType: SharedEnums.ApiKeyTypeEnum.BAMBU_API_LIB,
      },
    });

    this.#logger.log(
      `Removed persisted Bambu API Library Key config for tenant.`
    );

    await this.#flushHtmlCacheOfInvestorPortal(requestId, tenantId);

    await this.#triggerHubSpotEventWithEmailAddressViaTenantId({
      event: HUBSPOT_EVENTS.MOVE_DEAL_TO_LOST,
      tenantId,
      requestId,
    });
  }

  async #getExistingSubscriptionBySubscriptionIdAndStripeCustomerId(
    providerSubscriptionId: string,
    subscriptionProviderCustomerId: string,
    requestId: string
  ): Promise<PrismaModel.TenantSubscription | null> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.#getExistingSubscriptionBySubscriptionIdAndStripeCustomerId.name,
      requestId
    );
    const parametersForLogging = {
      providerSubscriptionId,
      subscriptionProviderCustomerId,
    };
    this.#logger.debug(
      [
        `${logPrefix} Getting existing subscription from DB`,
        `Input: ${JsonUtils.Stringify(parametersForLogging)}.`,
      ].join(' ')
    );

    try {
      const existingSubscription = (await this.tenantSubscriptionDb.findFirst({
        where: {
          providerSubscriptionId,
          subscriptionProviderCustomerId,
        },
      })) as PrismaModel.TenantSubscription | null;

      this.#logger.debug(
        [
          `${logPrefix} Acquired existing subscription.`,
          `Output: ${JsonUtils.Stringify({ existingSubscription })}.`,
        ].join(' ')
      );

      return existingSubscription;
    } catch (error) {
      const dbRetrievalError: ErrorUtils.ColossusError =
        new ErrorUtils.ColossusError(
          `Unable to retrieve existing subscription due to DB error.`,
          requestId,
          {
            error,
            parametersForLogging,
          }
        );

      this.#logger.error(
        `${logPrefix} ${JsonUtils.Stringify(dbRetrievalError)}`
      );

      throw dbRetrievalError;
    }
  }

  #guardSubscriptionInDb(
    existingSubscription: PrismaModel.TenantSubscription | null,
    event: Stripe.Event,
    stripeCustomerId: string,
    stripeSubscriptionId: string,
    stripeStatus: string,
    eventId: string,
    logPrefix: string,
    requestId: string
  ): void {
    if (!existingSubscription) {
      const noSubscriptionFoundError = new ErrorUtils.ColossusError(
        [
          `The stripe subscription id (${stripeSubscriptionId}) for stripe customer id (${stripeCustomerId})  could not be found.`,
          `The Stripe subscription status is (${stripeStatus})`,
          `Event (${eventId}) cannot be processed.`,
        ].join(' '),
        requestId,
        {
          event,
        }
      );

      this.#logger.error(
        `${logPrefix} ${JsonUtils.Stringify(noSubscriptionFoundError)}`
      );

      throw noSubscriptionFoundError;
    }
  }

  async #updateSubscriptionStatusForSubscriptionEvent(
    dbRowId: string,
    subscriptionStatus: SubscriptionStatusEnum,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscriptionMetadata: any[],
    logPrefix: string,
    requestId: string,
    existingSubscription: PrismaModel.TenantSubscription,
    event: Stripe.Event
  ): Promise<void> {
    try {
      const updateResult = await this.tenantSubscriptionDb.update({
        where: {
          id: dbRowId,
        },
        data: {
          status: subscriptionStatus,
          subscriptionMetadata,
        },
      });

      const updatedMessage = [
        `${logPrefix} Tenant subscription updated.`,
        `Details: ${JsonUtils.Stringify(updateResult)}.`,
      ].join(' ');

      this.#logger.log(updatedMessage);
    } catch (error) {
      const dbUpdateError = new ErrorUtils.ColossusError(
        'Error encountered while updating tenant subscription.',
        requestId,
        {
          error,
          existingSubscription,
          event,
        }
      );

      this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(dbUpdateError)}`);

      throw dbUpdateError;
    }
  }

  @OnEvent(ColossusStripeEventNameEnum.SUBSCRIPTION_RESUMED)
  private async handleSubscriptionResumed(
    eventEmitterPayload: IWebhookPayload<
      IStripeWebhookHandlerValidationResultDto,
      Stripe.DiscriminatedEvent
    >
  ): Promise<void> {
    const requestId = crypto.randomUUID();
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.handleSubscriptionResumed.name,
      requestId
    );

    this.#logger.log(
      `${logPrefix} Received ${ColossusStripeEventNameEnum.SUBSCRIPTION_RESUMED} event. Processing.`
    );
    this.#logger.debug(
      `${logPrefix} Event Payload: ${JsonUtils.Stringify(eventEmitterPayload)}.`
    );

    const event = eventEmitterPayload.validationResult
      .parsedEventPayload as Stripe.DiscriminatedEvent;

    const targetEventName = 'customer.subscription.resumed';

    if (event.type !== targetEventName) {
      this.#handleInvalidWebhookEventPassing(
        logPrefix,
        requestId,
        targetEventName,
        event.type,
        eventEmitterPayload
      );
      return;
    }

    const {
      id: eventId,
      data: {
        object: {
          id: stripeSubscriptionId,
          status: stripeStatus,
          customer: stripeCustomerId,
        },
      },
    } = event;

    const subscriptionProviderCustomerId = stripeCustomerId as string;

    const existingSubscription =
      await this.#getExistingSubscriptionBySubscriptionIdAndStripeCustomerId(
        stripeSubscriptionId,
        subscriptionProviderCustomerId,
        requestId
      );

    this.#guardSubscriptionInDb(
      existingSubscription,
      event,
      subscriptionProviderCustomerId,
      stripeSubscriptionId,
      stripeStatus,
      eventId,
      logPrefix,
      requestId
    );

    const {
      tenantId,
      bambuGoProductId,
      id: dbRowId,
      subscriptionMetadata,
    } = existingSubscription;

    const subscriptionFoundMessage = [
      `${logPrefix} subscription id (${stripeSubscriptionId}) for stripe customer id (${subscriptionProviderCustomerId}).`,
      `It appears to belong to tenant id (${tenantId}) for the ${bambuGoProductId} product subscription.`,
    ].join(' ');
    this.#logger.log(subscriptionFoundMessage);
    this.#logger.debug(
      `${logPrefix} ${JsonUtils.Stringify({
        existingSubscription,
        event,
      })}.`
    );

    const subscriptionStatus = SubscriptionStatusEnum.ACTIVE;

    this.#logger.log(
      `${logPrefix} This subscription is resumed. Moving status to ${subscriptionStatus}.`
    );

    const updatedMetadata = [];

    if (subscriptionMetadata) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updatedMetadata.push(...(subscriptionMetadata as any));
    }

    updatedMetadata.push(event);

    await this.#updateSubscriptionStatusForSubscriptionEvent(
      dbRowId,
      subscriptionStatus,
      updatedMetadata,
      logPrefix,
      requestId,
      existingSubscription,
      event
    );

    await this.#flushHtmlCacheOfInvestorPortal(requestId, tenantId);

    await this.#triggerHubSpotEventWithEmailAddressViaTenantId({
      event: HUBSPOT_EVENTS.MOVE_DEAL_TO_WON,
      tenantId,
      requestId,
    });
  }

  // Webhook Event Handlers - End
}
