import { Authenticated } from '@bambu/server-core/common-guards';
import { StripeIntegrationDomainServiceBase } from '@bambu/server-core/domains';
import {
  IColossusHttpRequestDto,
  StripeIntegrationServerDto,
} from '@bambu/server-core/dto';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { StripeIntegrationDto } from '@bambu/shared';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Patch,
  Query,
  Req,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { validateOrReject } from 'class-validator';
import * as crypto from 'crypto';
import {
  CheckoutSubscriptionSessionRequestDto,
  RequestAdvisorSubscriptionListResponseDto,
  StripeBillingPortalSessionResponseDto,
  StripeCheckoutSessionResponseDto,
  StripeCreateRequestDto,
  StripeListPricesResponseDto,
  StripeListProductsResponseDto,
  StripePriceRowDto,
  StripeProductRowDto,
  GetSubscriptionUpgradeDetailsResponseDto,
} from './dto';

@Authenticated()
@ApiTags('Stripe Integration')
@ApiExtraModels(
  StripeCreateRequestDto,
  StripeListPricesResponseDto,
  StripePriceRowDto,
  CheckoutSubscriptionSessionRequestDto,
  StripeCheckoutSessionResponseDto,
  StripeBillingPortalSessionResponseDto
)
@Controller('stripe-integration')
export class StripeIntegrationController {
  readonly #logger = new Logger(StripeIntegrationController.name);

  constructor(private readonly domain: StripeIntegrationDomainServiceBase) {}

