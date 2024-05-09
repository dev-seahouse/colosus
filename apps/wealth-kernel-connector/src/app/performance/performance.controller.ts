import {
  BrokerageIntegrationPerformanceDomainBaseService,
  BrokerageIntegrationPerformanceDomainServiceLocator,
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

@ApiTags(API_TAGS.PERFORMANCE.name)
@ApiExtraModels(
  CommonSwaggerDto.SwaggerColossusHttpErrorDto,
  Dto.BrokerageIntegrationPerformanceDto,
  Dto.BrokerageIntegrationListAllPerformanceQueryResponseDto,
  Dto.BrokerageIntegrationListAllPerformanceQueryParamsDto
)
@Controller('performance')
export class PerformanceController {
  private readonly logger: Logger = new Logger(PerformanceController.name);

  constructor(
    private readonly brokerageIntegrationPerformanceDomainServiceLocator: BrokerageIntegrationPerformanceDomainServiceLocator
  ) {}

  private get wealthKernelPerformanceDomainService(): BrokerageIntegrationPerformanceDomainBaseService {
    return this.brokerageIntegrationPerformanceDomainServiceLocator.GetService(
      SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
    );
  }

  @Version('1')
  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'List all performance metrics',
    description: 'List all performance metrics',
    externalDocs: {
      description: 'See the Wealth Kernel documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/0f8fd3266d77a-list-performance',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 200,
    description: 'List all performance metrics',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            Dto.BrokerageIntegrationListAllPerformanceQueryResponseDto
          ),
        },
        example: {
          paginationToken: null,
          results: [
            {
              portfolioId: 'prt-33rbgbwny22bfk',
              startDate: '2020-01-01',
              endDate: '2020-01-02',
              startValue: 10000,
              endValue: 10001.46,
              accruedFees: 0.24,
              netPerformance: 0.075,
              grossPerformance: 0.08,
              currency: 'GBP',
              calculatedAt: '2020-01-02T12:00:00.12345678Z',
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
  public async ListAllPerformanceMetrics(
    @Query('tenantId') tenantId: string,
    @Query()
    queryParams: Dto.BrokerageIntegrationListAllPerformanceQueryParamsDto,
    @Decorators.RequestId() requestId: string
  ): Promise<Dto.BrokerageIntegrationListAllPerformanceQueryResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListAllPerformanceMetrics.name,
      requestId
    );
    try {
      // I messed up with the query params design, so this is a hack to get around it
      if ((queryParams as unknown as Record<string, unknown>).tenantId) {
        delete (queryParams as unknown as Record<string, unknown>).tenantId;
      }

      return this.wealthKernelPerformanceDomainService.List(
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
