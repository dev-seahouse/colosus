import {
  BrokerageIntegrationWithdrawalsDomainBaseService,
  BrokerageIntegrationWithdrawalsDomainServiceLocator,
} from '@bambu/server-core/domains';
import {
  BrokerageIntegrationServerDto,
  CommonSwaggerDto,
} from '@bambu/server-core/dto';
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

@ApiTags(API_TAGS.WITHDRAWALS.name)
@ApiExtraModels(
  BrokerageIntegrationServerDto.BrokerageIntegrationWithdrawalDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationListAllWithdrawalsQueryResponseDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationWithdrawalMutableDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationMoneyDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationListAllWithdrawalsQueryParamsDto
)
@Controller('withdrawals')
export class WithdrawalsController {
  private readonly logger = new Logger(WithdrawalsController.name);

  constructor(
    private readonly withdrawalsDomainServiceLocator: BrokerageIntegrationWithdrawalsDomainServiceLocator
  ) {}

  private get wealthKernelWithdrawalsDomainService(): BrokerageIntegrationWithdrawalsDomainBaseService {
    return this.withdrawalsDomainServiceLocator.GetService(
      SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
    );
  }

  @Version('1')
  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'List all withdrawals.',
    description: 'List all withdrawals.',
    externalDocs: {
      description: 'See the Wealth Kernel documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/7cb8b5451d3e4-list-withdrawals',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 200,
    description: 'List of withdrawals.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            BrokerageIntegrationServerDto.BrokerageIntegrationListAllWithdrawalsQueryResponseDto
          ),
        },
        example: {
          paginationToken: null,
          results: [
            {
              type: 'SpecifiedAmount',
              portfolioId: 'prt-32q2deogu225ps',
              bankAccountId: 'bac-32q2dek3j263q4',
              consideration: {
                currency: 'GBP',
                amount: 100,
              },
              paidOut: {
                currency: 'GBP',
                amount: 100,
              },
              reference: '32Q2DEOGU225PS',
              status: 'Settled',
              reason: null,
              requestedAt: '2019-10-08T13:55:16.4237925Z',
              id: 'wth-32qm6qal5225qe',
            },
          ],
        },
      },
    },
  })
  private async ListWithdrawals(
    @Query('tenantId') tenantId: string,
    @Query()
    queryParams: BrokerageIntegrationServerDto.BrokerageIntegrationListAllWithdrawalsQueryParamsDto,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationListAllWithdrawalsQueryResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListWithdrawals.name,
      requestId
    );

    try {
      // I messed up with the query params design, so this is a hack to get around it
      if ((queryParams as unknown as Record<string, unknown>).tenantId) {
        delete (queryParams as unknown as Record<string, unknown>).tenantId;
      }

      return await this.wealthKernelWithdrawalsDomainService.List(
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
    summary: 'Create a withdrawal request.',
    description: 'Create a withdrawal request.',
    externalDocs: {
      description: 'See the WK documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/3f1c1d143be02-request-a-withdrawal',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.IDEMPOTENCY_KEY,
  })
  @ApiResponse({
    status: 201,
    description: 'The created withdrawal request.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            BrokerageIntegrationServerDto.BrokerageIntegrationWithdrawalDto
          ),
        },
        example: {
          type: 'SpecifiedAmount',
          portfolioId: 'prt-32q2deogu225ps',
          bankAccountId: 'bac-32q2dek3j263q4',
          consideration: {
            currency: 'GBP',
            amount: 100,
          },
          paidOut: {
            currency: 'GBP',
            amount: 100,
          },
          reference: '32Q2DEOGU225PS',
          status: 'Settled',
          reason: null,
          requestedAt: '2019-10-08T13:55:16.4237925Z',
          id: 'wth-32qm6qal5225qe',
        },
      },
    },
  })
  @ApiBody({
    type: BrokerageIntegrationServerDto.BrokerageIntegrationWithdrawalMutableDto,
    examples: {
      CREATE_REQUEST: {
        value: {
          type: 'SpecifiedAmount',
          portfolioId: 'prt-32q2deogu225ps',
          bankAccountId: 'bac-32q2dek3j263q4',
          consideration: {
            currency: 'GBP',
            amount: 1.14,
          },
          reference: '32Q2DEOGU225PS',
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
              closePortfolio: false,
            },
          },
        },
      },
    },
  })
  public async CreateWithdrawalRequest(
    @Query('tenantId') tenantId: string,
    @Body()
    payload: BrokerageIntegrationServerDto.BrokerageIntegrationWithdrawalMutableDto,
    @Decorators.RequestId() requestId: string,
    @Query('idempotencyKey') idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationWithdrawalDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateWithdrawalRequest.name,
      requestId
    );
    try {
      return await this.wealthKernelWithdrawalsDomainService.Create(
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
  @Get(':withdrawalId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a withdrawal request by id.',
    description: 'Get a withdrawal request by id.',
    externalDocs: {
      description: 'See the WK documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/898eb84f7805f-retrieve-a-withdrawal',
    },
  })
  @ApiParam({
    name: 'withdrawalId',
    description: 'The id of the withdrawal request.',
    type: 'string',
    example: 'wth-32qm6qal5225qe',
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 200,
    description: 'The created withdrawal request.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            BrokerageIntegrationServerDto.BrokerageIntegrationWithdrawalDto
          ),
        },
        example: {
          type: 'SpecifiedAmount',
          portfolioId: 'prt-32q2deogu225ps',
          bankAccountId: 'bac-32q2dek3j263q4',
          consideration: {
            currency: 'GBP',
            amount: 100,
          },
          paidOut: {
            currency: 'GBP',
            amount: 100,
          },
          reference: '32Q2DEOGU225PS',
          status: 'Settled',
          reason: null,
          requestedAt: '2019-10-08T13:55:16.4237925Z',
          id: 'wth-32qm6qal5225qe',
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
              errorCode: 'UNHANDLED',
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
  public async GetWithdrawalRequestById(
    @Param('withdrawalId') withdrawalId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationWithdrawalDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetWithdrawalRequestById.name,
      requestId
    );
    try {
      return await this.wealthKernelWithdrawalsDomainService.Get(
        requestId,
        tenantId,
        withdrawalId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }
}
