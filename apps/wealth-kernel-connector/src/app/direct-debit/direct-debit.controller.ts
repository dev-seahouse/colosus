import {
  BrokerageIntegrationDirectDebitDomainBaseService,
  BrokerageIntegrationDirectDebitDomainServiceLocator,
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
  Patch,
  Post,
  Query,
  Res,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import type { Response, query } from 'express';
import { SWAGGER } from '../../constants';
import * as Dto from './dto';

@ApiTags('Direct Debit')
@ApiExtraModels(
  CommonSwaggerDto.SwaggerColossusHttpErrorDto,
  Dto.BrokerageUkDirectDebitMandateDto,
  Dto.BrokerageUkDirectDebitMandateMutableDto,
  Dto.BrokerageUkDirectDebitMandateListAllQueryParamsDto,
  Dto.BrokerageUkDirectDebitMandateListAllResponseDto
)
@Controller('direct-debit')
export class DirectDebitController {
  private readonly logger = new Logger(DirectDebitController.name);

  constructor(
    private readonly serviceLocator: BrokerageIntegrationDirectDebitDomainServiceLocator
  ) {}

  private get wealthKernelDirectDebitService(): BrokerageIntegrationDirectDebitDomainBaseService {
    return this.serviceLocator.GetService(
      SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
    );
  }

  @Version('1')
  @Get('mandate')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'List all direct debit mandates.',
    externalDocs: {
      description: 'See Wealth Kernel API docs for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/a332c6d3bde51-list-mandates',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 200,
    description: 'HTTP 200 response.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            Dto.BrokerageUkDirectDebitMandateListAllResponseDto
          ),
        },
        example: {
          paginationToken: null,
          results: [
            {
              partyId: 'string',
              bankAccountId: 'string',
              status: 'Pending',
              id: 'string',
              reference: 'string',
              reason: 'string',
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
  public async ListAllDirectDebitMandates(
    @Query('tenantId') tenantId: string,
    @Query()
    queryParams: Dto.BrokerageUkDirectDebitMandateListAllQueryParamsDto,
    @Decorators.RequestId() requestId: string
  ): Promise<Dto.BrokerageUkDirectDebitMandateListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListAllDirectDebitMandates.name,
      requestId
    );
    try {
      // I messed up with the query params design, so this is a hack to get around it
      if ((queryParams as unknown as Record<string, unknown>).tenantId) {
        delete (queryParams as unknown as Record<string, unknown>).tenantId;
      }

      return await this.wealthKernelDirectDebitService.List(
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
  @Get('mandate/mandate-pdf-preview')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get mandate PDF preview.',
    externalDocs: {
      description: 'See Wealth Kernel API docs for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/f2bbd7ec69a95-get-a-mandate-pdf-preview',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiQuery({
    name: 'bankAccountId',
    description: 'The bank account ID for the mandate.',
    required: true,
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'HTTP 200 response.',
    content: {
      'application/pdf': {
        schema: {
          type: 'file',
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
  public async GetMandatePdfPreview(
    @Query('tenantId') tenantId: string,
    @Query('bankAccountId') bankAccountId: string,
    @Decorators.RequestId() requestId: string,
    @Res() response: Response
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetMandatePdfPreview.name,
      requestId
    );
    try {
      const [body, mimeType] =
        await this.wealthKernelDirectDebitService.GetMandatePdfPreview(
          requestId,
          tenantId,
          bankAccountId
        );
      response.setHeader('Content-Type', mimeType);
      response.setHeader(
        'Content-Disposition',
        `attachment; filename="${bankAccountId}-mandate-preview.pdf"`
      );
      response.send(Buffer.from(body));
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Post('mandate')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create a direct debit mandate.',
    externalDocs: {
      description: 'See Wealth Kernel API docs for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/eaad28411e606-create-a-mandate',
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
    description: 'HTTP 201 response.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(Dto.BrokerageUkDirectDebitMandateDto),
        },
        example: {
          partyId: 'string',
          bankAccountId: 'string',
          status: 'Pending',
          id: 'string',
          reference: 'string',
          reason: 'string',
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
  public async CreateDirectDebitMandate(
    @Query('tenantId') tenantId: string,
    @Body() body: Dto.BrokerageUkDirectDebitMandateMutableDto,
    @Decorators.RequestId() requestId: string,
    @Query('idempotencyKey') idempotencyKey?: string
  ): Promise<Dto.BrokerageUkDirectDebitMandateDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateDirectDebitMandate.name,
      requestId
    );
    try {
      return await this.wealthKernelDirectDebitService.Create(
        requestId,
        tenantId,
        body,
        idempotencyKey
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get('mandate/:mandateId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a direct debit mandate by ID.',
    externalDocs: {
      description: 'See Wealth Kernel API docs for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/0da679eb5b5be-retrieve-a-mandate',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiParam({
    name: 'mandateId',
    description: 'The mandate ID.',
    required: true,
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'HTTP 200 response.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(Dto.BrokerageUkDirectDebitMandateDto),
        },
        example: {
          partyId: 'string',
          bankAccountId: 'string',
          status: 'Pending',
          id: 'string',
          reference: 'string',
          reason: 'string',
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
        example: {
          error: 'Error',
          errorCode:
            SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
              .BROKERAGE_DIRECT_DEBIT_MANDATE_NOT_FOUND,
          statusCode: 404,
          message: 'The brokerage direct debit mandate was not found.',
          requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
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
  public async GetDirectDebitMandateById(
    @Param('mandateId') mandateId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<Dto.BrokerageUkDirectDebitMandateDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetDirectDebitMandateById.name,
      requestId
    );
    try {
      return await this.wealthKernelDirectDebitService.Get(
        requestId,
        tenantId,
        mandateId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Post('mandate/:mandateId/actions/cancel')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Cancel a mandate, cancelling all related cancellable subscriptions and payments.',
    externalDocs: {
      description: 'See Wealth Kernel API docs for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/96504a8f4d9d1-cancel-a-mandate',
    },
  })
  @ApiParam({
    name: 'mandateId',
    description: 'The mandate ID.',
    required: true,
    type: 'string',
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 202,
    description: 'HTTP 202 response.',
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
        example: {
          error: 'Error',
          errorCode:
            SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
              .BROKERAGE_DIRECT_DEBIT_MANDATE_NOT_FOUND,
          statusCode: 404,
          message: 'The brokerage direct debit mandate was not found.',
          requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
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
  public async CancelMandateById(
    @Param('mandateId') mandateId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CancelMandateById.name,
      requestId
    );

    try {
      return await this.wealthKernelDirectDebitService.Cancel(
        requestId,
        tenantId,
        mandateId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get('mandate/:mandateId/retrieve-mandate-pdf')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Retrieve a mandate PDF',
    externalDocs: {
      description: 'See Wealth Kernel API docs for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/b24d83c935e6d-retrieve-a-mandate-pdf',
    },
  })
  @ApiParam({
    name: 'mandateId',
    description: 'The mandate ID.',
    required: true,
    type: 'string',
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 200,
    description: 'HTTP 200 response.',
    content: {
      'application/pdf': {
        schema: {
          type: 'file',
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
  public async RetrieveMandatePdf(
    @Param('mandateId') mandateId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string,
    @Res() response: Response
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.RetrieveMandatePdf.name,
      requestId
    );
    try {
      const [body, mimeType] =
        await this.wealthKernelDirectDebitService.RetrieveMandatePdf(
          requestId,
          tenantId,
          mandateId
        );

      response.setHeader('Content-Type', mimeType);
      response.setHeader(
        'Content-Disposition',
        `attachment; filename="${mandateId}-mandate.pdf"`
      );
      response.send(Buffer.from(body));
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get('mandate/:mandateId/next-possible-collection-date')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Gets the next possible collection date for a payment given a mandate ID. ',
    externalDocs: {
      description: 'See Wealth Kernel API docs for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/e29286d4cb5e2-get-next-possible-payment-collection-date',
    },
  })
  @ApiParam({
    name: 'mandateId',
    description: 'The mandate ID.',
    required: true,
    type: 'string',
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 200,
    description: 'HTTP 200 response.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            Dto.BrokerageUkDirectDebitMandateGetNextPossiblePaymentCollectionDateDto
          ),
        },
      },
    },
    type: Dto.BrokerageUkDirectDebitMandateGetNextPossiblePaymentCollectionDateDto,
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
  public async GetNextPossiblePaymentCollectionDate(
    @Param('mandateId') mandateId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<Dto.BrokerageUkDirectDebitMandateGetNextPossiblePaymentCollectionDateDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetNextPossiblePaymentCollectionDate.name,
      requestId
    );
    try {
      return await this.wealthKernelDirectDebitService.GetNextPossiblePaymentCollectionDate(
        requestId,
        tenantId,
        mandateId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Post('payment')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(201)
  @ApiOperation({
    summary: 'Creates a direct debit payment for a given mandate.',
    externalDocs: {
      description: 'See Wealth Kernel API docs for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/8961ed424c0ce-create-a-payment',
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
    description: 'HTTP 201 response.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(Dto.BrokerageUkDirectDebitPaymentResponseDto),
        },
        example: {
          partyId: 'string',
          bankAccountId: 'string',
          status: 'Pending',
          id: 'string',
          reference: 'string',
          reason: 'string',
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
  public async CreateDirectDebitPayment(
    @Query('tenantId') tenantId: string,
    @Body() body: Dto.BrokerageUkDirectDebitPaymentRequestDto,
    @Decorators.RequestId() requestId: string,
    @Query('idempotencyKey') idempotencyKey?: string
  ): Promise<Dto.BrokerageUkDirectDebitPaymentResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateDirectDebitPayment.name,
      requestId
    );
    try {
      return await this.wealthKernelDirectDebitService.CreatePayment(
        requestId,
        tenantId,
        idempotencyKey,
        body
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get('payment')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'List all direct debit payments.',
    externalDocs: {
      description: 'See Wealth Kernel API docs for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/23d3c5a9ca0df-list-payments',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 200,
    description: 'HTTP 200 response.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            Dto.BrokerageUkDirectDebitPaymentListAllResponseDto
          ),
        },
        example: {
          paginationToken: null,
          results: [
            {
              mandateId: 'string',
              portfolioId: 'string',
              subscriptionId: 'string',
              amount: {
                currency: 'GBP',
                amount: 1.14,
              },
              collectionDate: '2019-08-24',
              status: 'Pending',
              createdAt: 'string',
              id: 'string',
              reason: 'string',
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
  public async ListAllDirectDebitPayments(
    @Query('tenantId') tenantId: string,
    @Query()
    queryParams: Dto.BrokerageUkDirectDebitPaymentListAllQueryParamsDto,
    @Decorators.RequestId() requestId: string
  ): Promise<Dto.BrokerageUkDirectDebitPaymentListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListAllDirectDebitPayments.name,
      requestId
    );

    try {
      if ((queryParams as unknown as Record<string, unknown>).tenantId) {
        delete (queryParams as unknown as Record<string, unknown>).tenantId;
      }

      return await this.wealthKernelDirectDebitService.ListPayments(
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
  @Get('payment/:paymentId')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Retrieve a payment by ID',
    externalDocs: {
      description: 'See Wealth Kernel API docs for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/14436296c29fa-retrieve-a-payment',
    },
  })
  @HttpCode(200)
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiParam({
    name: 'paymentId',
    description: 'The payment ID.',
    required: true,
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'HTTP 200 response.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(Dto.BrokerageUkDirectDebitPaymentDto),
        },
        example: {
          mandateId: 'string',
          portfolioId: 'string',
          subscriptionId: 'string',
          amount: {
            currency: 'GBP',
            amount: 1.14,
          },
          collectionDate: '2019-08-24',
          status: 'Pending',
          createdAt: 'string',
          id: 'string',
          reason: 'string',
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
        example: {
          error: 'Error',
          errorCode:
            SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
              .BROKERAGE_DIRECT_DEBIT_MANDATE_NOT_FOUND,
          statusCode: 404,
          message: 'The brokerage direct debit mandate was not found.',
          requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
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
  public async GetDirectDebitPaymentById(
    @Param('paymentId') paymentId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<Dto.BrokerageUkDirectDebitPaymentDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetDirectDebitMandateById.name,
      requestId
    );
    try {
      return await this.wealthKernelDirectDebitService.GetPayment(
        requestId,
        tenantId,
        paymentId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Post('payment/:paymentId/actions/cancel')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Cancels a pending payment.',
    externalDocs: {
      description: 'See Wealth Kernel API docs for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/ccc6c5b397a89-cancel-a-payment',
    },
  })
  @ApiParam({
    name: 'paymentId',
    description: 'The payment ID.',
    required: true,
    type: 'string',
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 202,
    description: 'HTTP 202 response.',
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
        example: {
          error: 'Error',
          errorCode:
            SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
              .BROKERAGE_DIRECT_DEBIT_MANDATE_NOT_FOUND,
          statusCode: 404,
          message: 'The brokerage direct debit mandate was not found.',
          requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
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
  public async CancelPaymentById(
    @Param('paymentId') paymentId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CancelPaymentById.name,
      requestId
    );

    try {
      return await this.wealthKernelDirectDebitService.CancelPayment(
        requestId,
        tenantId,
        paymentId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get('subscription/:subscriptionId')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Retrieve a subscription by ID',
    externalDocs: {
      description: 'See Wealth Kernel API docs for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/fc43e79670eb4-retrieve-a-subscription',
    },
  })
  @HttpCode(200)
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiParam({
    name: 'subscriptionId',
    description: 'The subscription ID.',
    required: true,
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'HTTP 200 response.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(Dto.BrokerageUkDirectDebitGetSubscriptionDto),
        },
        example: {
          mandateId: 'string',
          portfolioId: 'string',
          subscriptionId: 'string',
          amount: {
            currency: 'GBP',
            amount: 1.14,
          },
          collectionDate: '2019-08-24',
          status: 'Pending',
          createdAt: 'string',
          id: 'string',
          reason: 'string',
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
        example: {
          error: 'Error',
          errorCode:
            SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
              .BROKERAGE_DIRECT_DEBIT_MANDATE_NOT_FOUND,
          statusCode: 404,
          message: 'The brokerage direct debit subscription was not found.',
          requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
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
  public async GetSubscriptionById(
    @Param('subscriptionId') subscriptionId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<Dto.BrokerageUkDirectDebitGetSubscriptionDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetSubscriptionById.name,
      requestId
    );
    try {
      return await this.wealthKernelDirectDebitService.GetSubscription(
        requestId,
        tenantId,
        subscriptionId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Post('subscription')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Creates a subscription ',
    externalDocs: {
      description: 'See Wealth Kernel API docs for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/456532a0d5bd1-create-a-subscription',
    },
  })
  @HttpCode(200)
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.IDEMPOTENCY_KEY,
  })
  @ApiResponse({
    status: 201,
    description: 'HTTP 201 response.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(Dto.BrokerageUkDirectDebitGetSubscriptionDto),
        },
        example: {
          mandateId: 'ddm-343lrhsth22c2i',
          portfolioId: 'prt-343lrwxvz22bxq',
          amount: {
            currency: 'GBP',
            amount: 100,
          },
          interval: 'Monthly',
          dayOfMonth: 25,
          startDate: '2021-01-26',
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
  public async CreateSubscription(
    @Query('tenantId') tenantId: string,
    @Body() payload: Dto.BrokerageUkDirectDebitCreateSubscriptionReqDto,
    @Decorators.RequestId() requestId: string,
    @Query('idempotencyKey') idempotencyKey?: string
  ): Promise<Dto.BrokerageUkDirectDebitGetSubscriptionDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateSubscription.name,
      requestId
    );
    try {
      return await this.wealthKernelDirectDebitService.CreateSubscription(
        requestId,
        tenantId,
        idempotencyKey,
        payload
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Patch('subscription/:subscriptionId')
  @ApiOperation({
    summary:
      'Update a susbcription. As of writing, it is currently only possible to update the subscriptions amount',
    externalDocs: {
      description: 'See Wealth Kernel API docs for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/6a19de7951114-update-a-subscription',
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 202,
    description: 'HTTP 202 response.',
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
  public async UpdateSubscription(
    @Query('tenantId') tenantId: string,
    @Param('subscriptionId') subscriptionId: string,
    @Body() payload: Dto.BrokerageUkDirectDebitUpdateSubscriptionDto,
    @Decorators.RequestId() requestId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateSubscription.name,
      requestId
    );

    try {
      return await this.wealthKernelDirectDebitService.UpdateSubscription(
        requestId,
        tenantId,
        subscriptionId,
        payload
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get('subscription')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary:
      'Get a list of subscriptions, filtering by the given query parameters.',
    externalDocs: {
      description: 'See Wealth Kernel API docs for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/9fd1fbc432323-list-subscriptions',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'HTTP 200 response.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            Dto.BrokerageUkDirectDebitSubscriptionListAllResponseDto
          ),
        },
        example: {
          paginationToken: null,
          results: [
            {
              id: 'dds-34a67qfg7362me',
              mandateId: 'ddm-343lrhsth22c2i',
              portfolioId: 'prt-343lrwxvz22bxq',
              amount: {
                currency: 'GBP',
                amount: 100,
              },
              interval: 'Monthly',
              dayOfMonth: 25,
              startDate: '2021-01-26',
              status: 'Active',
              createdAt: '2021-01-21T00:00:00.0000000Z',
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
  public async ListAllSubscriptions(
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string,
    @Query()
    queryParams: Dto.BrokerageUkDirectDebitSubscriptionListAllQueryParamsDto
  ): Promise<Dto.BrokerageUkDirectDebitSubscriptionListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListAllSubscriptions.name,
      requestId
    );
    try {
      if ((queryParams as unknown as Record<string, unknown>).tenantId) {
        delete (queryParams as unknown as Record<string, unknown>).tenantId;
      }
      return await this.wealthKernelDirectDebitService.ListAllSubscriptions(
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
  @Get('subscription/:subscriptionId/upcoming-payments')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Gets up to 10 upcoming payments for a subscription.',
    externalDocs: {
      description: 'See Wealth Kernel API docs for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/9ce5198d6fa32-list-upcoming-payments',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiParam({
    name: 'subscriptionId',
    description: 'The subscription ID.',
    required: true,
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'HTTP 200 response.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            Dto.BrokerageUkDirectDebitUpcomingSubsccriptionDto
          ),
        },
        example: {
          paginationToken: null,
          results: [
            {
              amount: {
                currency: 'GBP',
                amount: 1.14,
              },
              collectionDate: 'string',
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
  public async ListUpcomingSubscription(
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string,
    @Param('subscriptionId') subscriptionId: string
  ): Promise<Dto.BrokerageUkDirectDebitUpcomingSubsccriptionDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListUpcomingSubscription.name,
      requestId
    );

    try {
      return await this.wealthKernelDirectDebitService.ListUpcomingSubscription(
        requestId,
        tenantId,
        subscriptionId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Post('subscription/:subscriptionId/actions/pause')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary:
      'Pause a subscription, preventing further payments until it is resumed.',
    externalDocs: {
      description: 'See Wealth Kernel API docs for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/f3e2878738a2c-pause-a-subscription',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiParam({
    name: 'subscriptionId',
    description: 'The subscription ID.',
    required: true,
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'HTTP 202 response.',
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
  public async PauseSubscription(
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string,
    @Param('subscriptionId') subscriptionId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.PauseSubscription.name,
      requestId
    );

    try {
      return await this.wealthKernelDirectDebitService.PauseSubscription(
        requestId,
        tenantId,
        subscriptionId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Post('subscription/:subscriptionId/actions/resume')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary:
      'Resume a paused subscription, allowing further payments to be taken.',
    externalDocs: {
      description: 'See Wealth Kernel API docs for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/56fcf3919126e-resume-a-subscription',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiParam({
    name: 'subscriptionId',
    description: 'The subscription ID.',
    required: true,
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'HTTP 202 response.',
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
  public async ResumeSubscription(
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string,
    @Param('subscriptionId') subscriptionId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ResumeSubscription.name,
      requestId
    );

    try {
      return await this.wealthKernelDirectDebitService.ResumeSubscription(
        requestId,
        tenantId,
        subscriptionId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Post('subscription/:subscriptionId/actions/cancel')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary:
      'Cancel a subscription so that no further payments will be taken. A new subscription must be created if you wish to resume taking payments.',
    externalDocs: {
      description: 'See Wealth Kernel API docs for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/08028a1600662-cancel-a-subscription',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiParam({
    name: 'subscriptionId',
    description: 'The subscription ID.',
    required: true,
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'HTTP 202 response.',
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
  public async CancelSubscription(
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string,
    @Param('subscriptionId') subscriptionId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CancelSubscription.name,
      requestId
    );

    try {
      return await this.wealthKernelDirectDebitService.CancelSubscription(
        requestId,
        tenantId,
        subscriptionId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }
}
