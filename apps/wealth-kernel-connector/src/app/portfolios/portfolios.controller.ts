import {
  BrokerageIntegrationPortfoliosDomainBaseService,
  BrokerageIntegrationPortfoliosDomainServiceLocator,
} from '@bambu/server-core/domains';
import { CommonSwaggerDto } from '@bambu/server-core/dto';
import {
  Decorators,
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { SharedEnums } from '@bambu/shared';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { API_TAGS, SWAGGER } from '../../constants';
import * as Dto from './dto';

@ApiTags(API_TAGS.PORTFOLIOS.name)
@ApiExtraModels(
  CommonSwaggerDto.SwaggerColossusHttpErrorDto,
  Dto.BrokerageIntegrationPortfolioDto,
  Dto.MandateDto,
  Dto.BrokerageIntegrationListAllPortfoliosResponseDto,
  Dto.BrokerageIntegrationPortfolioMutableDto,
  Dto.BrokerageIntegrationListAllPortfoliosQueryParamsDto
)
@Controller('portfolios')
export class PortfoliosController {
  private readonly logger = new Logger(PortfoliosController.name);

  constructor(
    private readonly brokerageIntegrationPortfoliosDomainServiceLocator: BrokerageIntegrationPortfoliosDomainServiceLocator
  ) {}

  private get wealthKernelPortfolioDomainService(): BrokerageIntegrationPortfoliosDomainBaseService {
    return this.brokerageIntegrationPortfoliosDomainServiceLocator.GetService(
      SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
    );
  }

  @Version('1')
  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'List all portfolios.',
    externalDocs: {
      description: 'See the Wealth Kernel documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/6d550c973644f-list-portfolios',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 200,
    description: 'List of all portfolios.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            Dto.BrokerageIntegrationListAllPortfoliosResponseDto
          ),
        },
        example: {
          paginationToken: null,
          results: [
            {
              id: 'prt-32q2deogu225ps',
              accountId: 'acc-34itotfqb24qek',
              clientReference: '5c6759ff36',
              name: 'Savings Portfolio',
              status: 'Active',
              currency: 'GBP',
              mandate: {
                type: 'NullMandate',
              },
              createdAt: '2019-10-08T13:55:16.4237925Z',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'HTTP 400 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          TENANT_NOT_BOUND_TO_BROKERAGE: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .TENANT_NOT_BOUND_TO_BROKERAGE,
              statusCode: 400,
              message: 'Tenant not valid for brokerage.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: 'HTTP 429 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          TENANT_NOT_BOUND_TO_BROKERAGE: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .BROKER_API_RATE_LIMIT_HIT,
              statusCode: 429,
              message: 'Brokerage API rate limit met/exceeded.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  public async ListAllPortfolios(
    @Query('tenantId') tenantId: string,
    @Query()
    queryParams: Dto.BrokerageIntegrationListAllPortfoliosQueryParamsDto,
    @Decorators.RequestId() requestId: string
  ): Promise<Dto.BrokerageIntegrationListAllPortfoliosResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListAllPortfolios.name,
      requestId
    );

    try {
      // I messed up with the query params design, so this is a hack to get around it
      if ((queryParams as unknown as Record<string, unknown>).tenantId) {
        delete (queryParams as unknown as Record<string, unknown>).tenantId;
      }

      return await this.wealthKernelPortfolioDomainService.List(
        requestId,
        tenantId,
        queryParams
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create a portfolio.',
    externalDocs: {
      description: 'See the WK documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/ff6e7b94918a8-add-a-portfolio',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.IDEMPOTENCY_KEY,
  })
  @ApiBody({
    type: Dto.BrokerageIntegrationPortfolioMutableDto,
    description: 'The portfolio to create.',
    required: true,
    examples: {
      PORTFOLIO_TO_CREATE: {
        value: {
          accountId: 'acc-32q2dek2z223q4',
          clientReference: '5c6759ff36',
          name: 'Individual Savings Account',
          currency: 'GBP',
          mandate: {
            type: 'NullMandate',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The created portfolio.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(Dto.BrokerageIntegrationPortfolioDto),
        },
        example: {
          id: 'prt-32q2deogu225ps',
          accountId: 'acc-34itov6w523b7o',
          clientReference: '5c6759ff36',
          name: 'Savings Portfolio',
          status: 'Active',
          currency: 'GBP',
          mandate: {
            type: 'NullMandate',
          },
          createdAt: '2019-10-08T13:55:16.4237925Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'HTTP 400 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          TENANT_NOT_BOUND_TO_BROKERAGE: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .TENANT_NOT_BOUND_TO_BROKERAGE,
              statusCode: 400,
              message: 'Tenant not valid for brokerage.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
          BAD_INPUT: {
            value: {
              error: 'Error',
              errorCode: 'BAD_BROKERAGE_REQUEST',
              statusCode: 400,
              message:
                'One or more validation errors occurred. Supplementary error messages: [The provided countryCode is not valid].',
              requestId: '61b88ac7-8a22-4524-b513-c92f5f036b6b',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'HTTP 409 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          ALREADY_SUBMITTED: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .IDEMPOTENT_CREATION_REQUEST_ALREADY_SUBMITTED,
              statusCode: 409,
              message:
                'The creation request has already been submitted with different details. Idempotency key: "idempotency-key-here".',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: 'HTTP 429 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          TENANT_NOT_BOUND_TO_BROKERAGE: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .BROKER_API_RATE_LIMIT_HIT,
              statusCode: 429,
              message: 'Brokerage API rate limit met/exceeded.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  public async CreatePortfolio(
    @Query('tenantId') tenantId: string,
    @Body() payload: Dto.BrokerageIntegrationPortfolioMutableDto,
    @Decorators.RequestId() requestId: string,
    @Query('idempotencyKey') idempotencyKey?: string
  ): Promise<Dto.BrokerageIntegrationPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreatePortfolio.name,
      requestId
    );

    try {
      return await this.wealthKernelPortfolioDomainService.Create(
        requestId,
        tenantId,
        payload,
        idempotencyKey
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get(':portfolioId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a portfolio by ID.',
    externalDocs: {
      description: 'See the Swagger documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/2eca80f69b0f2-retrieve-a-portfolio',
    },
  })
  @ApiParam({
    name: 'portfolioId',
    description: 'The ID of the portfolio to retrieve.',
    required: true,
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 200,
    description: 'The portfolio.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(Dto.BrokerageIntegrationPortfolioDto),
        },
        example: {
          id: 'prt-32q2deogu225ps',
          accountId: 'acc-34itov6w523b7o',
          clientReference: '5c6759ff36',
          name: 'Savings Portfolio',
          status: 'Active',
          currency: 'GBP',
          mandate: {
            type: 'NullMandate',
          },
          createdAt: '2019-10-08T13:55:16.4237925Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'HTTP 400 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          TENANT_NOT_BOUND_TO_BROKERAGE: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .TENANT_NOT_BOUND_TO_BROKERAGE,
              statusCode: 400,
              message: 'Tenant not valid for brokerage.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'HTTP 404 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          BROKERAGE_ACCOUNT_NOT_FOUND: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .BROKERAGE_PORTFOLIO_NOT_FOUND,
              statusCode: 404,
              message: 'The brokerage account portfolio was not found.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: 'HTTP 429 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          TENANT_NOT_BOUND_TO_BROKERAGE: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .BROKER_API_RATE_LIMIT_HIT,
              statusCode: 429,
              message: 'Brokerage API rate limit met/exceeded.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  public async GetPortfolioById(
    @Param('portfolioId') portfolioId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<Dto.BrokerageIntegrationPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetPortfolioById.name,
      requestId
    );

    try {
      return await this.wealthKernelPortfolioDomainService.Get(
        requestId,
        tenantId,
        portfolioId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Put(':portfolioId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update a portfolio by ID.',
    externalDocs: {
      description: 'See the Swagger documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/bf12b86730c62-change-a-portfolio-s-mandate',
    },
  })
  @ApiParam({
    name: 'portfolioId',
    description: 'The ID of the portfolio to update.',
    required: true,
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiBody({
    type: Dto.MandateDto,
    required: true,
    examples: {
      PORTFOLIO_TO_UPDATE: {
        value: {
          type: 'NullMandate',
        },
      },
    },
    description: 'The portfolio mandate to update.',
  })
  @ApiResponse({
    status: 200,
    description: 'The brokerage account.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(Dto.BrokerageIntegrationPortfolioDto),
        },
        example: {
          id: 'prt-32q2deogu225ps',
          accountId: 'acc-34itov6w523b7o',
          clientReference: '5c6759ff36',
          name: 'Savings Portfolio',
          status: 'Active',
          currency: 'GBP',
          mandate: {
            type: 'NullMandate',
          },
          createdAt: '2019-10-08T13:55:16.4237925Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'HTTP 400 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          TENANT_NOT_BOUND_TO_BROKERAGE: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .TENANT_NOT_BOUND_TO_BROKERAGE,
              statusCode: 400,
              message: 'Tenant not valid for brokerage.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'HTTP 404 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          BROKERAGE_ACCOUNT_NOT_FOUND: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .BROKERAGE_ACCOUNT_NOT_FOUND,
              statusCode: 404,
              message: 'The brokerage account account was not found.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: 'HTTP 429 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          TENANT_NOT_BOUND_TO_BROKERAGE: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .BROKER_API_RATE_LIMIT_HIT,
              statusCode: 429,
              message: 'Brokerage API rate limit met/exceeded.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  public async UpdatePortfolioById(
    @Param('portfolioId') portfolioId: string,
    @Query('tenantId') tenantId: string,
    @Body() payload: Dto.MandateDto,
    @Decorators.RequestId() requestId: string
  ): Promise<Dto.BrokerageIntegrationPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdatePortfolioById.name,
      requestId
    );

    try {
      return await this.wealthKernelPortfolioDomainService.Update(
        requestId,
        tenantId,
        portfolioId,
        /**
         * This is just to ensure data contract consistency when we move to a new brokerage.
         *
         * WK only allows to update the mandate while other brokerages may have more.
         * */
        {
          mandate: payload,
        } as unknown as Dto.BrokerageIntegrationPortfolioMutableDto
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Post(':portfolioId/actions/close')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(204)
  @ApiOperation({
    summary: 'Close a portfolio by ID.',
    externalDocs: {
      description: 'See the Swagger documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/0fffce2e5fad5-close-a-portfolio',
    },
  })
  @ApiParam({
    name: 'portfolioId',
    description: 'The ID of the portfolio to close.',
    required: true,
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 204,
  })
  @ApiResponse({
    status: 400,
    description: 'HTTP 400 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          TENANT_NOT_BOUND_TO_BROKERAGE: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .TENANT_NOT_BOUND_TO_BROKERAGE,
              statusCode: 400,
              message: 'Tenant not valid for brokerage.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
          BAD_INPUT: {
            value: {
              error: 'Error',
              errorCode: 'BAD_BROKERAGE_REQUEST',
              statusCode: 400,
              message:
                'One or more validation errors occurred. Supplementary error messages: [The provided countryCode is not valid].',
              requestId: '61b88ac7-8a22-4524-b513-c92f5f036b6b',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'HTTP 404 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          BROKERAGE_ACCOUNT_NOT_FOUND: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .BROKERAGE_ACCOUNT_NOT_FOUND,
              statusCode: 404,
              message: 'The brokerage account account was not found.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: 'HTTP 429 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          TENANT_NOT_BOUND_TO_BROKERAGE: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .BROKER_API_RATE_LIMIT_HIT,
              statusCode: 429,
              message: 'Brokerage API rate limit met/exceeded.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  public async ClosePortfolioById(
    @Param('portfolioId') portfolioId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ClosePortfolioById.name,
      requestId
    );

    try {
      return await this.wealthKernelPortfolioDomainService.Close(
        requestId,
        tenantId,
        portfolioId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }
}
