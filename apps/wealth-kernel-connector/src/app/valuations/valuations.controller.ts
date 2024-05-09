import {
  BrokerageIntegrationValuationsDomainBaseService,
  BrokerageIntegrationValuationsDomainServiceLocator,
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
  Query,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { API_TAGS, SWAGGER } from '../../constants';
import * as Dto from './dto';

@ApiTags(API_TAGS.VALUATIONS.name)
@ApiExtraModels(
  CommonSwaggerDto.SwaggerColossusHttpErrorDto,
  Dto.BrokerageIntegrationValuationDto,
  Dto.CashValuationDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationMoneyDto,
  Dto.HoldingValuationDto,
  Dto.BrokerageIntegrationValuationListAllResponseDto,
  Dto.BrokerageIntegrationValuationListAllQueryParamsDto
)
@Controller('valuations')
export class ValuationsController {
  private readonly logger = new Logger(ValuationsController.name);

  constructor(
    private readonly brokerageIntegrationValuationsDomainServiceLocator: BrokerageIntegrationValuationsDomainServiceLocator
  ) {}

  private get wealthKernelValuationsDomainService(): BrokerageIntegrationValuationsDomainBaseService {
    return this.brokerageIntegrationValuationsDomainServiceLocator.GetService(
      SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
    );
  }

  @Version('1')
  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'List all valuations',
    externalDocs: {
      description: 'See the Wealth Kernel documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/7a95a1e412e83-list-valuations',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 200,
    description: 'The valuations were successfully retrieved.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            Dto.BrokerageIntegrationValuationListAllResponseDto
          ),
        },
        example: {
          paginationToken: null,
          results: [
            {
              portfolioId: 'prt-32q2deogu225ps',
              date: '2019-10-08',
              value: {
                currency: 'GBP',
                amount: 87.87,
              },
              cash: [
                {
                  currency: 'GBP',
                  value: {
                    currency: 'GBP',
                    amount: 9.17,
                  },
                  amount: {
                    currency: 'GBP',
                    amount: 9.17,
                  },
                  fxRate: 1,
                },
              ],
              holdings: [
                {
                  isin: 'GB0030029069',
                  quantity: 91.216,
                  price: {
                    currency: 'GBP',
                    amount: 0.8628,
                  },
                  value: {
                    currency: 'GBP',
                    amount: 78.7,
                  },
                  fxRate: 1,
                },
              ],
              changedAt: '2019-10-08T13:55:42.37925Z',
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
  public async ListAllValuations(
    @Query('tenantId') tenantId: string,
    @Query()
    queryParams: Dto.BrokerageIntegrationValuationListAllQueryParamsDto,
    @Decorators.RequestId() requestId: string
  ): Promise<Dto.BrokerageIntegrationValuationListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListAllValuations.name,
      requestId
    );

    try {
      // I messed up with the query params design, so this is a hack to get around it
      if ((queryParams as unknown as Record<string, unknown>).tenantId) {
        delete (queryParams as unknown as Record<string, unknown>).tenantId;
      }

      return await this.wealthKernelValuationsDomainService.List(
        requestId,
        tenantId,
        queryParams
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }
}
