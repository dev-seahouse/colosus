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

@ApiTags(API_TAGS.ADDRESSES.name)
@ApiExtraModels(
  CommonSwaggerDto.SwaggerColossusHttpErrorDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationListAllQueryParamsBaseDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationListAllPartiesQueryParamsDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationPartyDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationPartyAnnualIncomeDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationPartyIdentifierDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationListAllPartiesResponseDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationPartyCreationDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationPartyUpdateDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressCreationDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressListAllResponseDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressListAllParamsDto
)
@Controller('addresses')
export class AddressesController {
  private readonly logger = new Logger(AddressesController.name);

  constructor(
    private readonly partiesServiceLocator: BrokerageIntegrationPartiesDomainServiceLocator
  ) {}

  @Version('1')
  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Lists all addresses.',
    externalDocs: {
      description: 'See the Wealth Kernel API documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/d29ebd35ee47f-list-addresses',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 200,
    description: 'HTTP 200 response(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressListAllResponseDto
          ),
        },
        examples: {
          LIST: {
            value: {
              paginationToken: 'eyJ0ZXJtIiA6ICJ0ZXN0In0=',
              results: [
                {
                  partyId: 'pty-33wdl3qcd24aii',
                  clientReference: '48jgfn4f834y',
                  line1: 'Main Street',
                  line2: null,
                  line3: null,
                  city: 'Metropolis',
                  region: null,
                  postalCode: 'M1 1AA',
                  countryCode: 'GB',
                  startDate: null,
                  endDate: null,
                  addedAt: '2021-01-18T09:26:5493074Z',
                },
              ],
            },
          },
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
  public async ListAllAddresses(
    @Query('tenantId') tenantId: string,
    @Query()
    queryParams: BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressListAllParamsDto,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListAllAddresses.name,
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

      return await domain.ListAddresses(requestId, tenantId, queryParams);
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get(':addressId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Gets an address.',
    externalDocs: {
      description: 'See the Wealth Kernel API documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/bda76f2493a32-retrieve-an-address',
    },
  })
  @ApiParam({
    name: 'addressId',
    description: 'The addressId of the address to get.',
    type: 'string',
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 200,
    description: 'HTTP 200 response(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressDto
          ),
        },
        example: {
          partyId: 'pty-33wdl3qcd24aii',
          clientReference: '48jgfn4f834y',
          line1: 'Main Street',
          line2: null,
          line3: null,
          city: 'Metropolis',
          region: null,
          postalCode: 'M1 1AA',
          countryCode: 'GB',
          startDate: null,
          endDate: null,
          addedAt: '2021-01-18T09:26:5493074Z',
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
    description: '404 400 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          TENANT_PARTY_ADDRESS_NOT_FOUND: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .TENANT_PARTY_ADDRESS_NOT_FOUND,
              statusCode: 404,
              message: 'The address was not found.',
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
  public async GetAddressByAddressId(
    @Param('addressId') addressId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetAddressByAddressId.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.GetAddressByAddressId(requestId, tenantId, addressId);
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
    summary: 'Creates an address for a party.',
    externalDocs: {
      description: 'See the Wealth Kernel API documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/f8f864c896174-add-an-address',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.IDEMPOTENCY_KEY,
  })
  @ApiBody({
    description: 'The address to create.',
    type: BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressCreationDto,
    examples: {
      ADDRESS_TO_CREATE: {
        value: {
          partyId: 'pty-33wdlwrpd23vji',
          clientReference: '5gj85gnkfgd',
          line1: '44 St Martins Road',
          line2: null,
          line3: null,
          city: 'Ponders End',
          region: null,
          postalCode: 'EN3 8PH',
          countryCode: 'GB',
          startDate: null,
          endDate: null,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'HTTP 201 response(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressDto
          ),
        },
        example: {
          partyId: 'pty-33wdl3qcd24aii',
          clientReference: '48jgfn4f834y',
          line1: 'Main Street',
          line2: null,
          line3: null,
          city: 'Metropolis',
          region: null,
          postalCode: 'M1 1AA',
          countryCode: 'GB',
          startDate: null,
          endDate: null,
          addedAt: '2021-01-18T09:26:5493074Z',
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
  public async CreateAddress(
    @Query('tenantId') tenantId: string,
    @Body()
    payload: BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressCreationDto,
    @Decorators.RequestId() requestId: string,
    @Query('idempotencyKey') idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateAddress.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.CreateAddress(
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
  @Put(':addressId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Updates an address for a party.',
    externalDocs: {
      description: 'See the Wealth Kernel API documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/6085c01400864-update-an-address',
    },
  })
  @ApiParam({
    type: 'string',
    name: 'addressId',
    description: 'The addressId of the address to update.',
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiBody({
    description: 'The address to update.',
    type: BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressCreationDto,
    examples: {
      ADDRESS_TO_CREATE: {
        value: {
          partyId: 'pty-33wdlwrpd23vji',
          clientReference: '5gj85gnkfgd',
          line1: '44 St Martins Road',
          line2: null,
          line3: null,
          city: 'Ponders End',
          region: null,
          postalCode: 'EN3 8PH',
          countryCode: 'GB',
          startDate: null,
          endDate: null,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'HTTP 200 response(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressDto
          ),
        },
        example: {
          partyId: 'pty-33wdl3qcd24aii',
          clientReference: '48jgfn4f834y',
          line1: 'Main Street',
          line2: null,
          line3: null,
          city: 'Metropolis',
          region: null,
          postalCode: 'M1 1AA',
          countryCode: 'GB',
          startDate: null,
          endDate: null,
          addedAt: '2021-01-18T09:26:5493074Z',
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
  public async UpdateAddressByAddressId(
    @Param('addressId') addressId: string,
    @Query('tenantId') tenantId: string,
    @Body()
    payload: BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressCreationDto,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateAddressByAddressId.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.UpdateAddressByAddressId(
        requestId,
        tenantId,
        addressId,
        payload
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }
}
