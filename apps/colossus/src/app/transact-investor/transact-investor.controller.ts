import { InvalidCredentialsError } from '@bambu/server-core/common-errors';
import {
  ExtractOriginGuard,
  Public,
  Roles,
} from '@bambu/server-core/common-guards';
import { TransactInvestorServiceBase } from '@bambu/server-core/domains';
import {
  BrokerageIntegrationServerDto,
  IColossusTrackingDto,
  IServerCoreIamClaimsDto,
} from '@bambu/server-core/dto';
import {
  Decorators,
  ErrorUtils,
  IamUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Headers,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthenticationLoginResponseDto } from '../authentication/dto';
import * as Dto from './dto';

@ApiTags('Transact Investor')
@ApiExtraModels(
  AuthenticationLoginResponseDto,
  Dto.TransactInvestorLeadInputDto,
  Dto.TransactInvestorConvertLeadInputUnsafeDto,
  Dto.TransactInvestorLoginRequestDto,
  Dto.TransactInvestorValidateAccountRequestDto,
  Dto.InvestorPlatformProfileDto,
  Dto.ColossusKycRequestPayloadDto,
  Dto.ColossusKycResponsePayloadAccountDto,
  Dto.ColossusKycRequestPayloadAccountDto,
  Dto.ColossusKycResponsePayloadAddressDto,
  Dto.ColossusKycRequestPayloadAddressDto,
  Dto.ColossusKycResponsePayloadPartyIdentifierDto,
  Dto.ColossusKycRequestPayloadPartyIdentifierDto,
  Dto.ColossusKycResponsePayloadPartyDto,
  Dto.ColossusKycRequestPayloadPartyDto,
  Dto.ColossusKycResponsePayloadDto,
  Dto.InstrumentAssetClassDto,
  Dto.InstrumentExchangeDto,
  Dto.InstrumentCurrencyDto,
  Dto.InstrumentFactSheetDto,
  Dto.InstrumentDto,
  Dto.InstrumentsSearchResponseDto,
  Dto.ColossusBankAccountRequestPayloadDto,
  Dto.ColossusBankAccountResponsePayloadDto,
  Dto.ColossusDirectDebitMandateRequestPayloadDto,
  Dto.ColossusDirectDebitMandateResponsePayloadDto,
  Dto.GetModelPortfolioByIdResponseDto,
  Dto.TransactPortfolioInstrumentDto,
  Dto.ColossusDirectDebitMandateGetNextPossiblePaymentCollectionDateDto,
  Dto.ColossusGoalTransactionsQueryParamsDto,
  Dto.QueryUkDirectDebitPaymentsParamsDto,
  Dto.ColossusUkDirectDebitSubscriptions,
  Dto.ColossusUkDirectDebitSubscriptionListAllParamsDto,
  Dto.TransactPortfolioHoldingsDto,
  BrokerageIntegrationServerDto.ColossusListAllWithdrawalsQueryParamsDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationListAllWithdrawalsQueryResponseDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationWithdrawalDto,
  BrokerageIntegrationServerDto.BrokerageIntegrationWithdrawalMutableDto,
  BrokerageIntegrationServerDto.ColossusWithdrawalMutableDto
)
@UseGuards(ExtractOriginGuard)
@Controller('transact/investor')
export class TransactInvestorController {
  readonly #logger: Logger = new Logger(TransactInvestorController.name);

  constructor(
    private readonly transactInvestorDomain: TransactInvestorServiceBase
  ) {}

