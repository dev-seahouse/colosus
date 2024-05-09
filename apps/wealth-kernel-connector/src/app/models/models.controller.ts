import {
  BrokerageIntegrationModelsDomainBaseService,
  BrokerageIntegrationModelsDomainServiceLocator,
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
import { SWAGGER } from '../../constants';
import * as Dto from './dto';

@ApiTags('Model Portfolios')
@ApiExtraModels(
  CommonSwaggerDto.SwaggerColossusHttpErrorDto,
  Dto.BrokerageIntegrationModelPortfolioDto,
  Dto.BrokerageIntegrationModelPortfolioComponentDto,
  Dto.BrokerageIntegrationModelPortfolioDtoListAllQueryParamsDto,
  Dto.BrokerageIntegrationModelPortfolioDtoListAllResponseDto
)
@Controller('model-portfolios')
export class ModelsController {
  private readonly logger = new Logger(ModelsController.name);

  constructor(
    private readonly modelsDomainServiceLocator: BrokerageIntegrationModelsDomainServiceLocator
  ) {}

  private get wealthKernelModelsDomainService(): BrokerageIntegrationModelsDomainBaseService {
    return this.modelsDomainServiceLocator.GetService(
      SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
    );
  }

  @Version('1')
  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'List all model portfolios',
    externalDocs: {
      description: 'See the Swagger documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/ab0d486a6b8fa-list-models',
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
            Dto.BrokerageIntegrationModelPortfolioDtoListAllResponseDto
          ),
        },
        example: {
          paginationToken: null,
          results: [
            {
              id: 'mdl-1',
              name: 'Conservative Model',
              description: 'Mostly bonds',
              components: [
                {
                  isin: 'IE00B95W7137',
                  weight: 0.75,
                },
                {
                  isin: 'GB00BZ82ZT69',
                  weight: 0.25,
                },
              ],
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
  public async ListAllModelPortfolios(
    @Query('tenantId') tenantId: string,
    @Query()
    queryParams: Dto.BrokerageIntegrationModelPortfolioDtoListAllQueryParamsDto,
    @Decorators.RequestId() requestId: string
  ): Promise<Dto.BrokerageIntegrationModelPortfolioDtoListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListAllModelPortfolios.name,
      requestId
    );

    try {
      // I messed up with the query params design, so this is a hack to get around it
      if ((queryParams as unknown as Record<string, unknown>).tenantId) {
        delete (queryParams as unknown as Record<string, unknown>).tenantId;
      }

      return await this.wealthKernelModelsDomainService.List(
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
  @Get(':modelPortfolioId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a model portfolio',
    externalDocs: {
      description: 'See the Swagger documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/e64f01e09ce5a-retrieve-a-model',
    },
  })
  @ApiParam({
    name: 'modelPortfolioId',
    description: 'The model portfolio ID.',
    required: true,
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
          $ref: getSchemaPath(Dto.BrokerageIntegrationModelPortfolioDto),
        },
        example: {
          id: 'mdl-1',
          name: 'Conservative Model',
          description: 'Mostly bonds',
          components: [
            {
              isin: 'IE00B95W7137',
              weight: 0.75,
            },
            {
              isin: 'GB00BZ82ZT69',
              weight: 0.25,
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
                  .BROKERAGE_MODEL_PORTFOLIO_NOT_FOUND,
              statusCode: 404,
              message: 'The brokerage model portfolio was not found.',
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
  public async GetModelPortfolio(
    @Param('modelPortfolioId') modelPortfolioId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<Dto.BrokerageIntegrationModelPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetModelPortfolio.name,
      requestId
    );

    try {
      return await this.wealthKernelModelsDomainService.Get(
        requestId,
        tenantId,
        modelPortfolioId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }
}
