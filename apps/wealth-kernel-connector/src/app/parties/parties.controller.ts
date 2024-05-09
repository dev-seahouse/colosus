import {
  BrokerageIntegrationAccountsDomainServiceLocator,
  BrokerageIntegrationPartiesDomainServiceLocator,
  BrokerageIntegrationPortfoliosDomainServiceLocator,
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
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Patch,
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
import { SWAGGER } from '../../constants';
import * as BrokerageAccountDto from '../accounts/dto';
import * as BankAccountsDto from '../bank-accounts/dto';
import * as PortfoliosDto from '../portfolios/dto';
import * as ValuationsDto from '../valuations/dto';

@ApiTags('Parties')
@ApiExtraModels(
  CommonSwaggerDto.SwaggerColossusHttpErrorDto,
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
  BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressListAllParamsDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountMutableDto,
  BankAccountsDto.BrokerageIntegrationBankAccountListAllQueryParamsDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountListAllResponseDto,
  PortfoliosDto.MandateDto,
  PortfoliosDto.BrokerageIntegrationPortfolioMutableDto,
  PortfoliosDto.BrokerageIntegrationPortfolioDto,
  PortfoliosDto.BrokerageIntegrationListAllPortfoliosResponseDto,
  PortfoliosDto.BrokerageIntegrationListAllPortfoliosQueryParamsDto,
  ValuationsDto.BrokerageIntegrationValuationListAllResponseDto
)
@Controller('parties')
export class PartiesController {
  private readonly logger = new Logger(PartiesController.name);

  constructor(
    private readonly partiesServiceLocator: BrokerageIntegrationPartiesDomainServiceLocator,
    private readonly brokerageAccountsServiceLocator: BrokerageIntegrationAccountsDomainServiceLocator,
    private readonly brokeragePortfoliosDomainServiceLocator: BrokerageIntegrationPortfoliosDomainServiceLocator,
    private readonly brokerageValuationsDomainServiceLocator: BrokerageIntegrationValuationsDomainServiceLocator
  ) {}

  private get brokeragePortfoliosDomainService() {
    return this.brokeragePortfoliosDomainServiceLocator.GetService(
      SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
    );
  }

  private get brokerageValuationsDomainService() {
    return this.brokerageValuationsDomainServiceLocator.GetService(
      SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
    );
  }

  @Version('1')
  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Gets all parties for the tenant via the tenantId',
  })
  @ApiResponse({
    status: 200,
    description: 'HTTP 200 response(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            BrokerageIntegrationServerDto.BrokerageIntegrationListAllPartiesResponseDto
          ),
        },
        examples: {
          PARTIES_FOUND: {
            value: {
              paginationToken: null,
              results: [
                {
                  id: 'pty-33wdw7ju423n2m',
                  type: 'Person',
                  clientReference: '4t9j5g8n5',
                  identifiers: [
                    {
                      id: 'ide-33buv2rf725olk',
                      issuer: 'GB',
                      type: 'NINO',
                      value: 'QQ123456A',
                    },
                  ],
                  addedAt: '2021-01-01T18:42:8712345Z',
                  title: 'Miss',
                  forename: 'Sarah',
                  middlename: 'Parker',
                  surname: 'Holland',
                  previousSurname: null,
                  countryOfBirth: 'GB',
                  emailAddress: 'sarah.p.holland@example.com',
                  telephoneNumber: '+447700654321',
                  dateOfBirth: '1991-06-01',
                  dateOfDeath: null,
                  taxResidencies: ['GB'],
                  nationalities: ['GB'],
                  employmentStatus: 'FullTime',
                  industry: 'AgricultureForestryAndFishing',
                  sourcesOfWealth: ['Salary', 'Inheritance'],
                  annualIncome: {
                    currency: 'GBP',
                    amount: 30000,
                  },
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
  public async GetAllParties(
    @Query()
    queryParams: BrokerageIntegrationServerDto.BrokerageIntegrationListAllPartiesQueryParamsDto,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationListAllPartiesResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetAllParties.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      const { tenantId } = queryParams;
      const domainQueryParams = { ...queryParams };
      delete domainQueryParams.tenantId;

      return await domain.ListAvailableParties(
        requestId,
        tenantId,
        domainQueryParams
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get(':partyId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Gets a party by the partyId.',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to get.',
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
            BrokerageIntegrationServerDto.BrokerageIntegrationPartyDto
          ),
        },
        examples: {
          PARTY_FOUND: {
            value: {
              id: 'pty-33wdw7ju423n2m',
              type: 'Person',
              clientReference: '4t9j5g8n5',
              identifiers: [
                {
                  id: 'ide-33buv2rf725olk',
                  issuer: 'GB',
                  type: 'NINO',
                  value: 'QQ123456A',
                },
              ],
              addedAt: '2021-01-01T18:42:8712345Z',
              title: 'Miss',
              forename: 'Sarah',
              middlename: 'Parker',
              surname: 'Holland',
              previousSurname: null,
              countryOfBirth: 'GB',
              emailAddress: 'sarah.p.holland@example.com',
              telephoneNumber: '+447700654321',
              dateOfBirth: '1991-06-01',
              dateOfDeath: null,
              taxResidencies: ['GB'],
              nationalities: ['GB'],
              employmentStatus: 'FullTime',
              industry: 'AgricultureForestryAndFishing',
              sourcesOfWealth: ['Salary', 'Inheritance'],
              annualIncome: {
                currency: 'GBP',
                amount: 30000,
              },
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
    status: 404,
    description: 'HTTP 404 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          TENANT_PARTY_NOT_FOUND: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .TENANT_PARTY_NOT_FOUND,
              statusCode: 400,
              message: 'Party not found.',
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
  public async GetPartyById(
    @Param('partyId') partyId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetPartyById.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.GetPartyByBrokeragePartyId(
        requestId,
        tenantId,
        partyId
      );
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
    summary: 'Creates a party.',
    externalDocs: {
      description: 'See the Wealth Kernel API documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/7d00a930e12bd-add-a-party',
    },
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.IDEMPOTENCY_KEY,
  })
  @ApiBody({
    description: 'The party to create.',
    type: BrokerageIntegrationServerDto.BrokerageIntegrationPartyCreationDto,
    examples: {
      PARTY_TO_CREATE: {
        value: {
          type: 'Person',
          clientReference: 'BenFirstAccount',
          identifiers: [
            {
              issuer: 'GB',
              type: 'NINO',
              value: 'QQ123456A',
            },
          ],
          title: 'Mr',
          forename: 'Benjamin',
          middlename: "'Stutter'",
          surname: 'Wong',
          previousSurname: null,
          emailAddress: 'benjain@bambu.co',
          telephoneNumber: '+60122678138',
          dateOfBirth: '1985-10-01',
          taxResidencies: ['GB'],
          nationalities: ['GB'],
          employmentStatus: 'FullTime',
          industry: 'AgricultureForestryAndFishing',
          sourcesOfWealth: ['Salary', 'Inheritance'],
          annualIncome: {
            currency: 'GBP',
            amount: 30000,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'HTTP 200 response(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            BrokerageIntegrationServerDto.BrokerageIntegrationPartyDto
          ),
        },
        examples: {
          PARTY_CREATED: {
            value: {
              id: 'pty-33wdw7ju423n2m',
              type: 'Person',
              clientReference: '4t9j5g8n5',
              identifiers: [
                {
                  id: 'ide-33buv2rf725olk',
                  issuer: 'GB',
                  type: 'NINO',
                  value: 'QQ123456A',
                },
              ],
              addedAt: '2021-01-01T18:42:8712345Z',
              title: 'Miss',
              forename: 'Sarah',
              middlename: 'Parker',
              surname: 'Holland',
              previousSurname: null,
              countryOfBirth: 'GB',
              emailAddress: 'sarah.p.holland@example.com',
              telephoneNumber: '+447700654321',
              dateOfBirth: '1991-06-01',
              dateOfDeath: null,
              taxResidencies: ['GB'],
              nationalities: ['GB'],
              employmentStatus: 'FullTime',
              industry: 'AgricultureForestryAndFishing',
              sourcesOfWealth: ['Salary', 'Inheritance'],
              annualIncome: {
                currency: 'GBP',
                amount: 30000,
              },
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
  public async CreateParty(
    @Query('tenantId') tenantId: string,
    @Body()
    party: BrokerageIntegrationServerDto.BrokerageIntegrationPartyCreationDto,
    @Decorators.RequestId() requestId: string,
    @Query('idempotencyKey') idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateParty.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.CreateParty(
        requestId,
        tenantId,
        party,
        idempotencyKey
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Patch(':partyId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Updates a party.',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to update.',
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiBody({
    description: 'The party to update.',
    type: BrokerageIntegrationServerDto.BrokerageIntegrationPartyUpdateDto,
    examples: {
      PARTY_TO_UPDATE: {
        value: {
          clientReference: 'BenFirstAccount',
          title: 'Mr',
          forename: 'Benjamin',
          middlename: "'Stutter'",
          surname: 'Wong',
          previousSurname: null,
          emailAddress: 'benjain@bambu.co',
          telephoneNumber: '+60122678138',
          dateOfBirth: '1985-10-01',
          employmentStatus: 'FullTime',
          industry: 'AgricultureForestryAndFishing',
          sourcesOfWealth: ['Salary', 'Inheritance'],
          annualIncome: {
            currency: 'GBP',
            amount: 30000,
          },
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
            BrokerageIntegrationServerDto.BrokerageIntegrationPartyDto
          ),
        },
        examples: {
          PARTY_FOUND: {
            value: {
              id: 'pty-33wdw7ju423n2m',
              type: 'Person',
              clientReference: 'clientReference',
              identifiers: [
                {
                  id: 'ide-33buv2rf725olk',
                  issuer: 'GB',
                  type: 'NINO',
                  value: 'QQ123456A',
                },
              ],
              addedAt: '2021-01-01T18:42:8712345Z',
              title: 'Miss',
              forename: 'Sarah',
              middlename: 'Parker',
              surname: 'Holland',
              previousSurname: null,
              countryOfBirth: 'GB',
              emailAddress: 'sarah.p.holland@example.com',
              telephoneNumber: '+447700654321',
              dateOfBirth: '1991-06-01',
              dateOfDeath: null,
              taxResidencies: ['GB'],
              nationalities: ['GB'],
              employmentStatus: 'FullTime',
              industry: 'AgricultureForestryAndFishing',
              sourcesOfWealth: ['Salary', 'Inheritance'],
              annualIncome: {
                currency: 'GBP',
                amount: 30000,
              },
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
    status: 404,
    description: 'HTTP 404 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          TENANT_PARTY_NOT_FOUND: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .TENANT_PARTY_NOT_FOUND,
              statusCode: 400,
              message: 'Party not found.',
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
  public async UpdateParty(
    @Query('tenantId') tenantId: string,
    @Param('partyId') partyId: string,
    @Body()
    payload: BrokerageIntegrationServerDto.BrokerageIntegrationPartyUpdateDto,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateParty.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.UpdateParty(requestId, tenantId, partyId, payload);
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  // noinspection DuplicatedCode
  @Version('1')
  @Post(':partyId/identifiers')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Updates a party with a new identifier.',
    externalDocs: {
      description: 'See the Wealth Kernel API documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/a757d7db66174-add-an-identifier',
    },
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to update.',
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiBody({
    description: 'The identifier to add to the party.',
    type: BrokerageIntegrationServerDto.BrokerageIntegrationPartyIdentifierCreationDto,
    examples: {
      PARTY_IDENTIFIER_TO_ADD: {
        value: {
          type: 'NINO',
          value: 'QQ123456C',
          issuer: 'GB',
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
            BrokerageIntegrationServerDto.BrokerageIntegrationPartyDto
          ),
        },
        examples: {
          PARTY_FOUND: {
            value: {
              id: 'pty-33wdw7ju423n2m',
              type: 'Person',
              clientReference: 'clientReference',
              identifiers: [
                {
                  id: 'ide-33buv2rf725olk',
                  issuer: 'GB',
                  type: 'NINO',
                  value: 'QQ123456A',
                },
              ],
              addedAt: '2021-01-01T18:42:8712345Z',
              title: 'Miss',
              forename: 'Sarah',
              middlename: 'Parker',
              surname: 'Holland',
              previousSurname: null,
              countryOfBirth: 'GB',
              emailAddress: 'sarah.p.holland@example.com',
              telephoneNumber: '+447700654321',
              dateOfBirth: '1991-06-01',
              dateOfDeath: null,
              taxResidencies: ['GB'],
              nationalities: ['GB'],
              employmentStatus: 'FullTime',
              industry: 'AgricultureForestryAndFishing',
              sourcesOfWealth: ['Salary', 'Inheritance'],
              annualIncome: {
                currency: 'GBP',
                amount: 30000,
              },
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
          BAD_INPUT: {
            value: {
              error: 'Error',
              errorCode: 'BAD_BROKERAGE_REQUEST',
              statusCode: 400,
              message:
                'One or more validation errors occurred. Supplementary error messages: [The provided Issuer and Type are not valid].',
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
          TENANT_PARTY_NOT_FOUND: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .TENANT_PARTY_NOT_FOUND,
              statusCode: 400,
              message: 'Party not found.',
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
  public async AddIdentifierToParty(
    @Query('tenantId') tenantId: string,
    @Param('partyId') partyId: string,
    @Body()
    payload: BrokerageIntegrationServerDto.BrokerageIntegrationPartyIdentifierCreationDto,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.AddIdentifierToParty.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.AddIdentifierToParty(
        requestId,
        tenantId,
        partyId,
        payload
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  // noinspection DuplicatedCode
  @Version('1')
  @Post(':partyId/nationalities')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Adds a nationality to the party.',
    externalDocs: {
      description: 'See the Wealth Kernel API documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/baa0b64c91367-add-a-nationality',
    },
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to update.',
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiBody({
    description: 'The nationality to be added',
    schema: {
      type: 'object',
      properties: {
        countryCode: {
          type: 'string',
          description:
            'Contains a single country as an ISO 3166 two-letter country code',
          minLength: 2,
          maxLength: 2,
        },
      },
    },
    examples: {
      COUNTRY_CODE_TO_ADD: {
        value: {
          countryCode: 'GB',
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
            BrokerageIntegrationServerDto.BrokerageIntegrationPartyDto
          ),
        },
        examples: {
          PARTY_FOUND: {
            value: {
              id: 'pty-33wdw7ju423n2m',
              type: 'Person',
              clientReference: 'clientReference',
              identifiers: [
                {
                  id: 'ide-33buv2rf725olk',
                  issuer: 'GB',
                  type: 'NINO',
                  value: 'QQ123456A',
                },
              ],
              addedAt: '2021-01-01T18:42:8712345Z',
              title: 'Miss',
              forename: 'Sarah',
              middlename: 'Parker',
              surname: 'Holland',
              previousSurname: null,
              countryOfBirth: 'GB',
              emailAddress: 'sarah.p.holland@example.com',
              telephoneNumber: '+447700654321',
              dateOfBirth: '1991-06-01',
              dateOfDeath: null,
              taxResidencies: ['GB'],
              nationalities: ['GB'],
              employmentStatus: 'FullTime',
              industry: 'AgricultureForestryAndFishing',
              sourcesOfWealth: ['Salary', 'Inheritance'],
              annualIncome: {
                currency: 'GBP',
                amount: 30000,
              },
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
          BAD_INPUT: {
            value: {
              error: 'Error',
              errorCode: 'BAD_BROKERAGE_REQUEST',
              statusCode: 400,
              message:
                'Invalid country code. Country code must be a string that 2 characters long, without leading or trailing spaces.',
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
          TENANT_PARTY_NOT_FOUND: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .TENANT_PARTY_NOT_FOUND,
              statusCode: 400,
              message: 'Party not found.',
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
  public async AddNationalityToParty(
    @Query('tenantId') tenantId: string,
    @Param('partyId') partyId: string,
    @Body() payload: { countryCode: string },
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.AddNationalityToParty.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.AddNationalityToParty(
        requestId,
        tenantId,
        partyId,
        payload.countryCode
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  // noinspection DuplicatedCode
  @Version('1')
  @Post(':partyId/tax-residencies')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Adds a tax residency to the party.',
    externalDocs: {
      description: 'See the Wealth Kernel API documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/c87372464873e-add-a-tax-residency',
    },
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to update.',
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiBody({
    description: 'The nationality to be added',
    schema: {
      type: 'object',
      properties: {
        countryCode: {
          type: 'string',
          description:
            'Contains a single country as an ISO 3166 two-letter country code',
          minLength: 2,
          maxLength: 2,
        },
      },
    },
    examples: {
      COUNTRY_CODE_TO_ADD: {
        value: {
          countryCode: 'GB',
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
            BrokerageIntegrationServerDto.BrokerageIntegrationPartyDto
          ),
        },
        examples: {
          PARTY_FOUND: {
            value: {
              id: 'pty-33wdw7ju423n2m',
              type: 'Person',
              clientReference: 'clientReference',
              identifiers: [
                {
                  id: 'ide-33buv2rf725olk',
                  issuer: 'GB',
                  type: 'NINO',
                  value: 'QQ123456A',
                },
              ],
              addedAt: '2021-01-01T18:42:8712345Z',
              title: 'Miss',
              forename: 'Sarah',
              middlename: 'Parker',
              surname: 'Holland',
              previousSurname: null,
              countryOfBirth: 'GB',
              emailAddress: 'sarah.p.holland@example.com',
              telephoneNumber: '+447700654321',
              dateOfBirth: '1991-06-01',
              dateOfDeath: null,
              taxResidencies: ['GB'],
              nationalities: ['GB'],
              employmentStatus: 'FullTime',
              industry: 'AgricultureForestryAndFishing',
              sourcesOfWealth: ['Salary', 'Inheritance'],
              annualIncome: {
                currency: 'GBP',
                amount: 30000,
              },
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
          BAD_INPUT: {
            value: {
              error: 'Error',
              errorCode: 'BAD_BROKERAGE_REQUEST',
              statusCode: 400,
              message:
                'Invalid country code. Country code must be a string that 2 characters long, without leading or trailing spaces.',
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
          TENANT_PARTY_NOT_FOUND: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .TENANT_PARTY_NOT_FOUND,
              statusCode: 400,
              message: 'Party not found.',
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
  public async AddTaxResidencyToParty(
    @Query('tenantId') tenantId: string,
    @Param('partyId') partyId: string,
    @Body() payload: { countryCode: string },
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.AddTaxResidencyToParty.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.AddTaxResidencyToParty(
        requestId,
        tenantId,
        partyId,
        payload.countryCode
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  // noinspection DuplicatedCode
  @Version('1')
  @Put(':partyId/identifiers/:identifierId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Updates a party identifier.',
    externalDocs: {
      description: 'See the Wealth Kernel API documentation for more details.',
      url: 'https://docs.wealthkernel.com/docs/api/9e1920da47bb1-update-an-identifier',
    },
  })
  @ApiParam({
    type: 'string',
    name: 'partyId',
    description: 'The partyId of the party to update.',
  })
  @ApiParam({
    type: 'string',
    name: 'identifierId',
    description: 'The identifierId of the identifier to update.',
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiBody({
    description: 'The identifier to update.',
    type: BrokerageIntegrationServerDto.BrokerageIntegrationPartyIdentifierDto,
    examples: {
      PARTY_IDENTIFIER_TO_UPDATE: {
        value: {
          id: 'ide-33buv2rf725olk',
          type: 'NINO',
          value: 'QQ123456C',
          issuer: 'GB',
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
            BrokerageIntegrationServerDto.BrokerageIntegrationPartyDto
          ),
        },
        examples: {
          PARTY_FOUND: {
            value: {
              id: 'pty-33wdw7ju423n2m',
              type: 'Person',
              clientReference: 'clientReference',
              identifiers: [
                {
                  id: 'ide-33buv2rf725olk',
                  issuer: 'GB',
                  type: 'NINO',
                  value: 'QQ123456A',
                },
              ],
              addedAt: '2021-01-01T18:42:8712345Z',
              title: 'Miss',
              forename: 'Sarah',
              middlename: 'Parker',
              surname: 'Holland',
              previousSurname: null,
              countryOfBirth: 'GB',
              emailAddress: 'sarah.p.holland@example.com',
              telephoneNumber: '+447700654321',
              dateOfBirth: '1991-06-01',
              dateOfDeath: null,
              taxResidencies: ['GB'],
              nationalities: ['GB'],
              employmentStatus: 'FullTime',
              industry: 'AgricultureForestryAndFishing',
              sourcesOfWealth: ['Salary', 'Inheritance'],
              annualIncome: {
                currency: 'GBP',
                amount: 30000,
              },
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
    status: 404,
    description: 'HTTP 404 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          TENANT_PARTY_NOT_FOUND: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .TENANT_PARTY_NOT_FOUND,
              statusCode: 400,
              message: 'Party not found.',
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
  public async UpdatePartyIdentifier(
    @Param('partyId') partyId: string,
    @Param('identifierId') identifierId: string,
    @Query('tenantId') tenantId: string,
    @Body()
    updatePayload: BrokerageIntegrationServerDto.BrokerageIntegrationPartyIdentifierDto,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationPartyDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdatePartyIdentifier.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.UpdatePartyIdentifier(
        requestId,
        tenantId,
        partyId,
        identifierId,
        updatePayload
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get(':partyId/addresses')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Lists all addresses for a party.',
    description: 'Abstraction to get all addresses for a party.',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to get.',
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
  public async GetAddressesForParty(
    @Param('partyId') partyId: string,
    @Query('tenantId') tenantId: string,
    @Query()
    queryParams: BrokerageIntegrationServerDto.BrokerageIntegrationListAllQueryParamsBaseDto,
    @Decorators.RequestId() requestId: string
  ) {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetAddressesForParty.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      const params = { ...queryParams };

      // I messed up with the query params design, so this is a hack to get around it
      if ((params as unknown as Record<string, unknown>).tenantId) {
        delete (params as unknown as Record<string, unknown>).tenantId;
      }

      return await domain.GetAddressesForParty(
        requestId,
        tenantId,
        partyId,
        params
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get(':partyId/addresses/:addressId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Gets an address for a party.',
    description: 'Abstraction to get an address for a party.',
  })
  @ApiParam({
    name: 'addressId',
    description: 'The addressId of the address to get.',
    type: 'string',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to get.',
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
  public async GetAddressForParty(
    @Param('partyId') partyId: string,
    @Param('addressId') addressId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetAddressForParty.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.GetAddressForParty(
        requestId,
        tenantId,
        partyId,
        addressId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Post(':partyId/addresses')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Creates an address for a party.',
    description: 'Abstraction to create an address for a party.',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to get.',
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
          PARTY_ID_MISMATCH: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .BAD_BROKERAGE_REQUEST,
              statusCode: 400,
              message:
                'The party id in the payload does not match the brokerage party id.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
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
  public async CreatePartyAddress(
    @Param('partyId') partyId: string,
    @Query('tenantId') tenantId: string,
    @Body()
    payload: BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressCreationDto,
    @Decorators.RequestId() requestId: string,
    @Query('idempotencyKey') idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreatePartyAddress.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.CreatePartyAddress(
        requestId,
        tenantId,
        partyId,
        payload,
        idempotencyKey
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Put(':partyId/addresses/:addressId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Updates an address for a party.',
    description: 'Abstraction to update an address for a party.',
  })
  @ApiParam({
    name: 'addressId',
    description: 'The addressId of the address to get.',
    type: 'string',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to get.',
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
          PARTY_ID_MISMATCH: {
            value: {
              error: 'Error',
              errorCode:
                SharedEnums.ErrorCodes.BrokerIntegrationErrorCodesEnum
                  .BAD_BROKERAGE_REQUEST,
              statusCode: 400,
              message:
                'The party id in the payload does not match the brokerage party id.',
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
  public async UpdatePartyAddress(
    @Param('partyId') partyId: string,
    @Param('addressId') addressId: string,
    @Query('tenantId') tenantId: string,
    @Body()
    payload: BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressCreationDto,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationPartyAddressDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdatePartyAddress.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.UpdatePartyAddress(
        requestId,
        tenantId,
        partyId,
        addressId,
        payload
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get(':partyId/bank-accounts')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Lists all bank accounts for a party.',
    description: 'Abstraction to get all bank accounts for a party.',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to get.',
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
  public async GetBankAccountsForParty(
    @Param('partyId') partyId: string,
    @Query('tenantId') tenantId: string,
    @Query()
    queryParams: BrokerageIntegrationServerDto.BrokerageIntegrationListAllQueryParamsBaseDto,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBankAccountsForParty.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      const params = { ...queryParams };

      // I messed up with the query params design, so this is a hack to get around it
      if ((params as unknown as Record<string, unknown>).tenantId) {
        delete (params as unknown as Record<string, unknown>).tenantId;
      }

      return await domain.GetBankAccountsForParty(
        requestId,
        tenantId,
        partyId,
        params
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get(':partyId/bank-accounts/:bankAccountId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Gets a bank account for a party.',
    description: 'Abstraction to get a bank account for a party.',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to get.',
  })
  @ApiParam({
    name: 'bankAccountId',
    description: 'The id of the target bank account.',
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
  public async GetBankAccountForParty(
    @Param('partyId') partyId: string,
    @Param('bankAccountId') bankAccountId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBankAccountForParty.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.GetBankAccountForParty(
        requestId,
        tenantId,
        partyId,
        bankAccountId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Post(':partyId/bank-accounts')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(201)
  @ApiOperation({
    summary: 'Creates a bank account for a party.',
    description: 'Abstraction to create a bank account for a party.',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to get.',
    type: 'string',
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
          accountNumber: '87654321',
          sortCode: '65-43-21',
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
  public async CreatePartyBankAccount(
    @Param('partyId') partyId: string,
    @Query('tenantId') tenantId: string,
    @Body()
    payload: BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountMutableDto,
    @Decorators.RequestId() requestId: string,
    @Query('idempotencyKey') idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreatePartyBankAccount.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.CreatePartyBankAccount(
        requestId,
        tenantId,
        partyId,
        payload,
        idempotencyKey
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Post(':partyId/bank-accounts/:bankAccountId/actions/deactivate')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(204)
  @ApiOperation({
    summary: 'Deactivates a bank account for a party.',
    description: 'Abstraction to deactivate a bank account for a party.',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to get.',
  })
  @ApiParam({
    name: 'bankAccountId',
    description: 'The id of the target bank account.',
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
  public async DeactivatePartyBankAccount(
    @Param('partyId') partyId: string,
    @Param('bankAccountId') bankAccountId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.DeactivatePartyBankAccount.name,
      requestId
    );

    try {
      const domain = this.partiesServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.DeactivatePartyBankAccount(
        requestId,
        tenantId,
        partyId,
        bankAccountId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get(':partyId/brokerage-accounts')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Lists all brokerage accounts for a party.',
    description: 'Abstraction to get all brokerage accounts for a party.',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to get.',
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 200,
    description: 'The of brokerage accounts',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            BrokerageAccountDto.BrokerageIntegrationListAllAccountsResponseDto
          ),
        },
        example: {
          paginationToken: null,
          results: [
            {
              id: 'acc-33xifz3ii25yac',
              clientReference: '5g94j5gnknv9',
              name: "Nicola's GIA",
              type: 'GIA',
              status: 'Active',
              productId: 'prd-gia',
              addedAt: '2021-03-13T16:41:16.4237925Z',
              owner: 'pty-33xig43bj24vza',
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
  public async GetBrokerageAccountsForParty(
    @Param('partyId') partyId: string,
    @Query('tenantId') tenantId: string,
    @Query()
    queryParams: BrokerageIntegrationServerDto.BrokerageIntegrationListAllQueryParamsBaseDto,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageAccountDto.BrokerageIntegrationListAllAccountsResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBrokerageAccountsForParty.name,
      requestId
    );

    try {
      const domain = this.brokerageAccountsServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      const params = { ...queryParams };

      // I messed up with the query params design, so this is a hack to get around it
      if ((params as unknown as Record<string, unknown>).tenantId) {
        delete (params as unknown as Record<string, unknown>).tenantId;
      }

      return await domain.GetAccountsForParty(
        requestId,
        tenantId,
        partyId,
        params
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get(':partyId/brokerage-accounts/:accountId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Gets a brokerage account for a party.',
    description: 'Abstraction to get a brokerage account for a party.',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to get.',
  })
  @ApiParam({
    name: 'accountId',
    description: 'The id of the target brokerage account.',
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiResponse({
    status: 200,
    description: 'The brokerage account.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            BrokerageAccountDto.BrokerageIntegrationAccountDto
          ),
        },
        example: {
          id: 'acc-33xifz3ii25yac',
          clientReference: '5g94j5gnknv9',
          name: "Nicola's GIA",
          type: 'GIA',
          status: 'Active',
          addedAt: '2021-03-13T16:41:16.4237925Z',
          productId: 'prd-gia',
          owner: 'pty-33xig43bj24vza',
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
  public async GetAccountForParty(
    @Param('partyId') partyId: string,
    @Param('accountId') accountId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<BrokerageAccountDto.BrokerageIntegrationAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetAccountForParty.name,
      requestId
    );

    try {
      const domain = this.brokerageAccountsServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.GetAccountForParty(
        requestId,
        tenantId,
        partyId,
        accountId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Post(':partyId/brokerage-accounts')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(201)
  @ApiOperation({
    summary: 'Creates a brokerage account for a party.',
    description: 'Abstraction to create a brokerage account for a party.',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to get.',
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.IDEMPOTENCY_KEY,
  })
  @ApiBody({
    type: BrokerageAccountDto.BrokerageIntegrationAccountMutableDto,
    description: 'The brokerage account to create.',
    required: true,
    examples: {
      ACCOUNT_TO_CREATE: {
        value: {
          clientReference: 'My Client Ref',
          name: 'Example Account',
          type: 'GIA',
          productId: 'prd-gia',
          owner: 'pty-33xk677aw2egkm',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The created brokerage account.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(
            BrokerageAccountDto.BrokerageIntegrationAccountDto
          ),
        },
        example: {
          id: 'acc-33xifz3ii25yac',
          clientReference: '5g94j5gnknv9',
          name: "Nicola's GIA",
          type: 'GIA',
          status: 'Active',
          addedAt: '2021-03-13T16:41:16.4237925Z',
          productId: 'prd-gia',
          owner: 'pty-33xig43bj24vza',
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
          ID_MISMATCH: {
            value: {
              error: 'Error',
              errorCode: 'BAD_BROKERAGE_REQUEST',
              statusCode: 400,
              message:
                'The brokerage account owner does not match the brokerage party id.',
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
  public async CreateAccountForParty(
    @Param('partyId') partyId: string,
    @Query('tenantId') tenantId: string,
    @Body() payload: BrokerageAccountDto.BrokerageIntegrationAccountMutableDto,
    @Decorators.RequestId() requestId: string,
    @Query('idempotencyKey') idempotencyKey?: string
  ): Promise<BrokerageAccountDto.BrokerageIntegrationAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateAccountForParty.name,
      requestId
    );

    try {
      const domain = this.brokerageAccountsServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.CreateAccountForParty(
        requestId,
        tenantId,
        partyId,
        payload,
        idempotencyKey
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get(':partyId/brokerage-accounts/:accountId/actions/close')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(204)
  @ApiOperation({
    summary: 'Closes a brokerage account for a party.',
    description: 'Abstraction to close a brokerage account for a party.',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to get.',
  })
  @ApiParam({
    name: 'accountId',
    description: 'The id of the target brokerage account.',
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
  public async CloseAccountForParty(
    @Param('partyId') partyId: string,
    @Param('accountId') accountId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CloseAccountForParty.name,
      requestId
    );

    try {
      const domain = this.brokerageAccountsServiceLocator.GetService(
        SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL
      );

      return await domain.CloseAccountForParty(
        requestId,
        tenantId,
        partyId,
        accountId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get(':partyId/brokerage-portfolios/:accountId/portfolios')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Lists all portfolios for a brokerage account.',
    description: 'Abstraction to get all portfolios for a brokerage account.',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to get.',
  })
  @ApiParam({
    name: 'accountId',
    description: 'The id of the target brokerage account.',
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
            PortfoliosDto.BrokerageIntegrationListAllPortfoliosResponseDto
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
    status: 404,
    description: 'See HTTP 404 error(s) from accounts and party admin APIs.',
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
  public async GetPortfoliosForPartyAccount(
    @Param('partyId') partyId: string,
    @Param('accountId') accountId: string,
    @Query('tenantId') tenantId: string,
    @Query()
    queryParams: BrokerageIntegrationServerDto.BrokerageIntegrationListAllQueryParamsBaseDto,
    @Decorators.RequestId() requestId: string
  ): Promise<PortfoliosDto.BrokerageIntegrationListAllPortfoliosResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetPortfoliosForPartyAccount.name,
      requestId
    );

    try {
      const params = { ...queryParams };

      // I messed up with the query params design, so this is a hack to get around it
      if ((params as unknown as Record<string, unknown>).tenantId) {
        delete (params as unknown as Record<string, unknown>).tenantId;
      }

      return await this.brokeragePortfoliosDomainService.GetPortfoliosForPartyAccount(
        requestId,
        tenantId,
        partyId,
        accountId,
        params
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get(':partyId/brokerage-portfolios/:accountId/portfolios/:portfolioId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Gets a portfolio for a brokerage account.',
    description: 'Abstraction to get a portfolio for a brokerage account.',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to get.',
  })
  @ApiParam({
    name: 'accountId',
    description: 'The id of the target brokerage account.',
  })
  @ApiParam({
    name: 'portfolioId',
    description: 'The id of the target portfolio.',
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
          $ref: getSchemaPath(PortfoliosDto.BrokerageIntegrationPortfolioDto),
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
    description:
      'See HTTP 404 error(s) from accounts, party and portfolio admin APIs.',
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
  public async GetPortfolioForPartyAccount(
    @Param('partyId') partyId: string,
    @Param('accountId') accountId: string,
    @Param('portfolioId') portfolioId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<PortfoliosDto.BrokerageIntegrationPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetPortfolioForPartyAccount.name,
      requestId
    );

    try {
      return await this.brokeragePortfoliosDomainService.GetPortfolioForPartyAccount(
        requestId,
        tenantId,
        partyId,
        accountId,
        portfolioId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Post(':partyId/brokerage-portfolios/:accountId/portfolios')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Creates a portfolio for a brokerage account.',
    description: 'Abstraction to create a portfolio for a brokerage account.',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to get.',
  })
  @ApiParam({
    name: 'accountId',
    description: 'The id of the target brokerage account.',
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.IDEMPOTENCY_KEY,
  })
  @ApiBody({
    type: PortfoliosDto.BrokerageIntegrationPortfolioMutableDto,
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
          $ref: getSchemaPath(PortfoliosDto.BrokerageIntegrationPortfolioDto),
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
    status: 404,
    description: 'See HTTP 404 error(s) from accounts and party admin APIs.',
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
  public async CreateForPartyAccount(
    @Param('partyId') partyId: string,
    @Param('accountId') accountId: string,
    @Query('tenantId') tenantId: string,
    @Body() payload: PortfoliosDto.BrokerageIntegrationPortfolioMutableDto,
    @Decorators.RequestId() requestId: string,
    @Query('idempotencyKey') idempotencyKey?: string
  ): Promise<PortfoliosDto.BrokerageIntegrationPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateForPartyAccount.name,
      requestId
    );

    try {
      return await this.brokeragePortfoliosDomainService.CreateForPartyAccount(
        requestId,
        tenantId,
        partyId,
        accountId,
        payload,
        idempotencyKey
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Put(
    ':partyId/brokerage-portfolios/:accountId/portfolios/:portfolioId/mandate'
  )
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Gets a portfolio for a brokerage account.',
    description: 'Abstraction to get a portfolio for a brokerage account.',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to get.',
  })
  @ApiParam({
    name: 'accountId',
    description: 'The id of the target brokerage account.',
  })
  @ApiParam({
    name: 'portfolioId',
    description: 'The id of the target portfolio.',
  })
  @ApiQuery({
    ...SWAGGER.QUERY_STRING.TENANT_ID,
  })
  @ApiBody({
    type: PortfoliosDto.MandateDto,
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
    description: 'The portfolio.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(PortfoliosDto.BrokerageIntegrationPortfolioDto),
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
    description:
      'See HTTP 404 error(s) from accounts, party, portfolio admin APIs.',
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
  public async UpdateMandateForPartyAccount(
    @Param('partyId') partyId: string,
    @Param('accountId') accountId: string,
    @Param('portfolioId') portfolioId: string,
    @Query('tenantId') tenantId: string,
    @Body() payload: PortfoliosDto.MandateDto,
    @Decorators.RequestId() requestId: string
  ): Promise<PortfoliosDto.BrokerageIntegrationPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateMandateForPartyAccount.name,
      requestId
    );
    try {
      return await this.brokeragePortfoliosDomainService.UpdateForPartyAccount(
        requestId,
        tenantId,
        partyId,
        accountId,
        portfolioId,
        {
          mandate: payload,
        } as unknown as PortfoliosDto.BrokerageIntegrationPortfolioMutableDto
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Put(
    ':partyId/brokerage-portfolios/:accountId/portfolios/:portfolioId/actions/close'
  )
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Closes a portfolio for a brokerage account.',
    description: 'Abstraction to close a portfolio for a brokerage account.',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to get.',
  })
  @ApiParam({
    name: 'accountId',
    description: 'The id of the target brokerage account.',
  })
  @ApiParam({
    name: 'portfolioId',
    description: 'The id of the target portfolio.',
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
    description: 'See HTTP 404 errors from party, account and portfolio APIs.',
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
  public async CloseForPartyAccount(
    @Param('partyId') partyId: string,
    @Param('accountId') accountId: string,
    @Param('portfolioId') portfolioId: string,
    @Query('tenantId') tenantId: string,
    @Decorators.RequestId() requestId: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CloseForPartyAccount.name,
      requestId
    );

    try {
      return await this.brokeragePortfoliosDomainService.CloseForPartyAccount(
        requestId,
        tenantId,
        partyId,
        accountId,
        portfolioId
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }

  @Version('1')
  @Get(
    ':partyId/brokerage-portfolios/:accountId/portfolios/:portfolioId/valuations'
  )
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Gets valuations for a portfolio.',
    description: 'Abstraction to get valuations for a portfolio.',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The partyId of the party to get.',
  })
  @ApiParam({
    name: 'accountId',
    description: 'The id of the target brokerage account.',
  })
  @ApiParam({
    name: 'portfolioId',
    description: 'The id of the target portfolio.',
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
            ValuationsDto.BrokerageIntegrationValuationListAllResponseDto
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
    status: 404,
    description:
      'See HTTP 404 error(s) from accounts, party, portfolio, and valuations admin APIs.',
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
  public async GetValuationsForPartyAccountPortfolio(
    @Param('partyId') partyId: string,
    @Param('accountId') accountId: string,
    @Param('portfolioId') portfolioId: string,
    @Query('tenantId') tenantId: string,
    @Query()
    queryParams: BrokerageIntegrationServerDto.BrokerageIntegrationListAllQueryParamsBaseDto,
    @Decorators.RequestId() requestId: string
  ): Promise<ValuationsDto.BrokerageIntegrationValuationListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetValuationsForPartyAccountPortfolio.name,
      requestId
    );

    try {
      const params = { ...queryParams };

      // I messed up with the query params design, so this is a hack to get around it
      if ((params as unknown as Record<string, unknown>).tenantId) {
        delete (params as unknown as Record<string, unknown>).tenantId;
      }

      return await this.brokerageValuationsDomainService.GetPortfolioValuationsForParty(
        requestId,
        tenantId,
        partyId,
        accountId,
        portfolioId,
        params
      );
    } catch (error) {
      this.logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);
      ErrorUtils.handleHttpControllerError(error, requestId);
    }
  }
}