  @Public()
  @Version('1')
  @Post('convert-to-platform-user')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(201)
  @ApiOperation({
    summary: [
      'Convert a lead to a platform user.',
      'The only way to test this in a dev setting is to use the "origin-override" header.',
    ].join(' '),
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiBody({
    schema: {
      $ref: getSchemaPath(Dto.TransactInvestorConvertLeadInputUnsafeDto),
    },
  })
  @ApiResponse({
    status: 201,
  })
  @ApiResponse({ status: 403 })
  public async ConvertLeadToPlatformUser(
    @Body() convertParams: Dto.TransactInvestorConvertLeadInputUnsafeDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<void> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.ConvertLeadToPlatformUser.name,
      tracking.requestId
    );
    this.#guardOriginHeader(origin, logPrefix);

    try {
      await this.transactInvestorDomain.ConvertLeadToPlatformUserByOriginAndEmail(
        {
          tracking,
          ...convertParams,
          origin,
        }
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(error)}`
      );
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Public()
  @Version('1')
  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Logs an investor in on the Transact platform. It should perform the same action as the core /login endpoint, but with an inferred tenant based on the origin.',
    operationId: 'Login',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiBody({
    description: 'Input payload.',
    type: Dto.TransactInvestorLoginRequestDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'A set of claims for a user encoded as an access token, along with a refresh token.',
    schema: {
      $ref: getSchemaPath(AuthenticationLoginResponseDto),
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'Forbidden. Invalid credentials. Perhaps the username or password is incorrect.',
  })
  public async Login(
    @Body() credentials: Dto.TransactInvestorLoginRequestDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<AuthenticationLoginResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Login.name,
      tracking.requestId
    );
    try {
      return await this.transactInvestorDomain.Login({
        tracking,
        ...credentials,
        origin,
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );

      if (error instanceof InvalidCredentialsError) {
        ErrorUtils.handleHttpControllerError(
          new UnauthorizedException(error.message, 'INVALID_CREDENTIALS'),
          tracking.requestId
        );
      } else {
        ErrorUtils.handleHttpControllerError(error, tracking.requestId);
      }
    }
  }

  #guardOriginHeader(origin: string, logPrefix: string) {
    if (!origin) {
      throw new BadRequestException(`${logPrefix} No origin header found.`);
    }
  }

  @Public()
  @Version('1')
  @Post('resend-conversion-otp')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(201)
  @ApiOperation({
    summary: 'Resent the OTP for a lead conversion.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
  })
  public async ResendVerificationOtp(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Body()
    body: {
      email: string;
    },
    @Headers('extracted-origin') origin?: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ResendVerificationOtp.name,
      tracking.requestId
    );
    this.#guardOriginHeader(origin, logPrefix);
    try {
      await this.transactInvestorDomain.ResendVerificationOtp({
        tracking,
        origin,
        email: body.email,
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(error)}`
      );
      // Error won't show on the API, but will be logged.
      // ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Public()
  @Version('1')
  @Post('validate-conversion-otp')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(201)
  @ApiOperation({
    summary: 'Validate the OTP for a lead conversion.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiBody({
    type: Dto.TransactInvestorValidateAccountRequestDto,
  })
  @ApiResponse({
    status: 201,
  })
  public async VerifyInvestorPlatformUserVerificationOtp(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Body() body: Dto.TransactInvestorValidateAccountRequestDto,
    @Headers('extracted-origin') origin?: string
  ) {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.VerifyInvestorPlatformUserVerificationOtp.name,
      tracking.requestId
    );
    this.#guardOriginHeader(origin, logPrefix);
    try {
      const result =
        await this.transactInvestorDomain.VerifyInvestorPlatformUserVerificationOtp(
          tracking.requestId,
          origin,
          body
        );

      if (!result) {
        // noinspection ExceptionCaughtLocallyJS
        throw new BadRequestException(`${logPrefix} Invalid OTP.`);
      }
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(error)}`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Get('authenticated/profile')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the profile of the currently logged in investor.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiResponse({
    type: Dto.InvestorPlatformProfileDto,
    status: 200,
  })
  public async GetInvestorPlatformUserProfile(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<Dto.InvestorPlatformProfileDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetInvestorPlatformUserProfile.name,
      tracking.requestId
    );

    try {
      const realmId = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.GetInvestorPlatformUserProfile(
        tracking,
        realmId,
        origin
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  private getRealmIdFromClaims(claims: IServerCoreIamClaimsDto): string {
    return IamUtils.getFusionAuthRealmFromClaims(claims);
  }

  @Roles('Investor')
  @Version('1')
  @Post('authenticated/brokerage/accounts')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Submit KYC to the brokerage.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiBody({
    type: Dto.ColossusKycRequestPayloadDto,
    examples: {
      'British Citizen': {
        value: {
          party: {
            type: 'Person', // For now, it will always be person, hard coded
            identifiers: [
              {
                issuer: 'GB', // Fixed value for 1st release
                type: 'NINO', // Fixed value for 1st release
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
              currency: 'GBP', // Fixed value for 1st release
              amount: 30000,
            },
          },
          address: {
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
          account: {
            type: 'GIA',
            productId: 'prd-gia', // Fixed value for 1st release
          },
        },
      },
    },
  })
  @ApiResponse({
    type: Dto.ColossusKycResponsePayloadDto,
    status: 201,
  })
  public async SubmitKycToBrokerage(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Body() body: Dto.ColossusKycRequestPayloadDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<Dto.ColossusKycResponsePayloadDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.SubmitKycToBrokerage.name,
      tracking.requestId
    );
    try {
      const tenantId = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.SubmitKycToBrokerage(
        tracking,
        tenantId,
        origin,
        body
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Get('authenticated/brokerage/accounts')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the brokerage profile for the investor.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiResponse({
    type: Dto.ColossusKycResponsePayloadDto,
    status: 200,
  })
  public async GetBrokerageProfileForInvestor(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<Dto.ColossusKycResponsePayloadDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBrokerageProfileForInvestor.name,
      tracking.requestId
    );
    try {
      const tenantId = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.GetBrokerageProfileForInvestor(
        tracking,
        tenantId,
        origin
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Get('instruments/asset-classes')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the list of asset classes for the investor.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiResponse({
    status: 200,
    type: Dto.InstrumentAssetClassDto,
    isArray: true,
  })
  public async GetInstrumentAssetClasses(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Headers('extracted-origin') origin?: string
  ): Promise<Dto.InstrumentAssetClassDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetInstrumentAssetClasses.name,
      tracking.requestId
    );
    try {
      return await this.transactInvestorDomain.GetInstrumentAssetClasses(
        tracking
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Get('instruments')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the list of instruments for the investor.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiQuery({
    name: 'pageIndex',
    type: 'integer',
    example: 0,
  })
  @ApiQuery({
    name: 'pageSize',
    type: 'integer',
    example: 50,
  })
  @ApiQuery({
    name: 'searchString',
    type: 'string',
    example: '',
    required: false,
  })
  @ApiResponse({
    status: 200,
    type: Dto.InstrumentsSearchResponseDto,
  })
  public async GetInstruments(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Query('pageIndex', ParseIntPipe) pageIndex = 0,
    @Query('pageSize', ParseIntPipe) pageSize = 50,
    @Query('searchString') searchString?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Headers('extracted-origin') origin?: string
  ): Promise<Dto.InstrumentsSearchResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetInstruments.name,
      tracking.requestId
    );
    try {
      const targetSearchString = searchString ? searchString : '';
      return await this.transactInvestorDomain.GetInstruments(
        tracking,
        pageIndex,
        pageSize,
        targetSearchString
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Get('authenticated/brokerage/bank-accounts')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the list of bank accounts for the investor.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiResponse({
    status: 200,
    type: Dto.ColossusBankAccountResponsePayloadDto,
    isArray: true,
  })
  public async GetBankAccounts(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<Dto.ColossusBankAccountResponsePayloadDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBankAccounts.name,
      tracking.requestId
    );
    try {
      const tenantId = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.GetBankAccountsForParty(
        tracking,
        tenantId,
        origin
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('2')
  @Get('authenticated/brokerage/bank-accounts')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the list of bank accounts for the investor.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiResponse({
    status: 200,
    type: BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountListAllResponseDto,
    isArray: true,
  })
  public async GetBankAccountsPaged(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Param()
    queryParams: BrokerageIntegrationServerDto.BrokerageIntegrationListAllQueryParamsBaseDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBankAccountsPaged.name,
      tracking.requestId
    );
    try {
      const tenantId = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.GetBankAccountsForPartyPaged(
        tracking,
        tenantId,
        origin,
        queryParams
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Get('authenticated/brokerage/bank-accounts/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the bank account for the investor by bank account id.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiParam({
    name: 'id',
    description: 'Bank account id.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountDto,
  })
  public async GetBankAccountById(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Param('id') id: string,
    @Headers('extracted-origin') origin?: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationBankAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBankAccountById.name,
      tracking.requestId
    );
    try {
      return await this.transactInvestorDomain.GetBankAccountForPartyByBankAccountId(
        tracking,
        this.getRealmIdFromClaims(claims),
        origin,
        id
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Post('authenticated/brokerage/bank-accounts')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a bank account for the investor.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiBody({
    type: Dto.ColossusBankAccountRequestPayloadDto,
  })
  @ApiResponse({
    status: 201,
    type: Dto.ColossusBankAccountResponsePayloadDto,
  })
  public async CreateBankAccountForParty(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Body() payload: Dto.ColossusBankAccountRequestPayloadDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<Dto.ColossusBankAccountResponsePayloadDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateBankAccountForParty.name,
      tracking.requestId
    );
    try {
      const tenantId = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.CreateBankAccountForParty(
        tracking,
        tenantId,
        origin,
        payload
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Get('authenticated/brokerage/direct-debits/mandates')
  @ApiOperation({
    summary: 'Get the list of direct debits for the investor.',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiResponse({
    status: 200,
    type: Dto.ColossusDirectDebitMandateResponsePayloadDto,
    isArray: true,
  })
  public async GetDirectDebitMandatesByParty(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<Dto.ColossusDirectDebitMandateResponsePayloadDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetDirectDebitMandatesByParty.name,
      tracking.requestId
    );
    try {
      const tenantId: string = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.GetDirectDebitMandatesByParty(
        tracking,
        tenantId,
        origin
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Post('authenticated/brokerage/direct-debits/mandates')
  @ApiOperation({
    summary: 'Create a direct debit mandates for the investor.',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiBody({
    type: Dto.ColossusDirectDebitMandateRequestPayloadDto,
  })
  @ApiResponse({
    status: 201,
    type: Dto.ColossusDirectDebitMandateResponsePayloadDto,
  })
  public async CreateDirectDebitMandateForParty(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Body() payload: Dto.ColossusDirectDebitMandateRequestPayloadDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<Dto.ColossusDirectDebitMandateResponsePayloadDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateDirectDebitMandateForParty.name,
      tracking.requestId
    );
    try {
      const tenantId: string = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.CreateDirectDebitMandateForParty(
        tracking,
        tenantId,
        origin,
        payload
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Get('authenticated/brokerage/direct-debits/mandates/:mandateId/pdf')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets the PDF for a mandate.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
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
      'application/pdf': {
        schema: {
          type: 'file',
        },
      },
    },
  })
  public async GetDirectDebitMandatePdf(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Param('mandateId') mandateId: string,
    @Res() response: Response,
    @Headers('extracted-origin') origin?: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetDirectDebitMandatePdf.name,
      tracking.requestId
    );

    try {
      const tenantId: string = this.getRealmIdFromClaims(claims);
      const [body, mimeType] =
        await this.transactInvestorDomain.GetDirectDebitMandatePdf(
          tracking,
          tenantId,
          mandateId,
          origin
        );

      response.setHeader('Content-Type', mimeType);
      response.setHeader(
        'Content-Disposition',
        `attachment; filename="${mandateId}-mandate.pdf"`
      );
      response.send(Buffer.from(body));
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Post(
    'authenticated/brokerage/direct-debits/mandates/:mandateId/actions/cancel'
  )
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancel a direct debit mandate.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiParam({
    name: 'mandateId',
    description: 'The mandate ID.',
    required: true,
    type: 'string',
  })
  public async CancelDirectDebitMandate(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Param('mandateId') mandateId: string,
    @Headers('extracted-origin') origin?: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CancelDirectDebitMandate.name,
      tracking.requestId
    );
    try {
      const tenantId: string = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.CancelDirectDebitMandate(
        tracking,
        tenantId,
        mandateId,
        origin
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details:  ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Get('authenticated/brokerage/direct-debits/mandates/preview-mandate-pdf')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets the PDF Preview for a mandate.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiQuery({
    name: 'bankAccountId',
    description: 'The BankAccount ID for the Mandate',
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
  public async GetDirectDebitMandatePdfPreview(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Query('bankAccountId') bankAccountId: string,
    @Res() response: Response,
    @Headers('extracted-origin') origin?: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetDirectDebitMandatePdfPreview.name,
      tracking.requestId
    );

    this.#logger.debug(`${logPrefix} BankAccountId: ${bankAccountId}}`);

    try {
      const tenantId: string = this.getRealmIdFromClaims(claims);
      const [body, mimeType] =
        await this.transactInvestorDomain.GetMandatePdfPreview(
          tracking,
          tenantId,
          bankAccountId,
          origin
        );

      response.setHeader('Content-Type', mimeType);
      response.setHeader(
        'Content-Disposition',
        `attachment; filename="${bankAccountId}-mandate-preview.pdf"`
      );
      response.send(Buffer.from(body));
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Public()
  @Version('1')
  @Get('model-portfolios/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Get a model portfolio by id.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    type: Dto.GetModelPortfolioByIdResponseDto,
  })
  public async GetTransactModelPortfolioById(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Param('id') id: string,
    @Headers('extracted-origin') origin?: string
  ): Promise<Dto.GetModelPortfolioByIdResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetTransactModelPortfolioById.name,
      tracking.requestId
    );
    try {
      return await this.transactInvestorDomain.GetTransactModelPortfolioById(
        tracking.requestId,
        origin,
        id
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Get(
    'authenticated/brokerage/direct-debits/mandates/:mandateId/next-possible-payment'
  )
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiOperation({
    summary:
      'Gets the next possible collection date for a payment given a mandate ID.',
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
          $ref: getSchemaPath(
            Dto.ColossusDirectDebitMandateGetNextPossiblePaymentCollectionDateDto
          ),
        },
      },
    },
    type: Dto.ColossusDirectDebitMandateGetNextPossiblePaymentCollectionDateDto,
  })
  public async GetNextPossiblePaymentDate(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Param('mandateId') mandateId: string,
    @Headers('extracted-origin') origin?: string
  ): Promise<Dto.ColossusDirectDebitMandateGetNextPossiblePaymentCollectionDateDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetNextPossiblePaymentDate.name,
      tracking.requestId
    );

    try {
      const tenantId: string = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.GetNextPossiblePaymentDate(
        tracking,
        tenantId,
        mandateId,
        origin
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Get('authenticated/goals')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the list of goals for the investor.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiQuery({
    name: 'pageIndex',
    type: 'integer',
    example: 0,
  })
  @ApiQuery({
    name: 'pageSize',
    type: 'integer',
    example: 50,
  })
  @ApiResponse({
    type: Dto.InvestorPlatformProfileGoalDto,
    status: 200,
    isArray: true,
  })
  public async GetGoalsForTenantInvestor(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Query('pageIndex', ParseIntPipe) pageIndex = 0,
    @Query('pageSize', ParseIntPipe) pageSize = 50,
    @Headers('extracted-origin') origin?: string
  ): Promise<Dto.InvestorPlatformProfileGoalDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetGoalsForTenantInvestor.name,
      tracking.requestId
    );
    try {
      const realmId: string = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.GetGoalsForTenantInvestor(
        tracking,
        realmId,
        origin,
        pageIndex,
        pageSize
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Get('authenticated/goals/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the details of a goal.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiResponse({
    type: Dto.InvestorPlatformProfileGoalDto,
    status: 200,
  })
  public async GetInvestorGoalDetails(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Param('id') id: string,
    @Headers('extracted-origin') origin?: string
  ) {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetInvestorGoalDetails.name,
      tracking.requestId
    );
    try {
      /**
       * Express seems to get confused from time to time and thinks that the
       * id is actually 'count' when it is not. This is a workaround for that.
       */
      if (id.toUpperCase() === 'COUNT') {
        return this.GetCountOfGoalsForTenantInvestor(tracking, claims, origin);
      }

      const realmId: string = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.GetGoalDetails(
        tracking,
        realmId,
        origin,
        id,
        true
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Get('authenticated/goals/count')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the count of goals for the investor.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            count: {
              type: 'number',
            },
          },
        },
      },
    },
  })
  public async GetCountOfGoalsForTenantInvestor(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<{
    count: number;
  }> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetCountOfGoalsForTenantInvestor.name,
      tracking.requestId
    );
    try {
      const realmId: string = this.getRealmIdFromClaims(claims);
      const count =
        await this.transactInvestorDomain.GetCountOfGoalsForTenantInvestor(
          tracking,
          realmId,
          origin
        );

      return {
        count,
      };
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Get('authenticated/goals/:id/transactions')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the transactions for a goal.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiResponse({
    type: Dto.InvestorPlatformProfileGoalDto,
    status: 200,
  })
  public async GetTransactionsForGoal(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Param('id') id: string,
    @Query() query: Dto.ColossusGoalTransactionsQueryParamsDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationTransactionsListAllResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetTransactionsForGoal.name,
      tracking.requestId
    );
    try {
      const realmId: string = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.GetTransactionsForGoal(
        tracking,
        realmId,
        origin,
        id,
        query
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Get('authenticated/goals/:id/holdings')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the holdings for a goal.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    type: Dto.TransactPortfolioHoldingsDto,
    isArray: true,
  })
  public async GetHoldingsForGoal(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Param('id') id: string,
    @Headers('extracted-origin') origin?: string
  ): Promise<Dto.TransactPortfolioHoldingsDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetHoldingsForGoal.name,
      tracking.requestId
    );
    try {
      const realmId: string = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.GetHoldingsForGoal(tracking, {
        goalId: id,
        origin,
        tenantId: realmId,
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Post('authenticated/brokerage/direct-debits/payments')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a direct debit payment for the investor.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiBody({
    type: Dto.ColossusUkDirectDebitPaymentRequestDto,
  })
  public async CreateDirectDebitPayment(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Body() payload: Dto.ColossusUkDirectDebitPaymentRequestDto,
    @Headers('extracted-origin') origin?: string
  ) {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateDirectDebitPayment.name,
      tracking.requestId
    );

    try {
      const tenantId: string = this.getRealmIdFromClaims(claims);

      const params: Omit<
        BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentMutableDto,
        'portfolioId'
      > = {
        mandateId: payload.mandateId,
        amount: payload.amount,
      };

      if (payload.collectionDate) {
        params.collectionDate = payload.collectionDate;
      }

      return await this.transactInvestorDomain.CreateDirectDebitPayment(
        tracking,
        tenantId,
        origin,
        payload.goalId,
        params
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Get('authenticated/brokerage/direct-debits/payments')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get list of direct debit payments for the investor.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiResponse({
    status: 200,
    type: Dto.ColossusUkDirectDebitPaymentResultDto,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  public async GetDirectDebitPayments(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Query() queryParams: Dto.QueryUkDirectDebitPaymentsParamsDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<Dto.ColossusUkDirectDebitPaymentResultDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetDirectDebitPayments.name,
      tracking.requestId
    );
    try {
      const tenantId: string = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.GetDirectDebitPayments(
        tracking,
        tenantId,
        origin,
        queryParams
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Post(
    'authenticated/brokerage/direct-debits/payments/:paymentId/actions/cancel'
  )
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancel a direct debit payment.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiParam({
    name: 'paymentId',
    description: 'The payment ID.',
    required: true,
    type: 'string',
  })
  public async CancelDirectDebitPayment(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Param('paymentId') paymentId: string,
    @Headers('extracted-origin') origin?: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetDirectDebitPayments.name,
      tracking.requestId
    );
    try {
      const tenantId: string = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.CancelDirectDebitPayment(
        tracking,
        tenantId,
        paymentId,
        origin
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details:  ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Post('authenticated/brokerage/direct-debits/subscriptions')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a direct debit subscription.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiBody({
    type: Dto.ColossusUkDirectDebitSubscriptionRequestDto,
  })
  @ApiResponse({
    type: Dto.ColossusUkDirectDebitSubscriptionResponseDto,
    status: 201,
    description: 'HTTP 201 response.',
  })
  public async CreateDirectDebitSubscription(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Body() payload: Dto.ColossusUkDirectDebitSubscriptionRequestDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<Dto.ColossusUkDirectDebitSubscriptionResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateDirectDebitSubscription.name,
      tracking.requestId
    );

    try {
      const tenantId: string = this.getRealmIdFromClaims(claims);

      const params: Omit<
        BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreateSubscriptionReqDto,
        'portfolioId'
      > = {
        mandateId: payload.mandateId,
        amount: payload.amount,
        interval: payload.interval,
      };

      return await this.transactInvestorDomain.CreateDirectDebitSubscription(
        tracking,
        tenantId,
        origin,
        payload.goalId,
        params
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Get('authenticated/brokerage/direct-debits/subscriptions')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get list of direct debit subscriptions.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiResponse({
    type: Dto.ColossusUkDirectDebitSubscriptions,
    status: 200,
    isArray: true,
  })
  public async GetDirectDebitSubscriptions(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Query() queryParams: Dto.ColossusUkDirectDebitSubscriptionListAllParamsDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<Dto.ColossusUkDirectDebitSubscriptions> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetDirectDebitPayments.name,
      tracking.requestId
    );
    try {
      const tenantId: string = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.GetDirectDebitSubscriptions(
        tracking,
        tenantId,
        origin,
        queryParams
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Get(
    'authenticated/brokerage/direct-debits/subscriptions/:subscriptionId/upcoming-payments'
  )
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get list of Upcoming direct debit subscriptions.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiParam({
    name: 'subscriptionId',
    description: 'The subscription ID.',
    required: true,
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    type: Dto.ColossusUkDirectDebitListUpcomingSubscriptionDto,
    isArray: true,
  })
  public async ListUpcomingDirectDebitSubscriptions(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Param('subscriptionId') subscriptionId: string,
    @Headers('extracted-origin') origin?: string
  ): Promise<Dto.ColossusUkDirectDebitListUpcomingSubscriptionDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListUpcomingDirectDebitSubscriptions.name,
      tracking.requestId
    );
    try {
      const tenantId: string = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.ListUpcomingDirectDebitSubscriptions(
        tracking,
        tenantId,
        origin,
        subscriptionId
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Patch('authenticated/brokerage/direct-debits/subscriptions/:subscriptionId')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a Direct Debit Subscription',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiParam({
    name: 'subscriptionId',
    description: 'The subscription ID.',
    required: true,
    type: 'string',
  })
  @ApiBody({
    type: Dto.ColossusUkDirectDebitUpdateSubscriptionDto,
  })
  @ApiResponse({
    status: 202,
    description: 'HTTP 202 response.',
  })
  public async UpdateDirectDebitSubscription(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Param('subscriptionId') subscriptionId: string,
    @Body() payload: Dto.ColossusUkDirectDebitUpdateSubscriptionDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateDirectDebitSubscription.name,
      tracking.requestId
    );

    try {
      const tenantId: string = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.UpdateDirectDebitSubscription(
        tracking,
        tenantId,
        origin,
        subscriptionId,
        payload
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Post(
    'authenticated/brokerage/direct-debits/subscriptions/:subscriptionId/actions/cancel'
  )
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancel a Direct Debit Subscription',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiParam({
    name: 'subscriptionId',
    description: 'The subscription ID.',
    required: true,
    type: 'string',
  })
  @ApiResponse({
    status: 202,
    description: 'HTTP 200 response.',
  })
  public async CancelDirectDebitSubscription(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Param('subscriptionId') subscriptionId: string,
    @Headers('extracted-origin') origin?: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CancelDirectDebitSubscription.name,
      tracking.requestId
    );
    try {
      const tenantId: string = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.CancelDirectDebitSubscription(
        tracking,
        tenantId,
        origin,
        subscriptionId
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Post(
    'authenticated/brokerage/direct-debits/subscriptions/:subscriptionId/actions/pause'
  )
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Pause a Direct Debit Subscription',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiParam({
    name: 'subscriptionId',
    description: 'The subscription ID.',
    required: true,
    type: 'string',
  })
  @ApiResponse({
    status: 202,
    description: 'HTTP 200 response.',
  })
  public async PauseDirectDebitSubscription(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Param('subscriptionId') subscriptionId: string,
    @Headers('extracted-origin') origin?: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.PauseDirectDebitSubscription.name,
      tracking.requestId
    );
    try {
      const tenantId: string = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.PauseDirectDebitSubscription(
        tracking,
        tenantId,
        origin,
        subscriptionId
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Post(
    'authenticated/brokerage/direct-debits/subscriptions/:subscriptionId/actions/resume'
  )
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Resume a Direct Debit Subscription',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiParam({
    name: 'subscriptionId',
    description: 'The subscription ID.',
    required: true,
    type: 'string',
  })
  @ApiResponse({
    status: 202,
    description: 'HTTP 200 response.',
  })
  public async ResumeDirectDebitSubscription(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Param('subscriptionId') subscriptionId: string,
    @Headers('extracted-origin') origin?: string
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ResumeDirectDebitSubscription.name,
      tracking.requestId
    );

    try {
      const tenantId: string = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.ResumeDirectDebitSubscription(
        tracking,
        tenantId,
        origin,
        subscriptionId
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Get('authenticated/brokerage/withdrawals')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get list of withdrawals for the investor.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiResponse({
    status: 200,
    type: BrokerageIntegrationServerDto.BrokerageIntegrationListAllWithdrawalsQueryResponseDto,
  })
  public async ListWithdrawalsForGoal(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Query()
    queryParams: BrokerageIntegrationServerDto.ColossusListAllWithdrawalsQueryParamsDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationListAllWithdrawalsQueryResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ListWithdrawalsForGoal.name,
      tracking.requestId
    );
    try {
      const tenantId: string = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.ListWithdrawalsForGoal(
        tracking,
        tenantId,
        origin,
        queryParams
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  @Roles('Investor')
  @Version('1')
  @Post('authenticated/brokerage/withdrawals')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a withdrawal request for the investor.',
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiBody({
    type: BrokerageIntegrationServerDto.ColossusWithdrawalMutableDto,
  })
  @ApiResponse({
    status: 201,
    type: BrokerageIntegrationServerDto.BrokerageIntegrationWithdrawalDto,
    description: 'HTTP 201 response.',
  })
  public async CreateWithdrawalRequest(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Body() payload: BrokerageIntegrationServerDto.ColossusWithdrawalMutableDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<BrokerageIntegrationServerDto.BrokerageIntegrationWithdrawalDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.CreateWithdrawalRequest.name,
      tracking.requestId
    );
    try {
      const tenantId: string = this.getRealmIdFromClaims(claims);
      return await this.transactInvestorDomain.CreateWithdrawalRequest(
        tracking,
        tenantId,
        origin,
        payload
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }
}
