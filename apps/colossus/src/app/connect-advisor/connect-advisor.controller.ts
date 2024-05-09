/// <reference types="multer" />

import { ConnectAdvisorServiceBase } from '@bambu/server-connect/domains';
import { InvalidCredentialsError } from '@bambu/server-core/common-errors';
import {
  AllowEmailUnverified,
  Public,
  Roles,
} from '@bambu/server-core/common-guards';
import {
  IKeycloakFusionAuthSwitchoverConfigDto,
  ITransactInvestorSwitchoverConfigDto,
} from '@bambu/server-core/configuration';
import {
  LegalDocumentsEnum,
  LegalDocumentsServiceBase,
  RiskProfilingDomainServiceBase,
  TenantBrandingServiceBase,
  TenantServiceBase,
} from '@bambu/server-core/domains';
import {
  CommonSwaggerDto,
  IColossusHttpRequestDto,
  IColossusTrackingDto,
  IServerCoreIamClaimsDto,
} from '@bambu/server-core/dto';
import {
  ConnectPortfolioSummaryCentralDbRepositoryService,
  ConnectTenantGoalTypeCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import {
  Decorators,
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import {
  AuthenticationDto as IAuthenticationDto,
  ConnectAdvisorDto as IConnectAdvisorDto,
  ConnectLeadsDto,
  ConnectLegalDocumentsDto,
  ConnectTenantDto,
  SharedEnums,
  TenantBrandingDto as ITenantBrandingDto,
} from '@bambu/shared';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  Logger,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';
import sanitizeHtml from 'sanitize-html';
import * as AuthenticationDto from '../authentication/dto';
import * as ConnectInvestorDto from '../connect-investor/dto';
import * as DocumentsDto from '../documents/dto';
import * as TenantBrandingDto from '../tenant-branding/dto';
import * as Dto from './dto';

const MAX_FILE_SIZE_IN_BYTES = 1024 * 1024 * 2; // 2MiB
const DOCUMENT_MIME_TYPES = /(text|application)/;

// Note: duplicate of the same variable in src/app/tenant-branding/tenant-branding.controller.ts
// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
const IMAGE_MIME_TYPES = /image\/(apng|gif|jpeg|png|svg\+xml|webp)/;

@ApiTags('Connect Advisor')
@ApiExtraModels(
  AuthenticationDto.AuthenticationLoginRequestDto,
  ConnectInvestorDto.ConnectAdvisorProfileInformationForInvestorDto,
  Dto.ConnectAdvisorAdditionalProfileInformationDto,
  Dto.ConnectAdvisorCreateRequestDto,
  Dto.ConnectAdvisorAccountInitialEmailVerificationRequestDto,
  Dto.ConnectAdvisorProfileInformationDto,
  Dto.ConnectAdvisorLoginRequestDto,
  Dto.ConnectTenantTradeNameAndSubdomainDto,
  Dto.ConnectTenantSetGoalTypesRequestDto,
  Dto.ConnectTenantGetGoalTypesResponseDto,
  Dto.ConnectPortfolioSummariesResponseDto,
  Dto.ConnectPortfolioSummaryRequestDto,
  Dto.ConnectPortfolioSummaryAssetClassAllocationItemDto,
  Dto.ConnectAdvisorLeadsResponseDto,
  Dto.ConnectAdvisorLeadsResponseItemDto,
  Dto.ConnectAdvisorLeadsRequestDto,
  Dto.ConnectAdvisorProfileBioInputDto,
  Dto.ConnectAdvisorResetPasswordRequestDto,
  Dto.ConnectAdvisorContactMeRequestDto,
  TenantBrandingDto.TenantBrandingDto,
  DocumentsDto.ConnectLegalDocumentsResponse,
  CommonSwaggerDto.SwaggerColossusHttpErrorDto,
  Dto.ConnectAdvisorSendResetPasswordEmailOtpRequestDto,
  Dto.ConnectAdvisorCreateResponseDto,
  Dto.ConnectAdvisorPreferencesReadApiDto,
  Dto.ConnectAdvisorPreferencesUpdateApiDto,
  Dto.ConnectAdvisorLeadsUpdateRequestDto,
  Dto.ConnectAdvisorResendInitialVerificationOtpRequestDto,
  CommonSwaggerDto.GenericDataSummaryDto,
  CommonSwaggerDto.GenericDataSummaryFieldDto,
  Dto.ConnectAdvisorRiskProfileResponseDto
)
@Controller('connect/advisor')
export class ConnectAdvisorController {
  readonly #logger = new Logger(ConnectAdvisorController.name);

  constructor(
    private readonly keycloakFusionAuthSwitchoverConfig: ConfigService<IKeycloakFusionAuthSwitchoverConfigDto>,
    private readonly connectAdvisorService: ConnectAdvisorServiceBase,
    private readonly connectTenantGoalTypeCentralDbRepository: ConnectTenantGoalTypeCentralDbRepositoryService,
    private readonly connectPortfolioSummaryCentralDbRepository: ConnectPortfolioSummaryCentralDbRepositoryService,
    private readonly legalDocumentsService: LegalDocumentsServiceBase,
    private readonly tenantService: TenantServiceBase,
    private readonly tenantBrandingService: TenantBrandingServiceBase,
    private readonly riskProfileService: RiskProfilingDomainServiceBase,
    private readonly transactInvestorSwitchoverConfig: ConfigService<ITransactInvestorSwitchoverConfigDto>
  ) {}

  @Roles('Advisor')
  @Version('1')
  @Post('leads')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get leads.',
  })
  @ApiBody({
    type: Dto.ConnectAdvisorLeadsRequestDto,
  })
  @ApiResponse({
    status: 200,
    type: Dto.ConnectAdvisorLeadsResponseDto,
  })
  @ApiResponse({ status: 403 })
  public async GetLeads(
    @Body() payload: Dto.ConnectAdvisorLeadsRequestDto,
    @Decorators.RequestId() requestId: string,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto
  ): Promise<ConnectLeadsDto.IConnectLeadsDto> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetLeads.name,
      requestId
    );

    try {
      const useLegacyMethod: boolean =
        this.transactInvestorSwitchoverConfig.getOrThrow(
          'transactInvestorSwitchover.useLegacyTransactForInvestorCreation',
          { infer: true }
        );

      this.#logger.debug(`${logPrefix} useLegacyMethod: ${useLegacyMethod}.`);

      const { sub: userId, realm: tenantId } = claims;

      if (!useLegacyMethod) {
        return await this.connectAdvisorService.GetConnectInvestorLeads(
          requestId,
          {
            tenantId,
            userId,
            ...payload,
          }
        );
      }

      return await this.connectAdvisorService.GetConnectLeads(requestId, {
        tenantId,
        userId,
        ...payload,
      });
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  // @Roles('Advisor')
  // @Version('1')
  // @Get('income-thresholds')
  // @ApiBearerAuth()
  // @UseInterceptors(ClassSerializerInterceptor)
  // @HttpCode(200)
  // @ApiOperation({
  //   summary: 'Get income thresholds.',
  //   operationId: 'GetIncomeThresholds',
  // })
  // @ApiResponse({
  //   status: 200,
  //   schema: {
  //     $ref: getSchemaPath(Dto.ConnectTenantTradeNameAndSubdomainDto),
  //   },
  // })
  // @ApiResponse({ status: 403 })
  // public async GetIncomeThresholds(
  //   @Req() httpRequest: IColossusHttpRequestDto
  // ): Promise<{
  //   portfolioSummaries: Dto.ConnectPortfolioSummariesResponseDto[];
  // }> {
  //   try {
  //     const {
  //       claims: { realm: tenantRealm },
  //     } = httpRequest;
  //   } catch (error) {
  //     if (error instanceof InvalidCredentialsError) {
  //       throw new UnauthorizedException(error.message, 'INVALID_CREDENTIALS');
  //     }
  //     throw error;
  //   }
  // }

  @Roles('Advisor')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Version('1')
  @Post('profile/picture/public')
  @HttpCode(204)
  @ApiOperation({
    summary:
      'Set a profile picture for the advisor that is presented to investors.',
    operationId: 'SetProfilePicture',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 204,
    description: 'Profile picture has been uploaded.',
  })
  public async SetProfilePicture(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE_IN_BYTES }),
          new FileTypeValidator({ fileType: IMAGE_MIME_TYPES }),
        ],
      })
    )
    file: Express.Multer.File,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<void> {
    const loggingPrefix: string = LoggingUtils.generateLogPrefix(
      this.SetProfilePicture.name,
      tracking.requestId
    );
    const tempFilePath: string = file.path;
    this.#logger.debug(
      `${loggingPrefix} The temp file path is: ${tempFilePath}.`
    );

    try {
      const entryMessage: string = [
        `${loggingPrefix} Setting advisor profile picture.`,
        `User: ${claims.email}.`,
      ].join(' ');
      this.#logger.log(entryMessage);

      const { realm: tenantRealm } = claims;
      const tenantId: string =
        await this.tenantService.GetTenantIdFromTenantName(tenantRealm);

      await this.connectAdvisorService.SetProfilePicture({
        tenantId,
        filePath: file.path,
        originalFilename: file.originalname,
        contentType: file.mimetype,
        userId: claims.sub,
        tracking,
      });
    } catch (error) {
      const errorMessage: string = [
        `${loggingPrefix} Failed to set legal document.`,
        `Error: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');

      this.#logger.error(errorMessage);

      ErrorUtils.handleHttpControllerError(error);
    } finally {
      fs.unlink(tempFilePath, (err) => {
        if (err) {
          this.#logger.error(
            `${loggingPrefix} Failed to delete temp file. Error: ${JsonUtils.Stringify(
              err
            )}.`
          );
          return;
        }

        this.#logger.debug(
          `${loggingPrefix} Temp file deleted. Path: ${tempFilePath}.`
        );
      });
    }
  }

  @Roles('Advisor')
  @ApiBearerAuth()
  @Version('1')
  @Delete('profile/picture/public')
  @HttpCode(204)
  @ApiOperation({
    summary:
      'Unset the profile picture for the advisor that is presented to investors.',
    operationId: 'UnsetProfilePicture',
  })
  @ApiResponse({
    status: 204,
    description: 'The profile picture has been unset.',
  })
  public async UnsetProfilePicture(
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<void> {
    const { sub: userId, realm: tenantRealm } = claims;
    const tenantId = await this.tenantService.GetTenantIdFromTenantName(
      tenantRealm
    );
    await this.connectAdvisorService.UnsetProfilePicture({
      tenantId,
      userId,
      tracking,
    });
  }

  @Roles('Advisor')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Version('1')
  @Post('profile/picture/internal')
  @HttpCode(204)
  @ApiOperation({
    summary:
      "Set a profile picture for the advisor' internal use on the platform.",
    operationId: 'SetInternalProfilePicture',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 204,
    description: 'Profile picture has been uploaded.',
  })
  public async SetInternalProfilePicture(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE_IN_BYTES }),
          new FileTypeValidator({ fileType: IMAGE_MIME_TYPES }),
        ],
      })
    )
    file: Express.Multer.File,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<void> {
    const loggingPrefix: string = LoggingUtils.generateLogPrefix(
      this.SetProfilePicture.name,
      tracking.requestId
    );
    const tempFilePath: string = file.path;
    this.#logger.debug(
      `${loggingPrefix} The temp file path is: ${tempFilePath}.`
    );

    try {
      const entryMessage: string = [
        `${loggingPrefix} Setting internal advisor profile picture.`,
        `User: ${claims.email}.`,
      ].join(' ');
      this.#logger.log(entryMessage);

      const { realm: tenantRealm } = claims;
      const tenantId: string =
        await this.tenantService.GetTenantIdFromTenantName(tenantRealm);

      await this.connectAdvisorService.SetInternalProfilePicture({
        tenantId,
        filePath: file.path,
        originalFilename: file.originalname,
        contentType: file.mimetype,
        userId: claims.sub,
        tracking,
      });
    } catch (error) {
      const errorMessage: string = [
        `${loggingPrefix} Failed to set legal document.`,
        `Error: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');

      this.#logger.error(errorMessage);

      ErrorUtils.handleHttpControllerError(error);
    } finally {
      fs.unlink(tempFilePath, (err) => {
        if (err) {
          this.#logger.error(
            `${loggingPrefix} Failed to delete temp file. Error: ${JsonUtils.Stringify(
              err
            )}.`
          );
          return;
        }

        this.#logger.debug(
          `${loggingPrefix} Temp file deleted. Path: ${tempFilePath}.`
        );
      });
    }
  }

  @Roles('Advisor')
  @ApiBearerAuth()
  @Version('1')
  @Delete('profile/picture/internal')
  @HttpCode(204)
  @ApiOperation({
    summary:
      "Unset the profile picture for the advisor' internal use on the platform.",
    operationId: 'UnsetInternalProfilePicture',
  })
  @ApiResponse({
    status: 204,
    description: 'The internal profile picture has been unset.',
  })
  public async UnsetInternalProfilePicture(
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<void> {
    const { sub: userId, realm: tenantRealm } = claims;
    const tenantId = await this.tenantService.GetTenantIdFromTenantName(
      tenantRealm
    );
    await this.connectAdvisorService.UnsetInternalProfilePicture({
      tenantId,
      userId,
      tracking,
    });
  }

  @Roles('Vendee-Admin')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Version('1')
  @Post('legal-document')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Set a legal document.',
    operationId: 'SetLegalDocument',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiQuery({
    name: 'documentType',
    description: `Legal document type. Possible values are: 'PRIVACY_POLICY' and 'TERMS_AND_CONDITIONS'`,
    required: true,
    type: 'string',
  })
  @ApiResponse({
    status: 204,
    description: 'Request successful.',
  })
  public async SetLegalDocument(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE_IN_BYTES }),
          new FileTypeValidator({ fileType: DOCUMENT_MIME_TYPES }),
        ],
      })
    )
    file: Express.Multer.File,
    @Query('documentType') documentType: LegalDocumentsEnum,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<void> {
    const loggingPrefix: string = LoggingUtils.generateLogPrefix(
      this.SetLegalDocument.name,
      tracking.requestId
    );
    const tempFilePath: string = file.path;
    this.#logger.debug(
      `${loggingPrefix} The temp file path is: ${tempFilePath}.`
    );

    try {
      const entryMessage: string = [
        `${loggingPrefix} Setting legal document.`,
        `Document type: ${documentType}.`,
        `User: ${claims.email}.`,
      ].join(' ');
      this.#logger.log(entryMessage);

      const { realm: tenantRealm } = claims;
      const tenantId: string =
        await this.tenantService.GetTenantIdFromTenantName(tenantRealm);

      await this.legalDocumentsService.SetLegalDocument({
        tenantId,
        documentType,
        filePath: file.path,
        originalFilename: file.originalname,
        contentType: file.mimetype,
        tracking,
      });
    } catch (error) {
      const errorMessage: string = [
        `${loggingPrefix} Failed to set legal document.`,
        `Error: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');

      this.#logger.error(errorMessage);

      ErrorUtils.handleHttpControllerError(error);
    } finally {
      fs.unlink(tempFilePath, (err) => {
        if (err) {
          this.#logger.error(
            `${loggingPrefix} Failed to delete temp file. Error: ${JsonUtils.Stringify(
              err
            )}.`
          );
          return;
        }

        this.#logger.debug(
          `${loggingPrefix} Temp file deleted. Path: ${tempFilePath}.`
        );
      });
    }
  }

  @Roles('Vendee-Admin')
  @ApiBearerAuth()
  @Version('1')
  @Delete('legal-document')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Unset a legal document.',
    operationId: 'UnsetLegalDocument',
  })
  @ApiQuery({
    name: 'documentType',
    description: `Legal document type. Possible values are: 'PRIVACY_POLICY' and 'TERMS_AND_CONDITIONS'`,
    required: true,
    type: 'string',
  })
  @ApiResponse({
    status: 204,
    description: 'Brand name and subdomain for a tenant.',
  })
  public async UnsetLegalDocument(
    @Query('documentType') documentType: LegalDocumentsEnum,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<void> {
    const { realm: tenantRealm } = claims;
    const tenantId = await this.tenantService.GetTenantIdFromTenantName(
      tenantRealm
    );
    await this.legalDocumentsService.UnsetLegalDocument({
      tenantId,
      documentType,
      tracking,
    });
  }

  @Roles('Advisor')
  @ApiBearerAuth()
  @Version('1')
  @Get('legal-document')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get an object of URLs to legal documents.',
    operationId: 'GetLegalDocuments',
  })
  @ApiResponse({
    status: 200,
    description: 'Brand name and subdomain for a tenant.',
    schema: {
      $ref: getSchemaPath(DocumentsDto.ConnectLegalDocumentsResponse),
    },
  })
  public async GetLegalDocuments(
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<ConnectLegalDocumentsDto.IConnectLegalDocumentsDto> {
    const { realm: tenantRealm } = claims;
    const tenantId = await this.tenantService.GetTenantIdFromTenantName(
      tenantRealm
    );
    const ret = await this.legalDocumentsService.GetLegalDocumentSet(
      tenantId,
      tracking
    );
    return { ...ret };
  }

  @Roles('Vendee-Admin')
  @ApiBearerAuth()
  @Version('1')
  @Get('brand-and-subdomain')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Returns the brand name and subdomain for a tenant.',
    operationId: 'GetTradeNameAndSubdomain',
  })
  @ApiResponse({
    status: 200,
    description: 'Brand name and subdomain for a tenant.',
    type: Dto.ConnectTenantTradeNameAndSubdomainDto,
    schema: {
      $ref: getSchemaPath(Dto.ConnectTenantTradeNameAndSubdomainDto),
    },
  })
  public async GetTradeNameAndSubdomain(
    @Req() httpRequest: IColossusHttpRequestDto
  ): Promise<ConnectTenantDto.IConnectTenantTradeNameAndSubdomainDto> {
    const {
      claims: { realm: tenantRealm },
    } = httpRequest;
    const tenantId = await this.tenantService.GetTenantIdFromTenantName(
      tenantRealm
    );
    return await this.connectAdvisorService.GetTradeNameAndSubdomain(tenantId);
  }

  @Roles('Vendee-Admin')
  @ApiBearerAuth()
  @Version('1')
  @Patch('brand-and-subdomain')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Set the brand name and subdomain for a tenant.',
  })
  @ApiBody({
    description: 'Input payload',
    type: Dto.ConnectTenantTradeNameAndSubdomainDto,
    schema: {
      $ref: getSchemaPath(Dto.ConnectTenantTradeNameAndSubdomainDto),
    },
  })
  @ApiResponse({
    status: 204,
    description: 'Completed successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad input.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          SUBDOMAIN_MISSING: {
            value: {
              error: 'Error',
              errorCode: 'SUBDOMAIN_MISSING',
              statusCode: 400,
              message: 'Subdomain is missing. Please provide a subdomain.',
              requestId: '07b4aec3-9a8f-4fd4-a8fa-7a22042cb91a',
            },
          },
          FORBIDDEN_SUBDOMAIN: {
            value: {
              error: 'Error',
              errorCode: 'FORBIDDEN_SUBDOMAIN',
              statusCode: 400,
              message:
                'Subdomain is not allowed. Please choose a different subdomain.',
              requestId: '1f5253e1-99d2-4197-aa10-94059ed204ec',
            },
          },
          SUBDOMAIN_INVALID: {
            value: {
              error: 'Error',
              errorCode: 'SUBDOMAIN_INVALID',
              statusCode: 400,
              message:
                "Subdomain contains invalid characters. Please choose a different subdomain. Invalid characters: [' ','Æ'].",
              requestId: '29fa7ca3-8f1a-4278-8846-5a022780363c',
            },
          },
        },
      },
    },
  })
  public async SetTradeNameAndSubdomain(
    @Req() httpRequest: IColossusHttpRequestDto,
    @Body() payload: ConnectTenantDto.IConnectTenantTradeNameAndSubdomainDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<void> {
    try {
      const {
        claims: { realm: tenantRealm },
      } = httpRequest;

      return await this.connectAdvisorService.SetTradeNameAndSubdomain({
        tenantIdOrRealm: tenantRealm,
        payload: payload,
        tracking,
      });
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @ApiBearerAuth()
  @Version('1')
  @Get('branding')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Returns branding info for a tenant.',
    operationId: 'GetTenantBranding',
  })
  @ApiResponse({
    status: 200,
    description: 'Branding info for a tenant.',
    type: TenantBrandingDto.TenantBrandingDto,
    schema: {
      $ref: getSchemaPath(TenantBrandingDto.TenantBrandingDto),
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
          TENANT_ALREADY_EXISTS: {
            value: {
              error: 'Error',
              errorCode: 'TENANT_ALREADY_EXISTS',
              statusCode: 409,
              message:
                'Unable to create tenant, tenant already exists on platform.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  public async GetTenantBranding(
    @Req() httpRequest: IColossusHttpRequestDto
  ): Promise<ITenantBrandingDto.ITenantBrandingDto> {
    const {
      claims: { realm: tenantRealm },
    } = httpRequest;
    const tenantId = await this.tenantService.GetTenantIdFromTenantName(
      tenantRealm
    );
    return await this.tenantBrandingService.GetBranding({ tenantId });
  }

  @Public()
  @Version('1')
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Create new advisor on the Connect platform.',
    description: [
      "Creates an advisor on the Connect platform. In doing so, returns an access token and a refresh token, and sends an OTP to the advisor's email address. The advisor must then verify their email address by calling the verify-email-initial endpoint before being given access to most endpoints.",
      `The response body is not 100% documented here.`,
    ].join(' '),
    externalDocs: {
      description: 'FusionAuth documentation for response',
      url: 'https://fusionauth.io/docs/v1/tech/apis/registrations#create-a-user-and-registration-combined',
    },
  })
  @ApiBody({
    description: 'Input payload',
    type: Dto.ConnectAdvisorCreateRequestDto,
    schema: {
      $ref: getSchemaPath(Dto.ConnectAdvisorCreateRequestDto),
    },
  })
  @ApiResponse({
    status: 201,
    type: AuthenticationDto.AuthenticationLoginResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad input error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          UNHANDLED_IAM_SERVICE_ERROR: {
            value: {
              error: 'Error',
              errorCode: 'UNHANDLED_IAM_SERVICE_ERROR',
              statusCode: 400,
              message:
                '[duplicate]tenant.name: A tenant with name [foo_eggs_at_bar_com] already exists.',
              requestId: 'dc2b05e4-c262-4263-a23b-0a80d2dcae45',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Bad input error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          TENANT_ALREADY_EXISTS_IN_DB: {
            value: {
              error: 'Error',
              errorCode: 'TENANT_ALREADY_EXISTS',
              statusCode: 409,
              message:
                'Unable to create tenant, tenant already exists on platform database.',
              requestId: 'dc2b05e4-c262-4263-a23b-0a80d2dcae45',
            },
          },
          TENANT_USER_ALREADY_EXISTS: {
            value: {
              error: 'Error',
              errorCode: 'TENANT_USER_ALREADY_EXISTS',
              statusCode: 409,
              message:
                'User already is in another tenant or has an existing tenant on the platform.',
              requestId: 'dc2b05e4-c262-4263-a23b-0a80d2dcae45',
            },
          },
        },
      },
    },
  })
  public async Create(
    @Body() credentials: Dto.ConnectAdvisorCreateRequestDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<IAuthenticationDto.IAuthenticationLoginResponseDto> {
    // Note: the associated env var for this config option is USE_LEGACY_KEYCLOAK_FOR_TENANT_CREATION
    // which takes on value 0 (false) or 1 (true). It defaults to 0 (false).
    const useLegacyKeycloakForTenantCreation =
      this.keycloakFusionAuthSwitchoverConfig.getOrThrow(
        'keycloakFusionAuthSwitchover.useLegacyKeycloakForTenantCreation',
        { infer: true }
      );
    this.#logger.debug(
      `useLegacyKeycloakForTenantCreation = ${useLegacyKeycloakForTenantCreation}`
    );
    // try and catch fallthrough from the private functions
    if (useLegacyKeycloakForTenantCreation) {
      return await this.CreateViaKeycloak(credentials, tracking);
    } else {
      return await this.CreateViaFusionAuth(credentials, tracking);
    }
  }

  private async CreateViaKeycloak(
    credentials: Dto.ConnectAdvisorCreateRequestDto,
    tracking: IColossusTrackingDto
  ): Promise<AuthenticationDto.AuthenticationLoginResponseDto> {
    try {
      return await this.connectAdvisorService.Create(tracking, credentials);
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  private async CreateViaFusionAuth(
    credentials: Dto.ConnectAdvisorCreateRequestDto,
    tracking: IColossusTrackingDto
  ): Promise<AuthenticationDto.AuthenticationLoginResponseDto> {
    try {
      return await this.connectAdvisorService.CreateAdvisorTenantWithInitialUserViaFusionAuth(
        tracking,
        credentials
      );
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Public()
  @Version('1')
  @Post('initial-verification/resend-otp')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(201)
  @ApiOperation({
    summary: 'Sends new OTP for user verification.',
  })
  @ApiBody({
    description: 'Input payload.',
    type: Dto.ConnectAdvisorResendInitialVerificationOtpRequestDto,
    schema: {
      $ref: getSchemaPath(
        Dto.ConnectAdvisorResendInitialVerificationOtpRequestDto
      ),
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
          TENANT_NOT_FOUND: {
            summary: 'Error when tenant not found for user.',
            value: {
              error: 'Error',
              errorCode: 'TENANT_NOT_FOUND',
              statusCode: 404,
              message:
                'Tenant does not exist for email (otp-test-user+1@bambu.co).',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
          TENANT_USER_NOT_FOUND: {
            summary: 'Error when no user is found for tenant.',
            value: {
              error: 'Error',
              errorCode: 'TENANT_USER_NOT_FOUND',
              statusCode: 404,
              message:
                'Tenant does have user with requested email (otp-test-user+1@bambu.co).',
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
          TENANT_USER_OTP_ALREADY_VERIFIED: {
            value: {
              error: 'Error',
              errorCode: 'TENANT_USER_OTP_ALREADY_VERIFIED',
              statusCode: 409,
              message:
                'The email (otp-test-user+1@bambu.co) already has been OTP verified.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'New OTP is generated and resent. Body will have no content',
  })
  public async ResendInitialVerificationOtp(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Body()
    { email }: Dto.ConnectAdvisorResendInitialVerificationOtpRequestDto
  ) {
    try {
      await this.connectAdvisorService.ResendTenantOtp(
        tracking.requestId,
        email
      );
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Get('portfolio-summary')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get portfolio summaries for advisor.',
    operationId: 'GetPortfolioSummaries',
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        portfolioSummaries: {
          type: 'array',
          items: {
            $ref: getSchemaPath(Dto.ConnectPortfolioSummariesResponseDto),
          },
        },
      },
    },
  })
  @ApiResponse({ status: 403 })
  public async GetPortfolioSummaries(
    @Req() httpRequest: IColossusHttpRequestDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<{
    portfolioSummaries: Dto.ConnectPortfolioSummariesResponseDto[];
  }> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetPortfolioSummaries.name,
      tracking.requestId
    );

    try {
      const {
        claims: { realm: tenantRealm },
      } = httpRequest;
      const res =
        await this.connectPortfolioSummaryCentralDbRepository.GetConnectPortfolioSummaries(
          {
            tenantRealm,
            requestId: tracking.requestId,
          }
        );
      this.#logger.debug(`GetPortfolioSummaries: ${JSON.stringify(res)}`);
      return {
        portfolioSummaries: res,
      };
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);

      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message, 'INVALID_CREDENTIALS');
      }
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Post('portfolio-summary')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(204)
  @ApiOperation({
    summary: 'Set a portfolio summary.',
    operationId: 'SetPortfolioSummary',
  })
  @ApiBody({
    description: 'Input payload',
    type: Dto.ConnectPortfolioSummaryRequestDto,
    schema: {
      $ref: getSchemaPath(Dto.ConnectPortfolioSummaryRequestDto),
    },
  })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 403 })
  public async SetPortfolioSummary(
    @Body() connectPortfolioSummaryDto: Dto.ConnectPortfolioSummaryRequestDto,
    @Req() httpRequest: IColossusHttpRequestDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<void> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.SetPortfolioSummary.name,
      tracking.requestId
    );

    try {
      const {
        claims: { realm: tenantRealm },
      } = httpRequest;
      await this.connectAdvisorService.SetConnectPortfolioSummary({
        connectPortfolioSummaryDto,
        tracking,
        tenantRealm,
      });
    } catch (error) {
      this.#logger.error(`${logPrefix} Error: ${JsonUtils.Stringify(error)}.`);

      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message, 'INVALID_CREDENTIALS');
      }
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Patch('profile')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(204)
  @ApiOperation({
    summary:
      'Persists some account and personal information about the advisor on the platform.',
    operationId: 'UpdateProfile',
  })
  @ApiBody({
    description: 'Input payload',
    type: Dto.ConnectAdvisorAdditionalProfileInformationDto,
    schema: {
      $ref: getSchemaPath(Dto.ConnectAdvisorAdditionalProfileInformationDto),
    },
  })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 403 })
  public async UpdateProfile(
    @Body()
    credentials: Dto.ConnectAdvisorAdditionalProfileInformationDto,
    @Req() httpRequest: IColossusHttpRequestDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<void> {
    try {
      const {
        claims: { sub: userId, realm: tenantRealm },
      } = httpRequest;
      return await this.connectAdvisorService.UpdateProfile(
        tracking.requestId,
        {
          ...credentials,
          userId,
          tenantRealm,
        }
      );
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message, 'INVALID_CREDENTIALS');
      }
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Patch('profile-bio')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(204)
  @ApiOperation({
    summary: 'Persists Connect profile summary (rich text) and a profile link.',
  })
  @ApiBody({
    description: 'Input payload',
    type: Dto.ConnectAdvisorProfileBioInputDto,
    schema: {
      $ref: getSchemaPath(Dto.ConnectAdvisorProfileBioInputDto),
    },
  })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 403 })
  public async SetProfileBio(
    @Body('richText') profileBioRichTextUnsafe: string,
    @Body('fullProfileLink') fullProfileLink: string,
    @Req() httpRequest: IColossusHttpRequestDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<void> {
    try {
      const {
        claims: { sub: userId, realm },
      } = httpRequest;
      const { requestId } = tracking;
      const profileBioRichText = sanitizeHtml(profileBioRichTextUnsafe);

      const tenant = await this.tenantService.GetTenantFromTenantNameSafe(
        requestId,
        realm
      );

      if (!tenant) {
        // noinspection ExceptionCaughtLocallyJS
        throw ErrorUtils.getDefaultMissingTenantInDbErrorWithTenantId({
          tenantId: realm,
          requestId,
        });
      }

      /**
       * Workaround.
       *
       * We are moving towards using UUIDs for tenant realms, but we still have some legacy code that uses tenant names.
       */
      const tenantRealm: string = tenant.realm;

      await Promise.all([
        this.connectAdvisorService.SetProfileBio(
          {
            profileBioRichText,
            userId,
            tenantRealm,
            fullProfileLink,
          },
          tracking
        ),
        this.connectAdvisorService.FlushInvestorPortalCachedHtml(
          requestId,
          tenantRealm
        ),
      ]);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message, 'INVALID_CREDENTIALS');
      }
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Patch('contact-me')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(204)
  @ApiOperation({
    summary: 'Persists Connect contact me reasons (rich text).',
    operationId: 'SetContactMeReasons',
  })
  @ApiBody({
    description: 'Input payload',
    type: Dto.ConnectAdvisorContactMeRequestDto,
    schema: {
      $ref: getSchemaPath(Dto.ConnectAdvisorContactMeRequestDto),
    },
  })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 403 })
  public async SetContactMeReasons(
    @Body() contactMeRequest: Dto.ConnectAdvisorContactMeRequestDto,
    @Req() httpRequest: IColossusHttpRequestDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<void> {
    try {
      const {
        claims: { sub: userId, realm },
      } = httpRequest;
      if (contactMeRequest.richText) {
        contactMeRequest.richText = sanitizeHtml(contactMeRequest.richText);
      }

      const tenant = await this.tenantService.GetTenantFromTenantNameSafe(
        tracking.requestId,
        realm
      );

      if (!tenant) {
        // noinspection ExceptionCaughtLocallyJS
        throw ErrorUtils.getDefaultMissingTenantInDbErrorWithTenantId({
          tenantId: realm,
          requestId: tracking.requestId,
        });
      }

      /**
       * Workaround.
       *
       * We are moving towards using UUIDs for tenant realms, but we still have some legacy code that uses tenant names.
       */
      const tenantRealm: string = tenant.realm;

      return await this.connectAdvisorService.SetContactData(
        {
          contactMeReasonsRichText: contactMeRequest.richText,
          contactLink: contactMeRequest.contactLink,
          userId,
          tenantRealm,
        },
        tracking
      );
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message, 'INVALID_CREDENTIALS');
      }
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Get('profile')
  @ApiBearerAuth()
  @AllowEmailUnverified()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Retrieves some user information associated with the advisor.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile information.',
    schema: {
      $ref: getSchemaPath(Dto.ConnectAdvisorProfileInformationDto),
    },
  })
  @ApiResponse({ status: 403 })
  public async GetProfile(
    @Req() httpRequest: IColossusHttpRequestDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<Dto.ConnectAdvisorProfileInformationDto> {
    try {
      const {
        claims: {
          sub: userId,
          realm: tenantRealm,
          preferred_username: username,
          email_verified: emailVerified,
        },
      } = httpRequest;
      const tenantId = await this.tenantService.GetTenantIdFromTenantName(
        tenantRealm
      );

      if (!emailVerified) {
        return {
          username,
          emailVerified,
          userId,
          tenantRealm,
          subdomain: null,
          contactLink: null,
          fullProfileLink: null,
          advisorProfilePictureUrl: null,
          profileBioRichText: null,
          contactMeReasonsRichText: null,
          advisorInternalProfilePictureUrl: null,
          firstName: null,
          lastName: null,
          jobTitle: null,
          countryOfResidence: null,
          businessName: null,
          hasActiveSubscription: false,
          subscriptions: [],
          platformSetupStatus: null,
        };
      }
      const profile = await this.connectAdvisorService.GetProfile({
        userId,
        tenantRealm,
        requestId: tracking.requestId,
      });
      let subdomain: string | null = null;
      try {
        subdomain = (
          await this.connectAdvisorService.GetTradeNameAndSubdomain(tenantId)
        ).subdomain;
      } catch (error) {
        this.#logger.error(error);
      }
      return {
        ...profile,
        username,
        emailVerified,
        userId,
        tenantRealm,
        subdomain,
      };
    } catch (error) {
      this.#logger.error(error);
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Vendee-Admin')
  @Version('1')
  @Post('goal-types')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Sets the goal types offered by the advisor.',
  })
  @ApiBody({
    description: 'Input payload',
    type: Dto.ConnectTenantSetGoalTypesRequestDto,
    schema: {
      $ref: getSchemaPath(Dto.ConnectTenantSetGoalTypesRequestDto),
    },
  })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 403 })
  @ApiResponse({
    status: 500,
    description: 'HTTP 500 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          INVALID_SESSION_CLAIMS: {
            summary: 'When claims cannot be extracted from session.',
            value: {
              error: 'Error',
              errorCode: 'INVALID_SESSION_CLAIMS',
              statusCode: 500,
              message: [
                `Error while binding identity claims to request.`,
                `Please check access token and access binding.`,
              ].join(' '),
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  public async SetGoalTypes(
    @Body() { goalTypeIds }: Dto.ConnectTenantSetGoalTypesRequestDto,
    @Req() httpRequest: IColossusHttpRequestDto,
    @Decorators.Tracking() trackingData: IColossusTrackingDto
  ): Promise<void> {
    try {
      const { requestId, requesterId } = trackingData;
      await this.connectAdvisorService.SetGoalTypes({
        requestId,
        tenantRealm: httpRequest?.claims?.realm,
        goalTypeIds,
        userIdForLogging: requesterId,
        trackPlatformSetupProgress: true,
      });
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Vendee-Admin')
  @Version('1')
  @Get('goal-types')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get the goal types that the advisor might offer.',
    operationId: 'GetGoalTypes',
  })
  @ApiResponse({
    status: 200,
    type: Dto.ConnectTenantGetGoalTypesResponseDto,
    schema: {
      $ref: getSchemaPath(Dto.ConnectTenantGetGoalTypesResponseDto),
    },
  })
  @ApiResponse({ status: 403 })
  public async GetGoalTypes(
    @Req() httpRequest: IColossusHttpRequestDto
  ): Promise<{
    goalTypes: ConnectTenantDto.IConnectTenantGoalTypeForTenantDto[];
  }> {
    const {
      claims: { realm: tenantRealm },
    } = httpRequest;
    return {
      goalTypes:
        await this.connectTenantGoalTypeCentralDbRepository.GetTenantGoalTypesForTenant(
          { tenantRealm }
        ),
    };
  }

  @Public()
  @Version('1')
  @Post('verify-email-initial')
  @ApiOperation({
    summary:
      'Enables a user account with an OTP that should have been sent to their email upon account creation. If a refresh token is provided, and email is verified at the end of OTP verification, then new tokens will be returned.',
    operationId: 'VerifyEmailInitial',
  })
  @ApiBody({
    description: 'Input payload',
    type: Dto.ConnectAdvisorAccountInitialEmailVerificationRequestDto,
    schema: {
      $ref: getSchemaPath(
        Dto.ConnectAdvisorAccountInitialEmailVerificationRequestDto
      ),
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'The email has been verified. A new set of tokens is returned.',
    schema: {
      $ref: getSchemaPath(AuthenticationDto.AuthenticationLoginResponseDto),
    },
  })
  @ApiResponse({
    status: 205,
    description:
      'The email has been verified. The user will likely need to refresh their tokens or login again to access endpoints that require a verified email.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Perhaps the OTP is invalid.',
  })
  public async VerifyEmailInitial(
    @Body()
    connectVerifyAdvisorEmailDto: Dto.ConnectAdvisorAccountInitialEmailVerificationRequestDto,
    @Res({ passthrough: true }) res: Response,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<IAuthenticationDto.IAuthenticationLoginResponseDto | void> {
    const result = await this.connectAdvisorService.VerifyUserEmailByEmailOtp(
      tracking.requestId,
      connectVerifyAdvisorEmailDto
    );

    try {
      if (typeof result === 'boolean') {
        this.ensureVerifyEmailInitialResponseIsGood(tracking, result);

        if (result === true) {
          res.status(205);
          return;
        }
      } else {
        res.status(201);

        return result;
      }
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error, tracking.requestId);
    }
  }

  private ensureVerifyEmailInitialResponseIsGood(
    tracking: IColossusTrackingDto,
    response: boolean | IAuthenticationDto.IAuthenticationLoginResponseDto
  ): void {
    if (typeof response === 'boolean' && response === false) {
      throw new ErrorUtils.ColossusError(
        `The OTP may be invalid.`,
        tracking.requestId,
        { response },
        400,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.INVALID_OTP
      );
    }
  }

  @Public()
  @Version('1')
  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Logs an advisor in on the Connect platform. It should perform the same action as the core /login endpoint, but with an inferred realmId.',
  })
  @ApiBody({
    description: 'Input payload',
    type: Dto.ConnectAdvisorLoginRequestDto,
    schema: {
      $ref: getSchemaPath(Dto.ConnectAdvisorLoginRequestDto),
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'A set of claims for a user encoded as an access token, along with a refresh token.',
    schema: {
      $ref: getSchemaPath(AuthenticationDto.AuthenticationLoginResponseDto),
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'Forbidden. Invalid credentials. Perhaps the username or password is incorrect.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          INVALID_CREDENTIALS: {
            value: {
              error: 'Error',
              errorCode: 'INVALID_CREDENTIALS',
              statusCode: 401,
              message: 'Invalid credentials.',
              requestId: 'b7a81852-0d8d-4543-8888-8af92ba88fae',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description:
      'The state of the user is not an in expected state to allow login.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          OTP_REQUIRED: {
            value: {
              error: 'Error',
              errorCode: 'OTP_REQUIRED',
              statusCode: 409,
              message: "The user's email has not been verified.",
              requestId: 'b4465886-3652-441a-8b25-41c7376f6695',
            },
          },
        },
      },
    },
  })
  public async Login(
    @Body() credentials: Dto.ConnectAdvisorLoginRequestDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<IAuthenticationDto.IAuthenticationLoginResponseDto> {
    try {
      return await this.connectAdvisorService.Login(
        tracking.requestId,
        credentials
      );
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message, 'INVALID_CREDENTIALS');
      }
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Get('top-level-options')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Function to get the top level options for an advisor.',
  })
  @ApiResponse({
    status: 200,
    type: Dto.ConnectTenantSetTopLevelOptionsRequestDto,
  })
  public async GetTopLevelOptions(
    @Req() httpRequest: IColossusHttpRequestDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<Dto.ConnectTenantSetTopLevelOptionsRequestDto> {
    const {
      claims: { realm: tenantRealm },
    } = httpRequest;

    try {
      return this.connectAdvisorService.GetTenantTopLevelOptions(
        tracking,
        tenantRealm
      );
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Patch('top-level-options')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Function to set the top level options for an advisor.',
  })
  @ApiBody({
    type: Dto.ConnectTenantSetTopLevelOptionsRequestDto,
  })
  @ApiResponse({
    status: 200,
    type: Dto.ConnectTenantSetTopLevelOptionsRequestDto,
  })
  public async SetTopLevelOptions(
    @Req() httpRequest: IColossusHttpRequestDto,
    @Body() payload: Dto.ConnectTenantSetTopLevelOptionsRequestDto,
    @Decorators.Tracking() trackingData: IColossusTrackingDto
  ): Promise<Dto.ConnectTenantSetTopLevelOptionsRequestDto> {
    const {
      claims: { realm: tenantId },
    } = httpRequest;

    try {
      return this.connectAdvisorService.SetTenantTopLevelOptions({
        payload,
        tenantId,
        tracking: trackingData,
      });
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Public()
  @Version('1')
  @Post('change-password')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(204)
  @ApiOperation({
    summary: 'Changes the password of an advisor.',
    operationId: 'ChangePassword',
  })
  @ApiBody({
    description: 'Input payload',
    type: Dto.ConnectAdvisorResetPasswordRequestDto,
    schema: {
      $ref: getSchemaPath(Dto.ConnectAdvisorResetPasswordRequestDto),
    },
  })
  @ApiResponse({
    status: 204,
    description: 'Password changed successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Perhaps the OTP is invalid.',
  })
  public async ChangePassword(
    @Body()
    credentials: Dto.ConnectAdvisorResetPasswordRequestDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<void> {
    try {
      const result = await this.connectAdvisorService.ChangePasswordByEmailOtp(
        credentials,
        tracking
      );
      if (result === false) {
        // noinspection ExceptionCaughtLocallyJS
        throw new ErrorUtils.ColossusError(
          'The OTP may be invalid.',
          tracking.requestId,
          {},
          400
        );
      }
    } catch (error) {
      if (error && !error.requestId) {
        error.requestId = tracking.requestId;
      }
      ErrorUtils.handleHttpControllerError(error);
      return;
    }
  }

  @Public()
  @Version('1')
  @Post('change-password/send-link')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(204)
  @ApiOperation({
    summary:
      "Sends an email to the given address (if an account exists with such an address) containing an link with token that is used to change the account's password.",
  })
  @ApiBody({
    description: 'Input payload.',
    type: Dto.ConnectAdvisorSendResetPasswordEmailOtpRequestDto,
  })
  @ApiResponse({
    status: 204,
    description:
      'An email is sent if the given address is associated with an account.',
  })
  public async SendChangePasswordEmailLink(
    @Body()
    params: Dto.ConnectAdvisorSendResetPasswordEmailOtpRequestDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.SendChangePasswordEmailLink.name,
      tracking.requestId
    );

    try {
      await this.connectAdvisorService.SendChangePasswordEmailLink(
        params,
        tracking
      );
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered: ${JsonUtils.Stringify(error)}.`,
        `This will silently fail, since we don't want to leak information about whether an email address is associated with an account.`,
      ].join(' ');

      this.#logger.error(errorMessage);
      // Silently fail, since we don't want to leak information about whether an email address is associated with an account.
      // ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Get('preferences')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Get preferences for advisor',
  })
  @ApiResponse({
    status: 404,
    description: 'Missing entry.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          PREFERENCES_MISSING: {
            value: {
              error: 'Error',
              errorCode: 'UNHANDLED',
              statusCode: 404,
              message: 'Advisor preferences not found.',
              requestId: '6d96cc11-827c-41bb-af47-57337024fa8f',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    type: Dto.ConnectAdvisorPreferencesReadApiDto,
    status: 200,
  })
  public async GetAdvisorPreferences(
    @Decorators.RequestId() requestId: string,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto
  ): Promise<Dto.ConnectAdvisorPreferencesReadApiDto> {
    try {
      const { sub: userId, realm: tenantId } = claims;

      const dbRow = await this.#getAdvisorPreferences(
        requestId,
        userId,
        tenantId
      );

      const {
        minimumRetirementSavingsThreshold,
        createdAt,
        updatedAt,
        minimumAnnualIncomeThreshold,
      } = dbRow;

      return {
        minimumRetirementSavingsThreshold,
        createdAt,
        updatedAt,
        minimumAnnualIncomeThreshold,
      };
    } catch (error) {
      if (error && !error.requestId) {
        error.requestId = requestId;
      }
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  async #getAdvisorPreferences(
    requestId: string,
    userId: string,
    tenantId: string
  ): Promise<IConnectAdvisorDto.IConnectAdvisorPreferencesDto> {
    const dbRow = await this.connectAdvisorService.GetConnectAdvisorPreferences(
      requestId,
      userId,
      tenantId
    );
    if (!dbRow) {
      throw new ErrorUtils.ColossusError(
        'Advisor preferences not found.',
        requestId,
        { userId, tenantId },
        404
      );
    }
    return dbRow;
  }

  @Roles('Advisor')
  @Version('1')
  @Put('preferences')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Update preferences for advisor.',
    description: [
      `Performs update of the advisor's preferences.`,
      `If the preferences do not exist, they will be created.`,
    ].join(' '),
  })
  @ApiResponse({
    type: Dto.ConnectAdvisorPreferencesReadApiDto,
    status: 200,
  })
  @ApiBody({
    description: 'Input payload',
    type: Dto.ConnectAdvisorPreferencesUpdateApiDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad input.',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          MINIMUM_RETIREMENT_NOT_VIABLE: {
            value: {
              error: 'Error',
              errorCode: 'MALFORMED_REQUEST',
              statusCode: 400,
              message:
                'Minimum retirement savings threshold must be greater than or equal to 0.',
              requestId: '07b4aec3-9a8f-4fd4-a8fa-7a22042cb91a',
            },
          },
          MINIMUM_ANNUAL_INCOME_NOT_VIABLE: {
            value: {
              error: 'Error',
              errorCode: 'MALFORMED_REQUEST',
              statusCode: 400,
              message:
                'Minimum annual income threshold must be greater than or equal to 0.',
              requestId: '07b4aec3-9a8f-4fd4-a8fa-7a22042cb91a',
            },
          },
          UPSERT_NOT_VIABLE: {
            value: {
              error: 'Error',
              errorCode: 'MALFORMED_REQUEST',
              statusCode: 400,
              message: 'Payload is not viable for upsert.',
              requestId: '07b4aec3-9a8f-4fd4-a8fa-7a22042cb91a',
            },
          },
        },
      },
    },
  })
  public async UpdateAdvisorPreferences(
    @Decorators.RequestId() requestId: string,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Body() payload: Dto.ConnectAdvisorPreferencesUpdateApiDto
  ): Promise<Dto.ConnectAdvisorPreferencesReadApiDto> {
    try {
      const { sub: userId, realm: tenantId } = claims;

      const dbRow =
        await this.connectAdvisorService.UpdateConnectAdvisorPreferences(
          requestId,
          {
            ...payload,
            userId,
            tenantId,
          }
        );

      const {
        minimumRetirementSavingsThreshold,
        createdAt,
        updatedAt,
        minimumAnnualIncomeThreshold,
      } = dbRow;

      return {
        minimumRetirementSavingsThreshold,
        createdAt,
        updatedAt,
        minimumAnnualIncomeThreshold,
      };
    } catch (error) {
      if (error && !error.requestId) {
        error.requestId = requestId;
      }
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Get('leads/:id')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get lead by id.',
  })
  @ApiParam({
    type: 'string',
    format: 'uuid',
    name: 'id',
  })
  @ApiResponse({
    type: Dto.ConnectAdvisorLeadsResponseItemDto,
    status: 200,
  })
  @ApiResponse({ status: 403 })
  @ApiResponse({
    status: 404,
    description: 'HTTP 404 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          LEAD_NOT_FOUND: {
            value: {
              error: 'Error',
              errorCode: 'UNHANDLED',
              statusCode: 404,
              message: 'Lead not found.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  public async GetLeadById(
    @Param('id') id: string,
    @Decorators.RequestId() requestId: string,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto
  ): Promise<Dto.ConnectAdvisorLeadsResponseItemDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetLeadById.name,
      requestId
    );
    try {
      const useLegacyMethod: boolean =
        this.transactInvestorSwitchoverConfig.getOrThrow(
          'transactInvestorSwitchover.useLegacyTransactForInvestorCreation',
          { infer: true }
        );

      this.#logger.debug(`${logPrefix} useLegacyMethod: ${useLegacyMethod}.`);

      const { realm: tenantId } = claims;

      if (!useLegacyMethod) {
        return await this.connectAdvisorService.GetConnectInvestorLeadById(
          requestId,
          {
            tenantId,
            id,
          }
        );
      }

      return await this.connectAdvisorService.GetLeadById(requestId, {
        tenantId,
        id,
      });
    } catch (error) {
      if (error && !error.requestId) {
        error.requestId = requestId;
      }
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Patch('leads/:id')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update lead by id.',
  })
  @ApiParam({
    type: 'string',
    format: 'uuid',
    name: 'id',
  })
  @ApiBody({
    type: Dto.ConnectAdvisorLeadsUpdateRequestDto,
  })
  @ApiResponse({
    type: Dto.ConnectAdvisorLeadsResponseItemDto,
    status: 200,
  })
  @ApiResponse({ status: 403 })
  @ApiResponse({
    status: 404,
    description: 'HTTP 404 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          LEAD_NOT_FOUND: {
            value: {
              error: 'Error',
              errorCode: 'UNHANDLED',
              statusCode: 404,
              message: 'Lead not found.',
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
          LEAD_UPDATED_ALREADY: {
            value: {
              error: 'Error',
              errorCode: 'UNHANDLED',
              statusCode: 409,
              message: 'Db entry is newer than submitted entry.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  public async UpdateLeadById(
    @Decorators.RequestId() requestId: string,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Param('id') id: string,
    @Body() payload: Dto.ConnectAdvisorLeadsUpdateRequestDto
  ): Promise<Dto.ConnectAdvisorLeadsResponseItemDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateLeadById.name,
      requestId
    );
    try {
      const useLegacyMethod: boolean =
        this.transactInvestorSwitchoverConfig.getOrThrow(
          'transactInvestorSwitchover.useLegacyTransactForInvestorCreation',
          { infer: true }
        );

      this.#logger.debug(`${logPrefix} useLegacyMethod: ${useLegacyMethod}.`);

      const { sub: userId, realm: tenantId } = claims;

      if (!useLegacyMethod) {
        return await this.connectAdvisorService.UpdateLeadInvestorReviewStatusByInvestorId(
          requestId,
          {
            tenantId,
            userId,
            status: payload.status,
            timeStamp: new Date(),
            id,
          }
        );
      }

      return await this.connectAdvisorService.UpdateLeadById(requestId, {
        tenantId,
        userId,
        status: payload.status,
        timeStamp: new Date(),
        id,
      });
    } catch (error) {
      if (error && !error.requestId) {
        error.requestId = requestId;
      }
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Get('leads/:id/summary')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get lead summary by lead id.',
  })
  @ApiParam({
    type: 'string',
    format: 'uuid',
    name: 'id',
  })
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            $ref: getSchemaPath(CommonSwaggerDto.GenericDataSummaryDto),
          },
        },
        example: [
          {
            displayName: 'User Details',
            key: 'USER_DETAILS',
            fields: [
              {
                displayName: 'Name',
                key: 'NAME',
                type: 'string',
                value: 'John Doe',
              },
              {
                displayName: 'Status',
                key: 'STATUS',
                type: 'string',
                value: 'REVIEWED',
              },
            ],
          },
          {
            displayName: 'Contact Details',
            key: 'CONTACT_DETAILS',
            fields: [
              {
                displayName: 'Email',
                key: 'EMAIL',
                type: 'string',
                format: 'email',
                value: 'john.doe@email.com',
              },
              {
                displayName: 'Phone Number',
                key: 'PHONE_NUMBER',
                type: 'string',
                format: 'phone',
                value: '1234567890',
              },
            ],
          },
          {
            displayName: 'Personal Details',
            key: 'PERSONAL_DETAILS',
            fields: [
              {
                displayName: 'Postal Code',
                key: 'ZIP_CODE',
                type: 'string',
                value: '12345',
              },
              {
                displayName: 'Age',
                key: 'AGE',
                type: 'string',
                value: '69',
              },
              {
                displayName: 'Annual Income',
                key: 'ANNUAL_INCOME',
                type: 'currency',
                value: '9394967',
              },
              {
                displayName: 'Investment Style',
                key: 'INVESTMENT_STYLE',
                type: 'string',
                value: 'CONSERVATIVE',
              },
            ],
          },
          {
            displayName: 'Goal',
            key: 'GOAL_DETAILS',
            fields: [
              {
                displayName: 'Type',
                key: 'GOAL_TYPE',
                type: 'string',
                value: 'Retirement',
              },
              {
                displayName: 'Timeframe',
                key: 'TARGET_YEAR',
                type: 'string',
                value: '67',
              },
              {
                displayName: 'Current Monthly Expenses',
                key: 'MONTHLY_EXPENSES',
                type: 'currency',
                value: '0',
              },
              {
                displayName: 'Target Goal',
                key: 'TARGET_GOAL',
                type: 'currency',
                value: '9394967',
              },
              {
                displayName: 'Suggested Contribution',
                key: 'SUGGESTED_CONTRIBUTION',
                type: 'currency',
                value: '0',
              },
              {
                displayName: 'Recommended Portfolio',
                key: 'RECOMMENDED_PORTFOLIO',
                type: 'string',
                value: 'Conservative Portfolio',
              },
            ],
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 403 })
  @ApiResponse({
    status: 404,
    description: 'HTTP 404 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          LEAD_NOT_FOUND: {
            value: {
              error: 'Error',
              errorCode: 'UNHANDLED',
              statusCode: 404,
              message: 'Lead not found.',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  public async GetLeadSummaryByLeadId(
    @Param('id') id: string,
    @Decorators.RequestId() requestId: string,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto
  ): Promise<CommonSwaggerDto.GenericDataSummaryDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetLeadSummaryByLeadId.name,
      requestId
    );
    try {
      const useLegacyMethod: boolean =
        this.transactInvestorSwitchoverConfig.getOrThrow(
          'transactInvestorSwitchover.useLegacyTransactForInvestorCreation',
          { infer: true }
        );

      this.#logger.debug(`${logPrefix} useLegacyMethod: ${useLegacyMethod}.`);

      const { realm: tenantId } = claims;

      if (!useLegacyMethod) {
        return await this.connectAdvisorService.GetConnectInvestorLeadSummaryById(
          requestId,
          {
            tenantId,
            id,
          }
        );
      }

      return await this.connectAdvisorService.GetLeadSummaryById(requestId, {
        tenantId,
        id,
      });
    } catch (error) {
      if (error && !error.requestId) {
        error.requestId = requestId;
      }
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Get('risk-profiling/risk-profiles')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get risk profiles.',
  })
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            $ref: getSchemaPath(Dto.ConnectAdvisorRiskProfileResponseDto),
          },
        },
        example: [
          {
            id: 'f4aba636-58bc-4d73-a98f-6961ceccc4af',
            lowerLimit: '1',
            upperLimit: '1',
            riskProfileName: 'Very Conservative',
            riskProfileDescription:
              'You don’t want to experience volatility in your portfolio.<br/>You don’t expect the value of your portfolio to go down at any significant period of time.<br/>You understand that expected returns are low',
            tenantId: 'ff36cc49-be0b-4643-867b-982df37a5d83',
          },
          {
            id: '4cb0bf53-88d4-45e1-becf-46ef01067656',
            lowerLimit: '2',
            upperLimit: '2',
            riskProfileName: 'Conservative',
            riskProfileDescription:
              'You are OK with a bit of volatility in your portfolio.<br/>You understand that the value of your portfolio may go down for a short period of time before it bounces back.<br/>You understand that expected returns are below average.',
            tenantId: 'ff36cc49-be0b-4643-867b-982df37a5d83',
          },
          {
            id: 'ca682009-5835-4880-8a07-9f43140d1c02',
            lowerLimit: '3',
            upperLimit: '3',
            riskProfileName: 'Balanced',
            riskProfileDescription:
              'You are OK with some volatility in your portfolio.<br/>You understand that the value of your portfolio may go down for a moderate period of time before it bounces back.<br/>You understand that expected returns are average.',
            tenantId: 'ff36cc49-be0b-4643-867b-982df37a5d83',
          },
          {
            id: 'c658e8ed-2e2c-4b4e-931d-4919f5fbd640',
            lowerLimit: '4',
            upperLimit: '4',
            riskProfileName: 'Growth',
            riskProfileDescription:
              'You are OK with volatility in your portfolio.<br/>You understand that the value of your portfolio may go down for a significant period of time before it bounces back.<br/>You expect good returns in the mid to long term.',
            tenantId: 'ff36cc49-be0b-4643-867b-982df37a5d83',
          },
          {
            id: 'c0705feb-b669-4994-ad4f-45eeb91a96cf',
            lowerLimit: '5',
            upperLimit: '5',
            riskProfileName: 'Aggressive',
            riskProfileDescription:
              'You are OK with high volatility in your portfolio.<br/>You understand that the value of your portfolio may go down sharply in the future but you know that you will reap big benefits if you are patient enough.<br/>You expect high returns in the long term.',
            tenantId: 'ff36cc49-be0b-4643-867b-982df37a5d83',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 403 })
  @ApiResponse({
    status: 404,
    description: 'HTTP 404 error(s).',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CommonSwaggerDto.SwaggerColossusHttpErrorDto),
        },
        examples: {
          RISK_PROFILES_NOT_FOUND: {
            value: {
              error: 'Error',
              errorCode: 'UNHANDLED',
              statusCode: 404,
              message: 'Risk profiles not found',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  public async GetRiskProfiles(
    @Decorators.RequestId() requestId: string,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto
  ): Promise<Dto.ConnectAdvisorRiskProfileResponseDto[] | null> {
    try {
      const { realm: tenantId } = claims;
      return await this.riskProfileService.GetRiskProfiles({
        tenantId,
        requestId,
      });
    } catch (error) {
      if (error && !error.requestId) {
        error.requestId = requestId;
      }
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Get('risk-profiling/questionnaire/version/active')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get the risk profiling questionnaire version. ',
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
          RISK_PROFILES_NOT_FOUND: {
            value: {
              error: 'Error',
              errorCode: 'UNHANDLED',
              statusCode: 404,
              message:
                'Error! No latest questionnaire version found for this tenant',
              requestId: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: {
            $ref: getSchemaPath(
              Dto.ConnectAdvisorLatestRiskQuestionnaireVersionResponseDto
            ),
          },
        },
        example: {
          id: 'cfdb367c-b5c4-4b14-8b41-00daa59b300d',
          questionnaireVersion: 1,
          questionnaireType: 'RISK_PROFILING',
        },
      },
    },
  })
  public async GetLatestQuestionnaireVersion(
    @Decorators.RequestId() requestId: string,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto
  ): Promise<Dto.ConnectAdvisorLatestRiskQuestionnaireVersionResponseDto | null> {
    try {
      const { realm: tenantId } = claims;
      return await this.riskProfileService.GetLatestRiskQuestionnaireVersionNumber(
        {
          tenantId,
          requestId,
        }
      );
    } catch (error) {
      {
        if (error && !error.requestId) {
          error.requestId = requestId;
        }
        ErrorUtils.handleHttpControllerError(error);
      }
    }
  }

  @Roles('Advisor')
  @Version('1')
  @Get('risk-profiling/questionnaire')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Get the risk profiling questionnaires. ',
  })
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: {
            $ref: getSchemaPath(Dto.ConnectAdvisorRiskQuestionnaireResponseDto),
          },
          example: {
            id: '8e42ab6e-f47d-4658-8e97-6e295770148b',
            questionnaireType: 'RISK_PROFILING',
            questionnaireName: 'Intial questionnaire',
            activeVersion: 1,
            Questionnaire: [
              {
                id: '02bed017-1078-4002-8ff0-131a0a2c6661',
                groupingType: 'RISK_CAPACITY',
                groupingName: 'FINANCIAL_HEALTH',
                groupingWeight: '0.4',
                scoringRules: 'MAX',
                sortKey: 1,
                Questions: [
                  {
                    id: '57442208-4b56-4f86-867a-553f5e59842e',
                    question:
                      'How much do you roughly save out of your monthly income?',
                    questionType: 'INCOME',
                    questionFormat: 'NUMERIC_ENTRY',
                    questionWeight: '0.5',
                    sortKey: 1,
                    Answers: [
                      {
                        id: '435aa46e-20a4-4dfe-b184-fccacc544f60',
                        answer: '70-85%',
                        sortKey: 2,
                        score: '2',
                        additionalConfiguration: {},
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    },
  })
  public async GetRiskQuestionnaire(
    @Decorators.RequestId() requestId: string,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto
  ): Promise<Dto.ConnectAdvisorRiskQuestionnaireResponseDto> {
    try {
      const { realm: tenantId } = claims;
      return await this.riskProfileService.GetRiskQuestionnaire({
        tenantId,
        requestId,
      });
    } catch (error) {
      {
        if (error && !error.requestId) {
          error.requestId = requestId;
        }
        ErrorUtils.handleHttpControllerError(error);
      }
    }
  }
}
