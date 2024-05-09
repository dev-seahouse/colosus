import { BrokerageIntegrationAuthenticationDomainServiceLocator } from '@bambu/server-core/domains';
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
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import * as ApiDto from './dto';

@ApiTags('Authentication')
@ApiExtraModels(
  CommonSwaggerDto.SwaggerColossusHttpErrorDto,
  ApiDto.BrokerageAuthenticationTokenDto
)
@Controller('authentication')
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);

  constructor(
    private readonly authenticationServiceLocator: BrokerageIntegrationAuthenticationDomainServiceLocator
  ) {}

  @Version('1')
  @Get('token')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Gets the current token of the tenant via the tenantId',
  })
  @ApiQuery({
    name: 'tenant_id',
    type: 'string',
    example: '3a6f139e-6796-44e6-93d1-9425999cb014',
  })
  @ApiResponse({
    status: 200,
    type: ApiDto.BrokerageAuthenticationTokenDto,
    description: 'The token has been successfully updated/created.',
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
          TOKEN_NOT_FOUND: {
            summary: 'Error when token is not found.',
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .AUTHENTICATION_TOKEN_MISSING,
              statusCode: 404,
              message:
                'Token not found for tenantId: 3a6f139e-6796-44e6-93d1-9425999cb014.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  public async CheckCurrentToken(
    @Query('tenant_id') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<ApiDto.BrokerageAuthenticationTokenDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CheckCurrentToken.name,
      requestId
    );
    try {
      const targetService = this.authenticationServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      const result = await targetService.GetAuthenticationTokenFromCache(
        requestId,
        tenantId
      );

      if (result) {
        return result;
      }

      // noinspection ExceptionCaughtLocallyJS
      throw new ErrorUtils.ColossusError(
        `Token not found for tenantId: ${tenantId}.`,
        requestId,
        null,
        404,
        SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum.AUTHENTICATION_TOKEN_MISSING
      );
    } catch (error) {
      if (error instanceof ErrorUtils.ColossusError) {
        if (error.statusCode === 404) {
          this.logger.log(
            [
              `${logPrefix} Token not found for tenantId: ${tenantId}.`,
              `This is likely due to it being expired or has been flushed from the cache.`,
            ].join(' ')
          );
        }
      } else {
        this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      }

      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Post('token')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(201)
  @ApiOperation({
    summary: 'Updates/creates token of the tenant via the tenantId',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tenantId: {
          type: 'string',
          format: 'uuid',
          example: '3a6f139e-6796-44e6-93d1-9425999cb014',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    type: ApiDto.BrokerageAuthenticationTokenDto,
    description: 'The token has been successfully updated/created.',
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
  public async InitializeToken(
    @Body() body: { tenantId: string },
    @Decorators.RequestId() requestId: string
  ): Promise<ApiDto.BrokerageAuthenticationTokenDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CheckCurrentToken.name,
      requestId
    );

    try {
      const targetService = this.authenticationServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      const result = await targetService.InitializeAuthenticationToken(
        requestId,
        body.tenantId
      );

      return result as ApiDto.BrokerageAuthenticationTokenDto;
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get('tenants')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Gets the tenant ids for the brokerage.',
  })
  @ApiQuery({
    name: 'page_index',
    type: 'number',
    example: 0,
    description:
      'The page index to retrieve. This is a zero based index. Defaults to 0.',
  })
  @ApiQuery({
    name: 'page_size',
    example: 100,
    type: 'number',
    description: 'The page size to retrieve. Defaults to 100.',
  })
  @ApiResponse({
    status: 200,
    description: 'The tenant ids have been successfully retrieved.',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          description: 'The tenant ids for the brokerage.',
          items: {
            type: 'string',
            description: 'The tenant id.',
          },
        },
        examples: {
          SUCCESS: {
            value: [
              'e936fb88-7779-4843-9ad0-e906e4cef559',
              '8c496523-1f18-4f40-9d6e-adb6903326c0',
              'c1f400b5-6aeb-48fa-a38e-c1f30cf716de',
              'abad23f7-73cf-4279-9946-9ee5183c7911',
              '8afb134d-d775-4cc5-ba19-379cf987dc34',
              '5411b51d-0b77-4f90-9c24-b90a97195e6b',
              '4eac9ec3-dcc7-4776-99b4-d3fc7503bf2b',
              'c0161bdc-941e-4950-a442-da33bd9e0d8e',
              '0f1c8a46-9131-4eb1-b9c3-5261f2b46a01',
            ],
          },
        },
      },
    },
  })
  public async GetTenantIdsForBrokerage(
    @Query('page_index', new ParseIntPipe()) pageIndex: number,
    @Query('page_size', new ParseIntPipe()) pageSize: number,
    @Decorators.RequestId() requestId: string
  ): Promise<string[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetTenantIdsForBrokerage.name,
      requestId
    );

    try {
      const targetService = this.authenticationServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await targetService.GetTenantIdsForBrokerage(requestId, {
        pageSize,
        pageIndex,
      });
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }
}
