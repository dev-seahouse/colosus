import { ConnectInvestorDomainServiceBase } from '@bambu/server-connect/domains';
import { ExtractOriginGuard, Public } from '@bambu/server-core/common-guards';
import { ITransactInvestorSwitchoverConfigDto } from '@bambu/server-core/configuration';
import {
  IColossusTrackingDto,
  IServerCoreIamClaimsDto,
} from '@bambu/server-core/dto';
import {
  Decorators,
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import {
  ConnectLegalDocumentsDto,
  ConnectTenantDto,
  SharedEnums,
} from '@bambu/shared';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Headers,
  HttpCode,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBody,
  ApiExtraModels,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import * as ConnectAdvisorDto from '../connect-advisor/dto';
import * as DocumentsDto from '../documents/dto';
import * as TenantBrandingDto from '../tenant-branding/dto';
import * as Dto from './dto';

@ApiTags('Connect Investor')
@ApiExtraModels(
  Dto.ConnectTenantGetGoalTypesForInvestorResponseDto,
  Dto.ConnectTenantGetGoalTypesForInvestorResponseItemDto,
  Dto.ConnectInvestorGetTenantIdDto,
  Dto.GetInvestorUiProxyConfigResponseSeoDataDto,
  Dto.ConnectInvestorLeadInputDto,
  TenantBrandingDto.TenantBrandingDto,
  ConnectAdvisorDto.ConnectPortfolioSummariesResponseDto,
  DocumentsDto.ConnectLegalDocumentsResponse,
  Dto.ConnectInvestorCalculateRiskScoreRequestDto,
  Dto.ConnectInvestorCalculateRiskScoreResponseDto,
  ConnectAdvisorDto.ConnectAdvisorRiskProfileResponseDto
)
@UseGuards(ExtractOriginGuard)
@Controller('connect/investor')
export class ConnectInvestorController {
  readonly #logger: Logger = new Logger(ConnectInvestorController.name);

  constructor(
    private readonly connectInvestorDomain: ConnectInvestorDomainServiceBase,
    private readonly transactInvestorSwitchoverConfig: ConfigService<ITransactInvestorSwitchoverConfigDto>
  ) {}

  @Public()
  @Version('1')
  @Post('leads')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(201)
  @ApiOperation({
    summary: [
      'Upsert lead for a tenant; will update if email is unchanged from one already present in the system.',
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
      $ref: getSchemaPath(Dto.ConnectInvestorLeadInputDto),
    },
  })
  @ApiResponse({
    status: 201,
  })
  @ApiResponse({ status: 403 })
  public async UpsertLead(
    @Body() lead: Dto.ConnectInvestorLeadInputDto,
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<void> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.UpsertLead.name,
      tracking.requestId
    );
    this.#guardOriginHeader(origin, logPrefix);

    try {
      const useLegacyMethod: boolean =
        this.transactInvestorSwitchoverConfig.getOrThrow(
          'transactInvestorSwitchover.useLegacyTransactForInvestorCreation',
          { infer: true }
        );

      this.#logger.debug(`${logPrefix} useLegacyMethod: ${useLegacyMethod}.`);

      if (!useLegacyMethod) {
        return await this.connectInvestorDomain.UpsertInvestor(
          tracking,
          {
            ...lead,
            status: SharedEnums.LeadsEnums.EnumLeadStatus.NEW,
          },
          origin
        );
      }

      await this.connectInvestorDomain.UpsertLead(
        tracking,
        {
          ...lead,
          status: SharedEnums.LeadsEnums.EnumLeadStatus.NEW,
        },
        origin
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
  @Get('advisor-profile')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: [
      'Retrieves some user information associated with the advisor and the tenant.',
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
  @ApiResponse({
    status: 200,
    description: 'Profile information.',
    type: Dto.ConnectAdvisorProfileInformationForInvestorDto,
  })
  @ApiResponse({ status: 403 })
  public async GetAdvisorProfile(
    @Decorators.RequestId() requestId: string,
    @Headers('extracted-origin') origin?: string
  ): Promise<Dto.ConnectAdvisorProfileInformationForInvestorDto> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetAdvisorProfile.name,
      requestId
    );
    try {
      this.#guardOriginHeader(origin, logPrefix);

      const result = await this.connectInvestorDomain.GetAdvisorProfile(
        requestId,
        origin
      );

      return plainToInstance(
        Dto.ConnectAdvisorProfileInformationForInvestorDto,
        result
      );
    } catch (error) {
      const message = `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
        error
      )}`;
      this.#logger.error(message);
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Public()
  @Version('1')
  @Get('tenant-id')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: [
      'Get the tenant id.',
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
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(Dto.ConnectInvestorGetTenantIdDto),
    },
  })
  @ApiResponse({ status: 403 })
  public async GetTenantId(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Req() req: Request,
    @Headers('extracted-origin') origin?: string
  ): Promise<Dto.ConnectInvestorGetTenantIdDto> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.GetTenantId.name,
      tracking.requestId
    );

    try {
      this.#guardOriginHeader(origin, logPrefix);

      const tenant = await this.connectInvestorDomain.GetTenantFromOriginUrl(
        tracking.requestId,
        origin
      );
      return {
        tenantId: tenant.id,
      };
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  #guardOriginHeader(origin: string, logPrefix: string) {
    if (!origin) {
      throw new BadRequestException(`${logPrefix} No origin header found.`);
    }
  }

  @Version('1')
  @Public()
  @Get('legal-document')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: [
      'Get an object of URLs to legal documents.',
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
  @ApiResponse({
    status: 200,
    description: 'Legal documents for a tenant.',
    schema: {
      $ref: getSchemaPath(DocumentsDto.ConnectLegalDocumentsResponse),
    },
  })
  public async GetLegalDocuments(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<ConnectLegalDocumentsDto.IConnectLegalDocumentsDto> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetLegalDocuments.name,
      tracking.requestId
    );

    this.#guardOriginHeader(origin, logPrefix);

    try {
      return this.connectInvestorDomain.GetLegalDocuments({
        origin,
        requestId: tracking.requestId,
        requesterId: tracking.requesterId,
      });
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Public()
  @Version('1')
  @Get('goal-types')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Ignored if set from swagger explorer, please use origin-override instead.',
    required: false,
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment',
    required: false,
  })
  @ApiOperation({
    summary: [
      'Get the goal types that the advisor might offer.',
      'The only way to test this in a dev setting is to use the "origin-override" header.',
    ].join(' '),
  })
  @ApiResponse({
    status: 200,
    type: Dto.ConnectTenantGetGoalTypesForInvestorResponseDto,
    schema: {
      $ref: getSchemaPath(Dto.ConnectTenantGetGoalTypesForInvestorResponseDto),
    },
  })
  @ApiResponse({ status: 403 })
  public async GetGoalTypes(
    @Decorators.Tracking() tracking: IColossusTrackingDto,
    @Headers('extracted-origin') origin?: string
  ): Promise<{
    goalTypes: ConnectTenantDto.IConnectTenantGoalTypeDto[];
  }> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetGoalTypes.name,
      tracking.requestId
    );
    try {
      this.#guardOriginHeader(origin, logPrefix);

      return {
        goalTypes: await this.connectInvestorDomain.GetGoalTypes(
          tracking.requestId,
          origin
        ),
      };
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Public()
  @Version('1')
  @Get('ui-proxy-configuration')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Gets configuration for specified tenant sub-domain.',
    description: [
      'This is used by the investor-front end proxy when serving HTML assets.',
      'This API will state if the URL is valid and provide SEO data items.',
      'The only way to test this in a dev setting is to use the "origin-override" header.',
    ].join(' '),
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Url requested by investor. In a prod setting, it will be derived from the "origin" HTTP header.',
    required: false,
    schema: {
      type: 'string',
      format: 'uri',
    },
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiResponse({
    status: 200,
    type: Dto.GetInvestorUiProxyConfigResponseDto,
  })
  public async GetInvestorUiProxyConfig(
    @Decorators.RequestId() requestId,
    @Headers('extracted-origin') requestUrl: string
  ): Promise<Dto.GetInvestorUiProxyConfigResponseDto> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.GetInvestorUiProxyConfig.name,
      requestId
    );

    try {
      this.#guardOriginHeader(requestUrl, logPrefix);

      this.#logger.log(
        `${logPrefix}  Getting settings for tenant url (${requestUrl}).`
      );

      const result = this.connectInvestorDomain.GetUiProxyConfig(
        requestUrl,
        requestId
      );

      this.#logger.log(
        `${logPrefix}  Acquired settings for tenant url (${requestUrl}).`
      );

      return result;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw ErrorUtils.generateHttpControllerError(error);
    }
  }

  @Public()
  @Version('1')
  @Get('model-portfolios/summary')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Gets model portfolio summary.',
    description: [
      'This API is used to acquire the model portfolio summary for a given investor based on the "origin" header.',
      'The only way to test this in a dev setting is to use the "origin-override" header.',
    ].join(' '),
  })
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Url requested by investor. In a prod setting, it will be derived from the "origin" HTTP header.',
    required: false,
    schema: {
      type: 'string',
      format: 'uri',
    },
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiResponse({
    status: 200,
    type: ConnectAdvisorDto.ConnectPortfolioSummariesResponseDto,
    isArray: true,
  })
  public async GetInvestorModelPortfolioSummary(
    @Decorators.RequestId() requestId,
    @Headers('extracted-origin') requestUrl: string
  ): Promise<ConnectAdvisorDto.ConnectPortfolioSummariesResponseDto[]> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetInvestorUiProxyConfig.name,
      requestId
    );

    try {
      this.#guardOriginHeader(requestUrl, logPrefix);

      this.#logger.log(
        `${logPrefix}  Getting portfolio summary for tenant investor for url (${requestUrl}).`
      );

      const result =
        await this.connectInvestorDomain.GetInvestorModelPortfolioSummary(
          requestUrl,
          requestId
        );

      this.#logger.log(
        `${logPrefix}  Acquired portfolio summary for tenant investor for url (${requestUrl}).`
      );

      return result;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw ErrorUtils.generateHttpControllerError(error);
    }
  }

  @Public()
  @Version('1')
  @Get('investor-portal-assets-proxy/*')
  @HttpCode(200)
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Url requested by investor. In a prod setting, it will be derived from the "origin" HTTP header.',
    required: false,
    schema: {
      type: 'string',
      format: 'uri',
    },
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  public async GetInvestorPortalPage(
    @Req() request: Request,
    @Res() response: Response,
    @Decorators.RequestId() requestId: string
  ) {
    const loggingPrefix = LoggingUtils.generateLogPrefix(
      this.GetInvestorPortalPage.name,
      requestId
    );
    this.#logger.debug(
      `${loggingPrefix} Headers: ${JsonUtils.Stringify(
        request.headers,
        null,
        2
      )}.`
    );

    try {
      const { headers } = request;

      const requestUrl = `${headers.origin}${headers['x-forwarded-request-uri']}`;

      this.#logger.debug(`${loggingPrefix} Request Url: ${requestUrl}.`);

      const result = await this.connectInvestorDomain.ServeInvestorPortalPage(
        requestId,
        requestUrl
      );

      if (result.isRedirect) {
        return response
          .status(result.httpStatusCode)
          .header('location', result.redirectUrl);
      }

      return response
        .status(result.httpStatusCode)
        .contentType(result.contentTypeHeader)
        .header('etag', result.etagHeader)
        .send(result.contentBody);
    } catch (error) {
      this.#logger.error(
        `${loggingPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      Object.assign(error, { requestId });
      throw ErrorUtils.generateHttpControllerError(error);
    }
  }

  @Public()
  @Version('1')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Url requested by investor. In a prod setting, it will be derived from the "origin" HTTP header.',
    required: false,
    schema: {
      type: 'string',
      format: 'uri',
    },
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get the risk profiling questionnaire version. ',
  })
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: {
            $ref: getSchemaPath(
              ConnectAdvisorDto.ConnectAdvisorLatestRiskQuestionnaireVersionResponseDto
            ),
          },
        },
        example: {
          id: 'cfdb367c-b5c4-4b14-8b41-00daa59b300d',
          questionnaireVersion: 1,
          questionnaireType: 'RISK_PROFILING',
          versionId: 'f9956925-160e-46d8-991b-943c3f0d4773',
        },
      },
    },
    type: ConnectAdvisorDto.ConnectAdvisorLatestRiskQuestionnaireVersionResponseDto,
  })
  @Get('risk-profiling/questionnaire/version/active')
  @HttpCode(200)
  public async GetInvestorLatestQuestionnaireVersion(
    @Decorators.RequestId() requestId,
    @Headers('extracted-origin') requestUrl: string
  ): Promise<ConnectAdvisorDto.ConnectAdvisorLatestRiskQuestionnaireVersionResponseDto> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetInvestorLatestQuestionnaireVersion.name,
      requestId
    );

    try {
      this.#guardOriginHeader(requestUrl, logPrefix);
      this.#logger.log(
        `${logPrefix}  Getting questionnaire latest version for tenant investor for url (${requestUrl}).`
      );

      return await this.connectInvestorDomain.GetInvestorLatestQuestionnaireVersion(
        requestUrl,
        requestId
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw ErrorUtils.generateHttpControllerError(error);
    }
  }

  @Public()
  @Version('1')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Url requested by investor. In a prod setting, it will be derived from the "origin" HTTP header.',
    required: false,
    schema: {
      type: 'string',
      format: 'uri',
    },
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @HttpCode(200)
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
            $ref: getSchemaPath(
              ConnectAdvisorDto.ConnectAdvisorRiskQuestionnaireResponseDto
            ),
          },
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
  })
  @Get('risk-profiling/questionnaire')
  @HttpCode(200)
  public async GetInvestorRiskQuestionnaire(
    @Decorators.RequestId() requestId,
    @Headers('extracted-origin') requestUrl: string
  ): Promise<ConnectAdvisorDto.ConnectAdvisorRiskQuestionnaireResponseDto> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetInvestorRiskQuestionnaire.name,
      requestId
    );

    try {
      this.#guardOriginHeader(requestUrl, logPrefix);
      this.#logger.log(
        `${logPrefix}  Getting questionnaires for tenant investor for url (${requestUrl}).`
      );

      return await this.connectInvestorDomain.GetInvestorRiskQuestionnaire(
        requestUrl,
        requestId
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw ErrorUtils.generateHttpControllerError(error);
    }
  }

  @Public()
  @Version('1')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Url requested by investor. In a prod setting, it will be derived from the "origin" HTTP header.',
    required: false,
    schema: {
      type: 'string',
      format: 'uri',
    },
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiBody({
    type: Dto.ConnectInvestorCalculateRiskScoreRequestDto,
    examples: {
      ANSWERS: {
        value: {
          questionnaireId: '6e81aaaf-7a4a-43a9-a21e-b31d3224f9cd',
          questionnaireVersion: 1,
          answers: [
            {
              questionGroupingId: '158a2fd2-43f8-4b84-bc11-65d4f0859876',
              questionId: '57eea051-1a53-4779-bc5a-74277f583407',
              answerId: null,
              answerScoreNumber: 21,
            },
            {
              questionGroupingId: '158a2fd2-43f8-4b84-bc11-65d4f0859876',
              questionId: 'c824d3d1-31dc-4777-9b5a-043ba52dd778',
              answerId: '1d4b48a0-1908-43d2-ab63-be21a3eb0e72',
              answerScoreNumber: null,
            },
            {
              questionGroupingId: 'cb1fa14e-3d93-4080-958f-50b82fe2f5db',
              questionId: 'b7cdacbc-f41b-4897-9adb-f5d35a5289be',
              answerId: null,
              answerScoreNumber: 10,
            },
            {
              questionGroupingId: '5389ac59-838b-40eb-955c-9ba94b21ba16',
              questionId: 'ad0cc335-5f85-420c-bdef-59feb3288c86',
              answerId: null,
              answerScoreNumber: 30,
            },
            {
              questionGroupingId: '33c2a5e5-8469-4819-bbd7-218298ead1b0',
              questionId: 'd10b3b93-dca2-450a-9181-d71423d80a91',
              answerId: '0a951d41-1e21-4047-9dee-eca728280742',
              answerScoreNumber: null,
            },
            {
              questionGroupingId: '73ef469b-0ce4-4094-b7aa-9eb1fba08c76',
              questionId: 'ef508bec-c453-47f2-9d1d-e77b10409fb6',
              answerId: '01f8d423-1d4d-42fd-8e42-91310a40c8d7',
              answerScoreNumber: null,
            },
            {
              questionGroupingId: '73ef469b-0ce4-4094-b7aa-9eb1fba08c76',
              questionId: '787a19a0-784f-4589-b75d-f8d204b7d91e',
              answerId: '318beef1-4d7b-41f6-946a-b03ba896607b',
              answerScoreNumber: null,
            },
          ],
        },
      },
    },
  })
  @HttpCode(200)
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
            $ref: getSchemaPath(
              Dto.ConnectInvestorCalculateRiskScoreResponseDto
            ),
          },
        },
        example: {
          overallScoreDetails: [
            {
              questionCategoryName: 'Risk Capacity',
              questionId: '1',
              questionScoreDetails: [
                {
                  questionCategoryName: 'FINANCIAL_HEALTH',
                  questionId: '1.1',
                  questionScoreDetails: [
                    {
                      questionCategoryName: 'INCOME',
                      questionId: '1',
                      questionScore: '5',
                      questionWeight: '0.5',
                    },
                    {
                      questionCategoryName: 'BALANCE_SHEET',
                      questionId: '2',
                      questionScore: '5',
                      questionWeight: '0.5',
                    },
                  ],
                  questionScore: '5',
                  questionWeight: '0.4',
                },
                {
                  questionCategoryName: 'AGE',
                  questionId: '1.2',
                  questionScore: '5',
                  questionWeight: '0.2',
                },
                {
                  questionCategoryName: 'GOAL',
                  questionId: '1.3',
                  questionScore: '4',
                  questionWeight: '0.2',
                },
                {
                  questionCategoryName: 'FINANCIAL_KNOWLEDGE',
                  questionId: '1.4',
                  questionScore: '2',
                  questionWeight: '0.2',
                },
              ],
              questionScore: '4',
              questionWeight: '0.5',
            },
            {
              questionCategoryName: 'Risk Tolerance',
              questionId: '2',
              questionScoreDetails: [
                {
                  questionCategoryName: 'RISK_COMFORT_LEVEL',
                  questionId: '1',
                  questionScore: '1',
                  questionWeight: '0.5',
                },
                {
                  questionCategoryName: 'RISK_COMFORT_LEVEL',
                  questionId: '2',
                  questionScore: '2.33333333',
                  questionWeight: '0.5',
                },
              ],
              questionScore: '1',
              questionWeight: '0.5',
            },
          ],
          overallScore: '2',
        },
      },
    },
    type: Dto.ConnectInvestorCalculateRiskScoreResponseDto,
  })
  @Post('risk-profiling/compute')
  public async ComputeRiskProfileScore(
    @Decorators.RequestId() requestId,
    @Decorators.Claims() claims: IServerCoreIamClaimsDto,
    @Headers('extracted-origin') requestUrl: string,
    @Body() input: Dto.ConnectInvestorCalculateRiskScoreRequestDto
  ): Promise<Dto.ConnectInvestorCalculateRiskScoreResponseDto> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.ComputeRiskProfileScore.name,
      requestId
    );

    try {
      this.#guardOriginHeader(requestUrl, logPrefix);
      this.#logger.log(
        `${logPrefix}  Computing Risk profiling Score for url (${requestUrl}).`
      );

      return await this.connectInvestorDomain.ComputeRiskProfileScore(
        requestUrl,
        input,
        claims,
        requestId
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw ErrorUtils.generateHttpControllerError(error);
    }
  }

  @Public()
  @Version('1')
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('risk-profiling/risk-profiles')
  @HttpCode(200)
  @ApiHeader({
    name: 'extracted-origin',
    description:
      'Url requested by investor. In a prod setting, it will be derived from the "origin" HTTP header.',
    required: false,
    schema: {
      type: 'string',
      format: 'uri',
    },
  })
  @ApiHeader({
    name: 'origin-override',
    description:
      'Overrides the origin header used for resolving the tenant, in dev environment.',
    required: false,
  })
  @ApiOperation({
    summary: 'Get risk profiles Investor.',
  })
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            $ref: getSchemaPath(
              ConnectAdvisorDto.ConnectAdvisorRiskProfileResponseDto
            ),
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
  public async GetInvestorRiskProfiles(
    @Decorators.RequestId() requestId,
    @Headers('extracted-origin') requestUrl: string
  ): Promise<ConnectAdvisorDto.ConnectAdvisorRiskProfileResponseDto[] | null> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetInvestorRiskProfiles.name,
      requestId
    );

    this.#guardOriginHeader(requestUrl, logPrefix);
    this.#logger.log(
      `${logPrefix}  Getting Risk Profiles for tenant investor for url (${requestUrl}).`
    );

    try {
      return await this.connectInvestorDomain.GetInvestorRiskProfiles(
        requestUrl,
        requestId
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered While Getting Investor Risk Profiles. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw ErrorUtils.generateHttpControllerError(error);
    }
  }
}