  @Version('1')
  @Get('prices')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Returns a list of your prices.',
    externalDocs: {
      description: 'List all prices documentation.',
      url: 'https://stripe.com/docs/api/prices/list?lang=curl',
    },
  })
  @ApiQuery({
    name: 'active',
    description: `Only return prices that are active or inactive (e.g., pass false to list all inactive prices).`,
    required: false,
    example: true,
    schema: {
      type: 'boolean',
    },
  })
  @ApiQuery({
    name: 'currency',
    description: `Only return prices for the given currency.`,
    required: false,
    example: 'MYR',
    schema: {
      type: 'string',
      minLength: 3,
      maxLength: 3,
    },
  })
  @ApiQuery({
    name: 'product',
    description: `Only return prices for the given product`,
    required: false,
    schema: {
      type: 'string',
    },
  })
  @ApiQuery({
    name: 'type',
    description: `Only return prices of type recurring or one_time.`,
    required: false,
    enum: StripeIntegrationDto.StripePriceTypeEnum,
    example: 'recurring',
  })
  @ApiQuery({
    name: 'created',
    description: `A filter on the list based on the object created field. The value can be a string with an integer Unix timestamp, or it can be a dictionary.`,
    required: false,
    type: 'string',
    examples: {
      ['Get Everything']: {
        description: 'Get everything',
        value: JSON.stringify({
          gt: 0,
        } as StripeIntegrationDto.IStripeCreatedListPricesDto),
      },
    },
  })
  @ApiQuery({
    name: 'ending_before',
    description: `A cursor for use in pagination. ending_before is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_bar, your subsequent call can include ending_before=obj_bar in order to fetch the previous page of the list.`,
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'limit',
    description: `A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10.`,
    required: false,
    type: 'integer',
    example: 10,
  })
  @ApiQuery({
    name: 'lookup_keys',
    description: `Only return the price with these lookup_keys, if any exist.`,
    required: false,
    type: 'string',
    isArray: true,
  })
  @ApiQuery({
    name: 'recurring',
    description: `Only return prices with these recurring fields.`,
    required: false,
    type: 'string',
    examples: {
      ['Get monthly licensed prices']: {
        description: 'Gets monthly licensed prices.',
        value: JSON.stringify({
          interval: StripeIntegrationDto.StripeRecurringIntervalEnum.MONTH,
          usage_type:
            StripeIntegrationDto.StripeRecurringUsageTypeEnum.LICENSED,
        } as StripeIntegrationDto.IStripeRecurringPaymentConfigurationDto),
      },
    },
  })
  @ApiQuery({
    name: 'starting_after',
    description: `A cursor for use in pagination. starting_after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include starting_after=obj_foo in order to fetch the next page of the list.`,
    required: false,
    type: 'string',
    isArray: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of prices.',
    type: StripeListPricesResponseDto,
  })
  public async ListPrices(
    @Query('active') active?: boolean,
    @Query('currency') currency?: string,
    @Query('product') product?: string,
    @Query('type') type?: StripeIntegrationDto.StripePriceTypeEnum,
    @Query('created') created?: string,
    @Query('ending_before') ending_before?: string,
    @Query('limit') limit?: number,
    @Query('lookup_keys') lookup_keys?: string[],
    @Query('recurring') recurring?: string,
    @Query('starting_after') starting_after?: string
  ): Promise<StripeListPricesResponseDto> {
    const requestId: string = crypto.randomUUID();
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.ListPrices.name,
      requestId
    );

    /***
     * If the lookup_keys is a string, convert it to an array.
     */
    if (
      lookup_keys !== undefined &&
      lookup_keys !== null &&
      typeof lookup_keys === 'string' &&
      String(lookup_keys).trim().length > 0
    ) {
      lookup_keys = [lookup_keys];
    }

    /***
     * If the lookup_keys is an empty string, convert it to undefined.
     */
    if (
      lookup_keys !== undefined &&
      lookup_keys !== null &&
      typeof lookup_keys === 'string' &&
      String(lookup_keys).trim().length < 1
    ) {
      lookup_keys = undefined;
    }

    this.#logger.log(`${logPrefix} Begin processing request to list prices.`);
    this.#logger.debug(
      `${logPrefix} API arguments: ${JSON.stringify({
        active,
        currency,
        product,
        type,
        created,
        ending_before,
        limit,
        lookup_keys,
        recurring,
        starting_after,
      })}.`
    );

    const inputPayload: StripeIntegrationDto.IStripeListPricesRequestDto = {
      active,
      currency,
      product,
      type,
      ending_before,
      limit,
      lookup_keys,
      starting_after,
      requestId,
    };

    this.#logger.debug(
      `${logPrefix} Initial assembled domain payload: ${JsonUtils.Stringify(
        inputPayload
      )}.`
    );

    if (created) {
      this.#logger.debug(
        `${logPrefix} The 'created' parameter found. Appending.`
      );

      inputPayload.created = JSON.parse(created);

      this.#logger.debug(
        `${logPrefix} Updated domain payload: ${JSON.stringify(inputPayload)}.`
      );
    }

    if (recurring) {
      this.#logger.debug(
        `${logPrefix} The 'recurring' parameter found. Appending.`
      );

      inputPayload.recurring = JSON.parse(recurring);

      this.#logger.debug(
        `${logPrefix} Updated domain payload: ${JSON.stringify(inputPayload)}.`
      );
    }

    const result = await this.domain.ListPrices(inputPayload);

    this.#logger.log(`${logPrefix} Done processing request to list prices.`);

    return {
      data: result.data,
      url: result.url,
      has_more: result.has_more,
      object: result.object,
    };
  }

  @Version('1')
  @Get('prices/:priceId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve a price.',
    description: 'Retrieves the price with the given ID.',
    externalDocs: {
      description: 'Stripe documentation.',
      url: 'https://stripe.com/docs/api/prices/retrieve',
    },
  })
  @ApiParam({
    name: 'priceId',
    type: 'string',
    required: true,
    description: 'Stripe price id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Price data from Stripe.',
    type: StripePriceRowDto,
  })
  public async GetPriceById(
    @Param('priceId') priceId
  ): Promise<StripePriceRowDto> {
    const requestId: string = crypto.randomUUID();
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetPriceById.name,
      requestId
    );

    this.#logger.log(
      `${logPrefix} Retrieving data for Stripe price object ${priceId}.`
    );

    try {
      const result = await this.domain.GetPriceDataById(requestId, priceId);

      this.#logger.log(
        `${logPrefix} Retrieved data for Stripe price object ${priceId}.`
      );

      return result;
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Version('1')
  @Get('prices/search')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Search for prices using the Stripe Query Language.',
    externalDocs: {
      description: 'List all prices documentation.',
      url: 'https://stripe.com/docs/api/prices/search?lang=curl',
    },
  })
  @ApiQuery({
    name: 'query',
    description: [
      'The search query string.',
      'See search query language (https://stripe.com/docs/search#search-query-language).',
      'See the list of supported query fields for prices at https://stripe.com/docs/search#query-fields-for-prices.',
    ].join(' '),
    required: true,
    type: 'string',
    examples: {
      ['Get Active Prices']: {
        description:
          'Only return prices that are active or inactive (e.g., pass false to list all inactive prices).',
        value: "active:'true'",
      },
    },
  })
  @ApiQuery({
    name: 'limit',
    description: `A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10.`,
    required: false,
    type: 'integer',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    description:
      'A cursor for pagination across multiple pages of results. Don’t include this parameter on the first call. Use the next_page value returned in a previous response to request subsequent results.',
    required: false,
    type: 'string',
  })
  @ApiResponse({
    status: 201,
    description: [
      'A dictionary with a data property that contains an array of up to limit prices.',
      'If no objects match the query, the resulting array will be empty.',
      ' See the related guide on expanding properties in lists (https://stripe.com/docs/expand#lists).',
    ].join(' '),
    type: StripeListPricesResponseDto,
  })
  public async Search(
    @Query('query') query: string,
    @Query('limit') limit?: number,
    @Query('page') page?: string
  ) {
    const requestId: string = crypto.randomUUID();
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.Search.name,
      requestId
    );

    this.#logger.log(`${logPrefix} Begin Stripe price search.`);
    const result = await this.domain.SearchPrices({
      page,
      limit,
      query,
      requestId,
    });
    this.#logger.log(`${logPrefix} Completed Stripe price search.`);

    return {
      data: result.data,
      url: result.url,
      has_more: result.has_more,
      object: result.object,
    };
  }

  @Version('1')
  @Get('/advisor-subscriptions')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets all subscriptions belonging to advisor tenant.',
  })
  @ApiResponse({
    status: 200,
    description: 'Subscriptions.',
    type: RequestAdvisorSubscriptionListResponseDto,
  })
  protected async GetAllSubscriptions(
    @Req() request: IColossusHttpRequestDto
  ): Promise<StripeIntegrationDto.IRequestAdvisorSubscriptionListResponseDto> {
    const requestId: string = crypto.randomUUID();
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetAllSubscriptions.name,
      requestId
    );

    this.#logger.log(
      `${logPrefix} Received request to return all subscriptions for advisor tenant.`
    );

    try {
      const userId = this.#getUserIdFromClaims(request, requestId);

      const result: StripeIntegrationDto.IRequestAdvisorSubscriptionListResponseDto =
        await this.domain.GetSubscriptionsForTenantByUserId({
          requestId,
          userId,
        });

      this.#logger.log(
        `${logPrefix} Processed request to return all subscriptions for advisor tenant.`
      );
      this.#logger.debug(
        `${logPrefix} Result: ${JsonUtils.Stringify(result)}.`
      );

      return result;
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Version('1')
  @Get('/advisor-subscription-upgrade-details')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve subscription upgrade details.',
    description:
      'Retrieves the subscription upgrade details from Connect to Transact. Supply the unique subscription ID from stripe, and this API will return the upgrade details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Upgrade details from Connect to Transact for a subscription.',
    type: GetSubscriptionUpgradeDetailsResponseDto,
  })
  protected async GetSubscriptionUpgradeCost(
    @Req() request: IColossusHttpRequestDto
  ): Promise<GetSubscriptionUpgradeDetailsResponseDto> {
    const requestId: string = crypto.randomUUID();
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetSubscriptionUpgradeCost.name,
      requestId
    );

    this.#logger.log(
      `${logPrefix} Received request to get upgrade subscription cost.`
    );
    try {
      const userId = this.#getUserIdFromClaims(request, requestId);
      return this.domain.GetUpgradeSubscriptionDetails({
        requestId,
        userId,
      });
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Version('1')
  @Patch('/advisor-subscription-upgrade')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Upgrade subscription from connect to transact.',
  })
  @ApiResponse({
    status: 204,
    description: 'Subscription upgraded.',
  })
  @HttpCode(204)
  protected async UpdateSubscription(
    @Req() request: IColossusHttpRequestDto
  ): Promise<void> {
    const requestId: string = crypto.randomUUID();
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.UpdateSubscription.name,
      requestId
    );

    this.#logger.log(`${logPrefix} Received request to update subscription.`);
    try {
      const userId = this.#getUserIdFromClaims(request, requestId);
      await this.domain.UpdateSubscriptionById({
        requestId,
        userId,
      });
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Version('1')
  @Post('/advisor-subscriptions/checkout/session')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Generate session for Stripe Checkout.',
    externalDocs: {
      description: 'List all prices documentation.',
      url: 'https://stripe.com/docs/api/checkout/sessions/create?lang=curl',
    },
  })
  @ApiBody({
    description: 'Input payload',
    type: CheckoutSubscriptionSessionRequestDto,
    schema: {
      $ref: getSchemaPath(CheckoutSubscriptionSessionRequestDto),
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Returns a Session object.',
    type: StripeCheckoutSessionResponseDto,
  })
  public async CreateSession(
    @Body() body: CheckoutSubscriptionSessionRequestDto,
    @Req() request: IColossusHttpRequestDto
  ): Promise<StripeCheckoutSessionResponseDto> {
    const requestId: string = crypto.randomUUID();
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.CreateSession.name,
      requestId
    );

    const input =
      new StripeIntegrationServerDto.CheckoutSubscriptionSessionDomainRequestDto();
    input.billingAddressCollection = body.billingAddressCollection;
    input.lineItems = body.lineItems;
    input.originUrl = request.headers.origin;
    input.requestId = requestId;

    const claims = request.claims;
    input.email = claims?.email;
    input.userId = claims?.sub;
    input.realm = claims?.realm;
    // TODO: For now this is hardcoded as true.  This could be linked to a cohort type or property on a tenant to allow certain people to input promotional codes
    input.allowPromotionCodes = true;

    try {
      this.#logger.debug(
        [
          `${logPrefix}. Validating assembled DTO.`,
          `API Input: ${JsonUtils.Stringify({
            body,
            claims,
            requestHeaders: request.headers,
          })}.`,
          `Assembled DTO: ${JsonUtils.Stringify(input)}..`,
        ].join(' ')
      );
      await validateOrReject(input);
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error while binding data to claims.`,
        `Details: ${JsonUtils.Stringify(error)}.`,
        `Input: ${JsonUtils.Stringify({
          input,
          claims,
        })}.`,
      ].join(' ');
      this.#logger.error(errorMessage);

      throw ErrorUtils.getDefaultMissingClaimsError(requestId, {
        input,
        request,
      });
    }

    try {
      this.#logger.log(`${logPrefix} Begin generating checkout session.`);
      const response = await this.domain.GenerateCheckoutSession(input);
      this.#logger.log(`${logPrefix} Done generating checkout session.`);

      return response as StripeCheckoutSessionResponseDto;
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Version('1')
  @Get('advisor-subscriptions/check-eligibility')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Checks if user is eligible to subscribe.',
    description:
      'This API is meant to help prevent double subscribing to a given subscription.',
  })
  @ApiQuery({
    name: 'priceId',
    type: 'string',
    required: true,
    description: 'Price id of the subscription to be tested.',
  })
  @ApiResponse({
    status: 200,
    description: 'Shows if the user is eligible or not.',
    schema: {
      type: 'object',
      properties: {
        isEligible: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  public async CheckIfCustomerIsEligibleForSubscription(
    @Req() request: IColossusHttpRequestDto,
    @Query('priceId') priceId: string
  ) {
    const requestId: string = crypto.randomUUID();
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.CheckIfCustomerIsEligibleForSubscription.name,
      requestId
    );

    this.#logger.log(
      `${logPrefix} Received request to check if user is eligible for subscription to specified product.`
    );

    try {
      const userId = this.#getUserIdFromClaims(request, requestId);

      const isEligible = await this.domain.CheckIfUserIsEligibleForSubscription(
        {
          requestId,
          priceId,
          userId,
        }
      );

      this.#logger.log(
        `${logPrefix} Processed request to check if user is eligible for subscription to specified product.`
      );

      const response = {
        isEligible,
      };

      this.#logger.debug(
        `${logPrefix} Eligibility result is ${JSON.stringify(response)}`
      );

      return response;
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Version('1')
  @Get('products')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List all products.',
    description:
      'Returns a list of your products. The products are returned sorted by creation date, with the most recently created products appearing first.',
    externalDocs: {
      url: 'https://stripe.com/docs/api/products/list?lang=curl',
      description: 'Stripe documentation.',
    },
  })
  @ApiQuery({
    name: 'active',
    description: `Only return products that are active or inactive (e.g., pass false to list all inactive products).`,
    required: false,
    example: true,
    schema: {
      type: 'boolean',
    },
  })
  @ApiQuery({
    name: 'created',
    description: `A filter on the list based on the object created field. The value can be a string with an integer Unix timestamp, or it can be a dictionary.`,
    required: false,
    type: 'string',
    examples: {
      ['Get Everything']: {
        description: 'Get everything',
        value: JSON.stringify({
          gt: 0,
        } as StripeIntegrationDto.IStripeCreatedListPricesDto),
      },
    },
  })
  @ApiQuery({
    name: 'ending_before',
    description: `A cursor for use in pagination. ending_before is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with obj_bar, your subsequent call can include ending_before=obj_bar in order to fetch the previous page of the list.`,
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'ids',
    description: [
      'Only return products with the given IDs.',
      'Cannot be used with starting_after or ending_before.',
    ].join(' '),
    required: false,
    type: 'string',
    isArray: true,
  })
  @ApiQuery({
    name: 'limit',
    description: `A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10.`,
    required: false,
    type: 'integer',
    example: 10,
  })
  @ApiQuery({
    name: 'shippable',
    description:
      'Only return products that can be shipped (i.e., physical, not digital products).',
    required: false,
    type: 'boolean',
    example: false,
  })
  @ApiQuery({
    name: 'starting_after',
    description: `A cursor for use in pagination. starting_after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include starting_after=obj_foo in order to fetch the next page of the list.`,
    required: false,
    type: 'string',
    isArray: true,
  })
  @ApiQuery({
    name: 'url',
    description: 'Only return products with the given url.',
    required: false,
    type: 'string',
    schema: {
      type: 'string',
      format: 'uri',
    },
  })
  @ApiResponse({
    type: StripeListProductsResponseDto,
    status: 200,
    description: 'List of products from Stripe.',
  })
  public async GetProducts(
    @Query('active') active?: boolean,
    @Query('created') created?: string,
    @Query('ending_before') ending_before?: string,
    @Query('ids') ids?: string[],
    @Query('limit') limit?: number,
    @Query('shippable') shippable?: boolean,
    @Query('starting_after') starting_after?: string,
    @Query('url') url?: string
  ): Promise<StripeListProductsResponseDto> {
    const requestId: string = crypto.randomUUID();
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetProducts.name,
      requestId
    );

    this.#logger.log(`${logPrefix} Begin processing request to list products.`);
    this.#logger.debug(
      `${logPrefix} API arguments: ${JSON.stringify({
        active,
        created,
        ending_before,
        ids,
        limit,
        shippable,
        starting_after,
        url,
      })}.`
    );

    const inputPayload: StripeIntegrationServerDto.IListProductsDomainRequestDto =
      {
        requestId,
        parameters: {
          active,
          ending_before,
          ids,
          limit,
          shippable,
          starting_after,
          url,
        },
      };

    this.#logger.debug(
      `${logPrefix} Initial assembled domain payload: ${JsonUtils.Stringify(
        inputPayload
      )}.`
    );

    if (created) {
      this.#logger.debug(
        `${logPrefix} The 'created' parameter found. Appending.`
      );

      inputPayload.parameters.created = JSON.parse(created);

      this.#logger.debug(
        `${logPrefix} Updated domain payload: ${JSON.stringify(inputPayload)}.`
      );
    }

    const result = await this.domain.ListProducts(inputPayload);

    this.#logger.log(`${logPrefix} Done processing request to list products.`);

    return result as StripeListProductsResponseDto;
  }

  @Version('1')
  @Get('products/:productId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve a product.',
    description:
      'Retrieves the details of an existing product. Supply the unique product ID from either a product creation request or the product list, and Stripe will return the corresponding product information.',
    externalDocs: {
      url: 'https://stripe.com/docs/api/products/retrieve',
      description: 'Stripe documentation.',
    },
  })
  @ApiParam({
    name: 'productId',
    type: 'string',
    required: true,
    description: 'Stripe product id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Stripe product details for specific product.',
    type: StripeProductRowDto,
  })
  public async GetProductById(
    @Param('productId') productId: string
  ): Promise<StripeProductRowDto> {
    const requestId: string = crypto.randomUUID();
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetPriceById.name,
      requestId
    );

    this.#logger.log(
      `${logPrefix} Retrieving data for Stripe product object ${productId}.`
    );

    try {
      const result = await this.domain.GetProductById(requestId, productId);

      this.#logger.log(
        `${logPrefix} Retrieved data for Stripe product object ${productId}.`
      );

      return result as StripeProductRowDto;
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Version('1')
  @Post('billing-portal/sessions')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a portal session.',
    externalDocs: {
      description: 'Creates a session of the customer portal.',
      url: 'https://stripe.com/docs/api/customer_portal/sessions/create?lang=curl',
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Stripe Billing portal session object.',
    type: StripeBillingPortalSessionResponseDto,
  })
  public async GeneratePortalSession(
    @Req() request: IColossusHttpRequestDto
  ): Promise<StripeBillingPortalSessionResponseDto> {
    const requestId: string = crypto.randomUUID();
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GeneratePortalSession.name,
      requestId
    );

    this.#logger.log(
      `${logPrefix} Received request to generate billing portal session.`
    );

    try {
      const userId = this.#getUserIdFromClaims(request, requestId);

      const result = await this.domain.GenerateBillingPortalSession({
        userId,
        requestId,
        origin: request.headers.origin,
      });

      this.#logger.log(
        `${logPrefix} Completed request to generate billing portal session.`
      );
      this.#logger.debug(
        `${logPrefix} Session: ${JsonUtils.Stringify(result)}.`
      );

      return result;
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  #getUserIdFromClaims(
    request: IColossusHttpRequestDto,
    requestId: string
  ): string {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#getUserIdFromClaims.name,
      requestId
    );

    const userId = request?.claims?.sub;

    if (!userId) {
      const error = ErrorUtils.getDefaultMissingClaimsError(
        requestId,
        {
          request,
        },
        `Unable to acquire user id from session claims.`
      );

      this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(error)}`);

      throw error;
    }

    return userId;
  }
}
