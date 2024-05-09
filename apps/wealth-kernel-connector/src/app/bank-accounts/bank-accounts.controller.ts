import { BrokerageIntegrationPartiesDomainServiceLocator } from '@bambu/server-core/domains';
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
import * as Dto from './dto';

@ApiTags(API_TAGS.BANK_ACCOUNTS.name)
@ApiExtraModels(
  CommonSwaggerDto.SwaggerColossusHttpErrorDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountMutableDto,
  Dto.BrokerageIntegrationBankAccountListAllQueryParamsDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountListAllResponseDto
)
@Controller('bank-accounts')
export class BankAccountsController {
  private readonly logger = new Logger(BankAccountsController.name);

  constructor(
    private readonly partiesServiceLocator: BrokerageIntegrationPartiesDomainServiceLocator
  ) {}

  @Version('1')
  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'List all bank accounts.',
    externalDocs: {
      description: 'See the Wealth Kernel API documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/0d106a6ed6c61-list-bank-accounts',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 200,
    description: 'The list of bank accounts.',
    type: BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountListAllResponseDto,
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountListAllResponseDto
          ),
        },
        example: {
          paginationToken: null,
          results: [
            {
              id: 'bnk-33wdqmffe22aq6',
              clientReference: '84uu3nj848',
              partyId: 'pty-33wdqlvlg23uwg',
              name: 'Joe Bloggs',
              accountNumber: '12345678',
              sortCode: '11-22-33',
              currency: 'GBP',
              countryCode: 'GB',
              status: 'Active',
              activatedAt: '2021-01-16T13:14:15.123456Z',
              deactivatedAt: null,
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
  public async ListBankAccounts(
    @Query('tenantId') tenantId: string,
    @Query()
    queryParams: Dto.BrokerageIntegrationBankAccountListAllQueryParamsDto,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListBankAccounts.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      // I messed up with the query params design, so this is a hack to get around it
      if ((queryParams as unknown as Record<string, unknown>).tenantId) {
        delete (queryParams as unknown as Record<string, unknown>).tenantId;
      }

      return await domain.ListBankAccounts(requestId, tenantId, queryParams);
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get(':bankAccountId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a bank account.',
    externalDocs: {
      description: 'See the Wealth Kernel API documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/39200eddf971c-retrieve-a-bank-account',
    },
  })
  @ApiParam({
    type: 'string',
    name: 'bankAccountId',
    description: 'The bank account ID.',
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 200,
    description: 'The bank account.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountDto
          ),
        },
        example: {
          id: 'bnk-33wdqmffe22aq6',
          clientReference: '84uu3nj848',
          partyId: 'pty-33wdqlvlg23uwg',
          name: 'Joe Bloggs',
          accountNumber: '12345678',
          sortCode: '11-22-33',
          currency: 'GBP',
          countryCode: 'GB',
          status: 'Active',
          activatedAt: '2021-01-16T13:14:15.123456Z',
          deactivatedAt: null,
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
          BANK_ACCOUNT_NOT_FOUND: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .BANK_ACCOUNT_NOT_FOUND,
              statusCode: 404,
              message: 'The bank account was not found.',
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
  public async GetBankAccount(
    @Param('bankAccountId') bankAccountId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBankAccount.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.GetBankAccount(requestId, tenantId, bankAccountId);
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Post('')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create a bank account.',
    externalDocs: {
      description: 'See the Wealth Kernel API documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/c160c7348e5b1-add-a-bank-account',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.IDEMPOTENCY_KEY,
  })
  @ApiBody({
    type: BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountMutableDto,
    description: 'The bank account to create.',
    required: true,
    examples: {
      BANK_ACCOUNT_TO_CREATE: {
        value: {
          partyId: 'pty-33wds6i4i242wc',
          clientReference: '1944a59713',
          name: 'Clark Kent',
          accountNumber: '55779911',
          sortCode: '20-00-00',
          currency: 'GBP',
          countryCode: 'GB',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The bank account.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountDto
          ),
        },
        example: {
          id: 'bnk-33wdqmffe22aq6',
          clientReference: '84uu3nj848',
          partyId: 'pty-33wdqlvlg23uwg',
          name: 'Joe Bloggs',
          accountNumber: '12345678',
          sortCode: '11-22-33',
          currency: 'GBP',
          countryCode: 'GB',
          status: 'Active',
          activatedAt: '2021-01-16T13:14:15.123456Z',
          deactivatedAt: null,
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
  public async CreateBankAccount(
    @Query('tenantId') tenantId: string,
    @Body()
    payload: BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountMutableDto,
    @Decorators.RequestId() requestId: string,
    @Query('idempotencyKey') idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateBankAccount.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.CreateBankAccount(
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
  @Post(':bankAccountId/actions/deactivate')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(204)
  @ApiOperation({
    summary: 'Create a bank account.',
    externalDocs: {
      description: 'See the Wealth Kernel API documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/c9e21bb79b4af-deactivate-a-bank-account',
    },
  })
  @ApiParam({
    type: 'string',
    name: 'bankAccountId',
    description: 'The bank account ID.',
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
          BANK_ACCOUNT_NOT_FOUND: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .BANK_ACCOUNT_NOT_FOUND,
              statusCode: 404,
              message: 'The bank account was not found.',
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
  public async DeactivateBankAccount(
    @Param('bankAccountId') bankAccountId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.DeactivateBankAccount.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.DeactivateBankAccount(
        requestId,
        tenantId,
        bankAccountId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }
}
