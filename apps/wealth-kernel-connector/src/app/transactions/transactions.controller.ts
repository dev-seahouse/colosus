import {
  BrokerageIntegrationTransactionsDomainBaseService,
  BrokerageIntegrationTransactionsDomainServiceLocator,
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
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Query,
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
import { API_TAGS, SWAGGER } from '../../constants';

@ApiTags(API_TAGS.TRANSACTIONS.name)
@ApiExtraModels(
  CommonSwaggerDto.SwaggerColossusHttpErrorDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationTransactionsListAllResponseDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationTransactionsListAllQueryParamsDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationTransactionDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationTransactionPriceDto
)
@Controller('transactions')
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);

  constructor(
    private readonly brokerageIntegrationTransactionsDomainServiceLocator: BrokerageIntegrationTransactionsDomainServiceLocator
  ) {}

  private get wealthKernelTransactionsDomainService(): BrokerageIntegrationTransactionsDomainBaseService {
    return this.brokerageIntegrationTransactionsDomainServiceLocator.GetService(
      SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
    );
  }

  @Version('1')
  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'List all transactions.',
    description: `List all transactions.`,
    externalDocs: {
      description: 'Wealth Kernel documentation.',
      url: 'https://docs.wealthkernel.com/docs/api/894693cb0c149-list-transactions',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 200,
    description: 'List all transactions.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            BrokerageIntegrationServerDto.BrokerageIntegrationTransactionsListAllResponseDto
          ),
        },
        example: {
          paginationToken: null,
          results: [
            {
              portfolioId: 'prt-32q2deogu225ps',
              isin: 'GB0030029069',
              type: 'Buy',
              status: 'Settled',
              price: {
                currency: 'GBP',
                amount: 0.8628,
              },
              quantity: 91.216,
              consideration: {
                currency: 'GBP',
                amount: 78.7,
              },
              charges: {
                currency: 'GBP',
                amount: 0,
              },
              date: '2019-10-08',
              timestamp: '2019-10-08T13:55:16.4237925Z',
              settledOn: '2019-10-08',
              updatedAt: '2019-10-08T13:55:16.4237925Z',
              bookCost: null,
              id: 'txn-32q2m7mwn264vg',
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
  private async ListAllTransactions(
    @Query('tenantId') tenantId: string,
    @Query()
    queryParams: BrokerageIntegrationServerDto.BrokerageIntegrationTransactionsListAllQueryParamsDto,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationTransactionsListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListAllTransactions.name,
      requestId
    );
    try {
      // I messed up with the query params design, so this is a hack to get around it
      if ((queryParams as unknown as Record<string, unknown>).tenantId) {
        delete (queryParams as unknown as Record<string, unknown>).tenantId;
      }

      return await this.wealthKernelTransactionsDomainService.List(
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
  @Get(':transactionId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get transaction.',
    description: `Get transaction.`,
    externalDocs: {
      description: 'Wealth Kernel documentation.',
      url: 'https://docs.wealthkernel.com/docs/api/946020ab6d58b-retrieve-a-transaction',
    },
  })
  @ApiParam({
    name: 'transactionId',
    description: 'Transaction ID.',
    required: true,
    type: 'string',
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 200,
    description: 'Get transaction.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            BrokerageIntegrationServerDto.BrokerageIntegrationTransactionDto
          ),
        },
        example: {
          id: 'txn-32q2m7mwn264vg',
          portfolioId: 'prt-32q2deogu225ps',
          isin: 'GB0030029069',
          type: 'Buy',
          status: 'Settled',
          price: {
            currency: 'GBP',
            amount: 0.8628,
          },
          quantity: 91.216,
          consideration: {
            currency: 'GBP',
            amount: 78.7,
          },
          charges: {
            currency: 'GBP',
            amount: 0,
          },
          date: '2019-10-08',
          timestamp: '2019-10-08T13:55:16.4237925Z',
          settledOn: '2019-10-08',
          updatedAt: '2019-10-08T13:55:16.4237925Z',
          bookCost: null,
        },
      },
    },
  })
  public async GetTransaction(
    @Param('transactionId') transactionId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationTransactionDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetTransaction.name,
      requestId
    );
    try {
      return await this.wealthKernelTransactionsDomainService.Get(
        requestId,
        tenantId,
        transactionId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }
}
