import { IAzureBlobStorageIntegrationConfigDto } from '@bambu/server-core/configuration';
import { PrismaModel } from '@bambu/server-core/db/central-db';
import {
  BambuApiLibraryIntegrationDomainServiceBase,
  LegalDocumentsServiceBase,
} from '@bambu/server-core/domains';
import {
  ConnectInvestorProxyConfigDto,
  IColossusTrackingDto,
  IServeInvestorPortalPageResponseDto,
  IServerCoreIamClaimsDto,
} from '@bambu/server-core/dto';
import {
  CacheManagerRepositoryServiceBase,
  ConnectPortfolioSummaryCentralDbRepositoryService,
  ConnectTenantCentralDbRepositoryService,
  ConnectTenantGoalTypeCentralDbRepositoryService,
  GoalCentralDbRepositoryServiceBase,
  InvestorCentralDbRepositoryServiceBase,
  InvestorPortalProxyRepositoryServiceBase,
  IPleaseAwaitAppointmentTemplateParametersDto,
  IScheduleAppointmentTemplateParametersDto,
  ISendInvestmentPlanToLeadParametersDto,
  LeadsCentralDbRepositoryService,
  NotificationRepositoryServiceBase,
  NotificationTemplateChannelEnum,
  NotificationTemplatesRepositoryServiceBase,
  NotificationTypeEnum,
  RiskProfilingCentralDbService,
  TemplateNameEnum,
  TenantApiKeyCentralDbRepository,
  TenantCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import {
  ConnectAdvisorDto,
  ConnectLeadsDto,
  ConnectLegalDocumentsDto,
  ConnectPortfolioSummaryDto,
  ConnectTenantDto,
  IBambuApiLibraryCalculateRiskPayloadDto,
  IBambuApiLibraryCalculateRiskScoreRequestDto as CalculateRiskProfileScoreRequest,
  IBambuApiLibraryCalculateRiskScoreResponseDto as CalculateRiskProfileScoreResponse,
  IBambuApiLibraryQuestionnairePayloadDto,
  IGetLatestQuestionnaireVersion,
  IGetRiskQuestionnaire,
  IGetRiskQuestionnaire as InvestorRiskQuestionnaire,
  IQuestion,
  IQuestionnaireGrouping,
  IRiskCalculateResponseDto,
  IRiskProfileDto,
  SharedEnums,
  TenantBrandingDto as ITenantBrandingDto,
} from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cheerio from 'cheerio';
import * as _ from 'lodash';
import * as path from 'path';
import { ConnectToolsServiceBase } from '../tools';
import { GetStub404EmailTemplate } from './404-email-template';

type AugmentedTenant = PrismaModel.Tenant & {
  apiKeys: PrismaModel.TenantApiKey[];
  httpUrls: PrismaModel.TenantHttpUrl[];
  branding: PrismaModel.TenantBranding;
  connectAdvisors: PrismaModel.ConnectAdvisor[];
  tenantSubscriptions: PrismaModel.TenantSubscription[];
};

export interface IGetAdvisorProfileResponseDto
  extends Pick<
    ConnectAdvisorDto.IConnectAdvisorProfileInformationDto,
    | 'firstName'
    | 'lastName'
    | 'tenantRealm'
    | 'profileBioRichText'
    | 'contactMeReasonsRichText'
    | 'jobTitle'
    | 'contactLink'
    | 'fullProfileLink'
    | 'advisorProfilePictureUrl'
  > {
  advisorSubscriptionInPlace: boolean;
  advisorSubscriptionIds: SharedEnums.BambuGoProductIdEnum[] | null;
  incomeThreshold: PrismaModel.ConnectTenant['incomeThreshold'] | null;
  retireeSavingsThreshold:
    | PrismaModel.ConnectTenant['retireeSavingsThreshold']
    | null;
  canPerformTransactActions: boolean;
}

export abstract class ConnectInvestorDomainServiceBase {
  public abstract GetUiProxyConfig(
    requestUrl: string,
    requestId: string
  ): Promise<ConnectInvestorProxyConfigDto.IGetInvestorUiProxyConfigResponseDto>;

  public abstract GetInvestorModelPortfolioSummary(
    requestUrl: string,
    requestId: string
  ): Promise<ConnectPortfolioSummaryDto.IConnectPortfolioSummaryDto[]>;

  public abstract ServeInvestorPortalPage(
    requestId: string,
    requestUrl: string
  ): Promise<IServeInvestorPortalPageResponseDto>;

  public abstract GetAdvisorProfile(
    requestId: string,
    origin: string
  ): Promise<IGetAdvisorProfileResponseDto>;

  public abstract GetTenantFromOriginUrl(
    requestId: string,
    origin: string
  ): Promise<PrismaModel.Tenant>;

  public abstract GetLegalDocuments({
    requestId,
    origin,
    requesterId,
  }: {
    requestId: string;
    origin: string;
    requesterId?: string;
  }): Promise<ConnectLegalDocumentsDto.IConnectLegalDocumentsDto>;

  public abstract GetGoalTypes(
    requestId: string,
    origin: string
  ): Promise<ConnectTenantDto.IConnectTenantGoalTypeDto[]>;

  public abstract UpsertLead(
    tracking: IColossusTrackingDto,
    lead: ConnectLeadsDto.IConnectLeadsItemDto,
    origin: string
  ): Promise<void>;

  public abstract GetInvestorLatestQuestionnaireVersion(
    requestUrl: string,
    requestId: string
  ): Promise<IGetLatestQuestionnaireVersion>;

  public abstract GetInvestorRiskQuestionnaire(
    requestUrl: string,
    requestId: string
  ): Promise<InvestorRiskQuestionnaire>;

  public abstract ComputeRiskProfileScore(
    requestUrl: string,
    input: CalculateRiskProfileScoreRequest,
    claims: IServerCoreIamClaimsDto,
    requestId: string
  ): Promise<IRiskCalculateResponseDto>;

  public abstract GetInvestorRiskProfiles(
    requestUrl: string,
    requestId: string
  ): Promise<IRiskProfileDto[] | null>;

  public abstract UpsertInvestor(
    tracking: IColossusTrackingDto,
    lead: ConnectLeadsDto.IConnectLeadsItemDto,
    origin: string
  ): Promise<void>;
}

@Injectable()
export class ConnectInvestorDomainService
  implements ConnectInvestorDomainServiceBase
{
  readonly #logger: Logger = new Logger(ConnectInvestorDomainService.name);
  readonly #baseSystemAssetUrl: string;

  constructor(
    private readonly tenantCentralDb: TenantCentralDbRepositoryService,
    private readonly portfolioSummaryDb: ConnectPortfolioSummaryCentralDbRepositoryService,
    private readonly investorPortalProxyRepository: InvestorPortalProxyRepositoryServiceBase,
    private readonly cacheManagerRepository: CacheManagerRepositoryServiceBase,
    private readonly connectTenantGoalTypeCentralDbRepository: ConnectTenantGoalTypeCentralDbRepositoryService,
    private readonly connectTenantCentralDb: ConnectTenantCentralDbRepositoryService,
    private readonly leadsCentralDbRepository: LeadsCentralDbRepositoryService,
    private readonly connectTools: ConnectToolsServiceBase,
    private readonly legalDocumentsCoreDomain: LegalDocumentsServiceBase,
    private readonly notificationTemplatesRepository: NotificationTemplatesRepositoryServiceBase,
    private readonly notificationRepository: NotificationRepositoryServiceBase,
    private readonly config: ConfigService<IAzureBlobStorageIntegrationConfigDto>,
    private readonly riskProfilingDbRepo: RiskProfilingCentralDbService,
    private readonly bambuApiLibraryService: BambuApiLibraryIntegrationDomainServiceBase,
    private readonly investorCentralDb: InvestorCentralDbRepositoryServiceBase,
    private readonly goalCentralDb: GoalCentralDbRepositoryServiceBase,
    private readonly tenantApiKeyDb: TenantApiKeyCentralDbRepository
  ) {
    const blobConfig = this.config.getOrThrow('azureBlobStorage', {
      infer: true,
    });

    this.#baseSystemAssetUrl = blobConfig.systemAssets.publicBaseUrl;
  }

  public async GetUiProxyConfig(
    requestUrl: string,
    requestId: string
  ): Promise<ConnectInvestorProxyConfigDto.IGetInvestorUiProxyConfigResponseDto> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetUiProxyConfig.name,
      requestId
    );
    const response: ConnectInvestorProxyConfigDto.IGetInvestorUiProxyConfigResponseDto =
      {
        isValid: false,
        seoData: {
          image: null,
          title: null,
          description: null,
        },
      };
    this.#logger.log(
      `${logPrefix} Validating if "${requestUrl}" is a valid URL.`
    );
    this.#guardValidityOfRequestUrl(requestUrl, requestId);

    const tenantHttpEntry = await this.tenantCentralDb.GetTenantHttpUrl(
      requestUrl
    );

    if (!tenantHttpEntry) {
      return response;
    }

    const tenantInfo = await this.tenantCentralDb.FindTenantById(
      tenantHttpEntry.tenantId
    );
    this.#logger.debug(
      `${logPrefix} Data retrieved: ${JsonUtils.Stringify({
        tenantHttpEntry,
        tenantInfo,
      })}.`
    );

    const isTenancyValid: boolean = await this.#guardValidityOfTenancy(
      requestId,
      requestUrl,
      tenantInfo
    );

    if (isTenancyValid === false) {
      return response;
    }

    const { branding } = tenantInfo.branding;
    const brandingObject =
      branding as unknown as ITenantBrandingDto.ITenantBrandingDto;

    // if (!brandingObject?.tradeName) {
    //   this.#logger.log(
    //     `${logPrefix} The trade name is not in place for ${requestUrl}.`
    //   );
    //   return response;
    // }

    response.isValid = true;
    response.seoData.title = brandingObject?.tradeName
      ? brandingObject?.tradeName
      : null;

    if (brandingObject?.logoUrl) {
      response.seoData.image = brandingObject.logoUrl;
    }

    response.seoData.description = this.#computeSeoOpenGraphDescription(
      requestId,
      tenantInfo?.connectAdvisors[0]
    );

    this.#logger.debug(
      `${logPrefix} Computed payload: ${JsonUtils.Stringify(response)}.`
    );

    return response;
  }

  #guardValidityOfRequestUrl(requestUrl: string, requestId: string) {
    if (!this.#isRequestUrlValid(requestUrl, requestId)) {
      throw ErrorUtils.generateHttpControllerError(
        new ErrorUtils.ColossusError(
          'The origin of this request does not conform to a valid HTTP url.',
          requestId,
          {
            requestUrl,
          },
          400,
          SharedEnums.ErrorCodes.GenericErrorCodesEnum.MALFORMED_REQUEST
        )
      );
    }
  }

  #isRequestUrlValid(requestUrl: string, requestId: string) {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#isRequestUrlValid.name,
      requestId
    );

    try {
      const url = new URL(requestUrl);

      const { protocol } = url;

      if (protocol === 'http:' || protocol === 'https:') {
        return true;
      }

      this.#logger.warn(
        [
          `The request URL (${requestUrl}) does not have a valid protocol.`,
          `Only HTTP and HTTPS protocols are allowed.`,
        ].join(' ')
      );

      return false;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while processing URL. Error: ${JsonUtils.Stringify(
          error
        )}`
      );
      return false;
    }
  }

  async #guardValidityOfTenancy(
    requestId: string,
    requestUrl: string,
    tenantInfo:
      | (PrismaModel.Tenant & {
          apiKeys: PrismaModel.TenantApiKey[];
          httpUrls: PrismaModel.TenantHttpUrl[] | null;
          branding: PrismaModel.TenantBranding | null;
          connectAdvisors: PrismaModel.ConnectAdvisor[];
          tenantSubscriptions: PrismaModel.TenantSubscription[];
        })
      | null
  ) {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#guardValidityOfTenancy.name,
      requestId
    );

    const cannotServeMessageSuffix = `Cannot serve page @ ${requestUrl}.`;

    if (!tenantInfo) {
      this.#logger.log(
        `${logPrefix} Http entry not found. ${cannotServeMessageSuffix}`
      );
      return false;
    }

    // if (!tenantInfo.branding) {
    //   this.#logger.log(
    //     `${logPrefix} Branding not yet in place. ${cannotServeMessageSuffix}.`
    //   );
    //   return false;
    // }

    if (tenantInfo?.connectAdvisors?.length < 1) {
      this.#logger.log(
        `${logPrefix} Advisor profile not in place. ${cannotServeMessageSuffix}.`
      );
      return false;
    }

    // if (tenantInfo.tenantSubscriptions?.length < 1) {
    //   this.#logger.log(
    //     `${logPrefix} Advisor subscription not in place. ${cannotServeMessageSuffix}.`
    //   );
    //   return false;
    // }

    // const subscriptionIsAGo: boolean = await this.#guardSubscription(
    //   tenantInfo.tenantSubscriptions[0],
    //   requestId
    // );
    //
    // if (!subscriptionIsAGo) {
    //   this.#logger.log(`${logPrefix} Subscription is invalid.`);
    //   return false;
    // }

    return true;
  }

  // async #guardSubscription(
  //   subscription: PrismaModel.TenantSubscription,
  //   requestId: string
  // ) {
  //   const logPrefix = LoggingUtils.generateLogPrefix(
  //     this.#guardSubscription.name,
  //     requestId
  //   );
  //   const { providerSubscriptionId, status } = subscription;
  //
  //   try {
  //     if (status === SubscriptionStatusEnum.INACTIVE) {
  //       this.#logger.log(
  //         `${logPrefix} The subscription is marked as ${SubscriptionStatusEnum.INACTIVE} in DB.`
  //       );
  //       return false;
  //     }
  //
  //     const subscription = await this.stripeSubscriptionApi.GetById(
  //       requestId,
  //       providerSubscriptionId
  //     );
  //
  //     if (!subscription) {
  //       this.#logger.log(
  //         `${logPrefix} The subscription cannot be found in the Stripe API response.`
  //       );
  //       return false;
  //     }
  //
  //     if (subscription.status === 'canceled') {
  //       this.#logger.log(
  //         `${logPrefix} The subscription is marked as cancelled in Stripe API response.`
  //       );
  //       return false;
  //     }
  //
  //     return true;
  //   } catch (error) {
  //     this.#logger.error(
  //       `${logPrefix} Error while checking subscription. Error: ${JsonUtils.Stringify(
  //         error
  //       )}.`
  //     );
  //     return false;
  //   }
  // }

  #computeSeoOpenGraphDescription(
    requestId: string,
    input: PrismaModel.ConnectAdvisor
  ): string | null {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.#computeSeoOpenGraphDescription.name,
      requestId
    );

    if (!input) {
      this.#logger.log(`${logPrefix} No advisor metadata found.`);
      return null;
    }

    const profile: string | null = input?.profileBio;

    if (!profile || typeof profile !== 'string' || profile.trim().length < 1) {
      this.#logger.log(
        `${logPrefix} No advisor profileBio field is either empty or not a valid string.`
      );
      return null;
    }

    this.#logger.log(
      `${logPrefix} The profileBio is in place, stripping HTML tags.`
    );

    const htmlStrippedText: string = profile.replace(/<\/?[^>]+(>|$)/g, '');

    this.#logger.log(`${logPrefix} The profileBio HTML tags stripped.`);
    this.#logger.debug(
      `${logPrefix} Stripped text value: ${JSON.stringify({
        htmlStrippedText,
      })}.`
    );

    return htmlStrippedText;
  }

  public async GetInvestorModelPortfolioSummary(
    requestUrl: string,
    requestId: string
  ): Promise<ConnectPortfolioSummaryDto.IConnectPortfolioSummaryDto[]> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetUiProxyConfig.name,
      requestId
    );
    this.#logger.log(
      `${logPrefix} Validating if "${requestUrl}" is allowed to serve portfolio entries.`
    );
    if (!this.#isRequestUrlValid(requestUrl, requestId)) {
      const invalidRequestUrlError = new ErrorUtils.ColossusError(
        'The origin of this request does not conform to a valid HTTP url.',
        requestId,
        {
          requestUrl,
        },
        400,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.MALFORMED_REQUEST
      );
      this.#logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify(invalidRequestUrlError)}`
      );
      throw invalidRequestUrlError;
    }
    const tenantHttpEntry = await this.tenantCentralDb.GetTenantHttpUrl(
      requestUrl
    );

    if (!tenantHttpEntry) {
      const noHttpEntryError = new ErrorUtils.ColossusError(
        `No tenants found with the investor URL(${requestUrl}).`,
        requestId,
        {
          requestUrl,
        },
        404,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_NOT_FOUND
      );
      this.#logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify(noHttpEntryError)}`
      );
      throw noHttpEntryError;
    }

    const { tenantId } = tenantHttpEntry;

    const tenantInfo = await this.tenantCentralDb.FindTenantById(tenantId);
    this.#logger.debug(
      `${logPrefix} Tenant info: ${JsonUtils.Stringify({
        tenantInfo,
      })}.`
    );
    const isTenancyValid = await this.#guardValidityOfTenancy(
      requestId,
      requestUrl,
      tenantInfo
    );
    if (!isTenancyValid) {
      const invalidTenancyError = new ErrorUtils.ColossusError(
        [
          `The tenant bound to the requested url (${requestUrl}) has invalid configuration.`,
          `Please ensure that the subscription is still valid and all configurations are in place.`,
        ].join(' '),
        requestId,
        {
          requestUrl,
        },
        422,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_SETUP_INCOMPLETE_OR_EXPIRED
      );
      this.#logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify(invalidTenancyError)}`
      );
      throw invalidTenancyError;
    }
    const { realm } = tenantInfo;
    const portfolioSummary =
      await this.portfolioSummaryDb.GetConnectPortfolioSummaries({
        tenantRealm: realm,
        requestId,
      });
    this.#logger.debug(
      `${logPrefix} The portfolioSummary: ${JsonUtils.Stringify(
        portfolioSummary
      )}.`
    );
    return portfolioSummary;
  }

  public async ServeInvestorPortalPage(
    requestId: string,
    requestUrl: string
  ): Promise<IServeInvestorPortalPageResponseDto> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.ServeInvestorPortalPage.name,
      requestId
    );
    try {
      const emailTemplateFor404: string = GetStub404EmailTemplate(
        this.#baseSystemAssetUrl
      );
      const payload: IServeInvestorPortalPageResponseDto = {
        contentBody: Buffer.from(emailTemplateFor404),
        isRedirect: false,
        isValid: false,
        httpStatusCode: 404,
        redirectUrl: null,
        contentTypeHeader: 'text/html',
        etagHeader: null,
      };

      const url = new URL(requestUrl);
      const baseUrl = this.investorPortalProxyRepository.RemoteStorageUrl;
      const storageUrl = `${baseUrl}${url.pathname}`;

      /**
       * This is here just to make sure we redirect not HTML requests.
       *
       * In reality, this will always return false.
       */
      const hamletSays: boolean =
        this.#toRedirectOrNotToRedirectThatIsTheQuestion(storageUrl);

      this.#logger.log(`${logPrefix} Hamlet says: ${hamletSays}.`);

      if (hamletSays) {
        payload.contentBody = null;
        payload.isRedirect = true;
        payload.httpStatusCode = 301;
        payload.redirectUrl = storageUrl;

        return payload;
      }

      const proxyConfig = await this.GetUiProxyConfig(url.origin, requestId);

      this.#logger.debug(
        `${logPrefix} Proxy config: ${JsonUtils.Stringify(proxyConfig)}.`
      );

      if (!proxyConfig.isValid) {
        return payload;
      }

      const [cachedProxyOutput, remoteAssetHeadAttributes] = await Promise.all([
        this.cacheManagerRepository.GetInvestorProxyHtmlCache(
          requestId,
          url.origin
        ),
        this.investorPortalProxyRepository.GetRemoteAssetHead(
          requestId,
          baseUrl
        ),
      ]);

      const cacheInPlace =
        cachedProxyOutput !== undefined && cachedProxyOutput !== null;

      const { etag } = remoteAssetHeadAttributes;

      const contentIsTheSame =
        cacheInPlace && cachedProxyOutput?.etagHeader === etag;

      if (cacheInPlace && contentIsTheSame) {
        this.#logger.log(`${logPrefix} Serving cached proxy output.`);
        return cachedProxyOutput;
      }

      this.#logger.log(
        `${logPrefix} Not using cached output. Details: ${JsonUtils.Stringify({
          cacheInPlace,
          contentIsTheSame,
        })}.`
      );

      if (cacheInPlace && !contentIsTheSame) {
        this.#logger.warn(`${logPrefix} Cache is stale. Updating.`);
      }

      payload.etagHeader = etag as string;

      /**
       * We always use the root HTML file as the entry point.
       * This is because we are using an SPA.
       */
      const assetDownloadResponse =
        await this.investorPortalProxyRepository.DownloadRemoteAsset(
          requestId,
          baseUrl
        );
      this.#logger.log(`${logPrefix} Downloaded remote asset.`);

      payload.contentBody = this.#manipulateHtml(
        requestId,
        assetDownloadResponse.data,
        proxyConfig
      );
      this.#logger.log(`${logPrefix} HTML updated.`);

      payload.httpStatusCode = 200;

      await this.cacheManagerRepository.SetInvestorProxyHtmlCache(
        requestId,
        url.origin,
        payload
      );

      return payload;
    } catch (error) {
      this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(error)}`);
      throw error;
    }
  }

  #toRedirectOrNotToRedirectThatIsTheQuestion(storageUrl: string): boolean {
    const url = new URL(storageUrl);
    const fileName: string = path.basename(url.pathname);
    const trimmedFileName: string = fileName.trim();

    /**
     * This is needed for VITE development server.
     *
     * The links with @ have a lot of stuff happening and should be a redirect.
     * */
    if (storageUrl.indexOf('@') !== -1) {
      return true;
    }

    if (trimmedFileName === '') {
      return false;
    }

    const fileDotSegments: string[] = trimmedFileName.split('.');

    if (fileDotSegments.length < 2) {
      return false;
    }

    const fileExtension: string = _.last(fileDotSegments).toLowerCase();

    return !(fileExtension === 'html' || fileExtension === 'htm');
  }

  #manipulateHtml(
    requestId: string,
    htmlBuffer: Buffer,
    config: ConnectInvestorProxyConfigDto.IGetInvestorUiProxyConfigResponseDto
  ): Buffer {
    const loggerPrefix = LoggingUtils.generateLogPrefix(
      this.#manipulateHtml.name,
      requestId
    );

    try {
      const {
        seoData: { title, image, description },
      } = config;

      const htmlAsString = htmlBuffer.toString('utf-8');
      this.#logger.debug(`${loggerPrefix} htmlAsString: ${htmlAsString}.`);

      const $ = cheerio.load(htmlAsString);
      this.#logger.debug(`${loggerPrefix} Loaded HTML into Cheerio.`);

      const headElement = $('head');
      this.#logger.debug(`${loggerPrefix} Found HTML head element.`);

      headElement.append('<link rel="canonical">');
      this.#logger.debug(`${loggerPrefix} Added canonical link element.`);

      if (title) {
        $('title').text(title);
        this.#logger.debug(
          `${loggerPrefix} Set HTML title element value to ${title}.`
        );

        headElement.append(`<meta property="og:title" content="${title}">`);
        this.#logger.debug(
          `${loggerPrefix} Added og:title meta element. Value: ${title}.`
        );
      }

      if (description) {
        headElement.append(
          `<meta property="og:description" content="${description}">`
        );
        this.#logger.debug(
          `${loggerPrefix} Added og:description meta element.`
        );
      }

      if (image) {
        headElement.append(`<meta property="og:image" content="${image}"/>`);
        this.#logger.debug(
          `${loggerPrefix} Added og:image meta element. URL: ${image}.`
        );
      }

      const cdnBaseUrl: string =
        this.investorPortalProxyRepository.RemoteStorageUrl;
      const scriptElements = $('script');
      this.#logger.debug(
        `${loggerPrefix} Found ${scriptElements.length} script elements.`
      );

      scriptElements.each((index, element) => {
        const scriptSrc: string = $(element).attr('src');

        this.#logger.debug(`${loggerPrefix} Script element src: ${scriptSrc}.`);
        /**
         * Makes sure that CDN is used instead of 301 redirects.
         */
        if (
          scriptSrc &&
          scriptSrc.indexOf('http://') < 0 &&
          scriptSrc.indexOf('https://') < 0
        ) {
          this.#logger.debug(
            `${loggerPrefix} Script element src is relative. Value: ${scriptSrc}.`
          );
          const updatedUrl: string = new URL(scriptSrc, cdnBaseUrl).href;
          this.#logger.debug(
            `${loggerPrefix} Updated script element src. Value: ${updatedUrl}.`
          );

          $(element).attr('src', updatedUrl);
        }
      });

      const styleSheets = $('link[rel=stylesheet]');
      this.#logger.debug(
        `${loggerPrefix} Found ${styleSheets.length} style sheet elements.`
      );

      for (let i = 0; i < styleSheets.length; i++) {
        const hrefAttribute = $(styleSheets[i]).attr('href');

        /**
         * Makes sure that CDN is used instead of 301 redirects.
         */
        if (
          hrefAttribute &&
          hrefAttribute.indexOf('http://') < 0 &&
          hrefAttribute.indexOf('https://') < 0
        ) {
          this.#logger.debug(
            `${loggerPrefix} Style sheet element href is relative. Value: ${hrefAttribute}.`
          );
          const updatedUrl: string = new URL(hrefAttribute, cdnBaseUrl).href;
          this.#logger.debug(
            `${loggerPrefix} Updated style sheet element href. Value: ${updatedUrl}.`
          );

          $(styleSheets[i]).attr('href', updatedUrl);
        }
      }

      const modulePreloadElements = $('link[rel=modulepreload]');
      this.#logger.debug(
        `${loggerPrefix} Found ${modulePreloadElements.length} module preload elements.`
      );

      for (let i = 0; i < modulePreloadElements.length; i++) {
        const hrefAttribute = $(modulePreloadElements[i]).attr('href');

        /**
         * Makes sure that CDN is used instead of 301 redirects.
         */
        if (
          hrefAttribute &&
          hrefAttribute.indexOf('http://') < 0 &&
          hrefAttribute.indexOf('https://') < 0
        ) {
          this.#logger.debug(
            `${loggerPrefix} Module preload element href is relative. Value: ${hrefAttribute}.`
          );
          const updatedUrl: string = new URL(hrefAttribute, cdnBaseUrl).href;
          this.#logger.debug(
            `${loggerPrefix} Updated module preload element href. Value: ${updatedUrl}.`
          );

          $(modulePreloadElements[i]).attr('href', updatedUrl);
        }
      }

      const updatedHtml = $.html();

      return Buffer.from(updatedHtml);
    } catch (error) {
      this.#logger.error(`${loggerPrefix} ${JsonUtils.Stringify(error)}`);
      throw error;
    }
  }

  public async GetAdvisorProfile(
    requestId: string,
    origin: string
  ): Promise<IGetAdvisorProfileResponseDto> {
    if (!origin) {
      throw this.#generateMissingOriginError(requestId);
    }

    const loggingPrefix = LoggingUtils.generateLogPrefix(
      this.GetAdvisorProfile.name,
      requestId
    );
    const inputForLogging = {
      origin,
    };
    this.#logger.debug(
      `${loggingPrefix} Getting advisor profile. Input: ${JsonUtils.Stringify(
        inputForLogging
      )}`
    );
    try {
      const tenant = await this.GetTenantFromOriginUrl(requestId, origin);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await this.connectTools.GetAdvisorProfile({
        tenantRealm: tenant.realm,
        requestId,
      });
      const {
        firstName,
        lastName,
        tenantRealm,
        profileBioRichText,
        contactMeReasonsRichText,
        jobTitle,
        hasActiveSubscription,
        contactLink,
        fullProfileLink,
        advisorProfilePictureUrl,
        subscriptions,
      } = result;
      this.#logger.log(
        `${loggingPrefix} Acquired advisor profile for origin (${origin}).`
      );
      this.#logger.debug(
        `${loggingPrefix} Advisor profile: ${JsonUtils.Stringify(result)}.`
      );
      const topLevelOptions =
        await this.connectTenantCentralDb.GetConnectTenantTopLevelSettings({
          tenantId: tenant.id,
          requestId,
        });
      this.#logger.log(
        `${loggingPrefix} Acquired top level options for origin (${origin}).`
      );
      this.#logger.debug(
        `${loggingPrefix} Advisor profile: ${JsonUtils.Stringify(result)}.`
      );

      let advisorSubscriptionIds: SharedEnums.BambuGoProductIdEnum[] | null =
        null;
      if (
        subscriptions &&
        Array.isArray(subscriptions) &&
        subscriptions.length > 0
      ) {
        advisorSubscriptionIds = subscriptions.map((x) => x.bambuGoProductId);
      }

      let canPerformTransactActions = false;

      const keyData = await this.tenantApiKeyDb.GetApiKeysByTenantIdAndType(
        requestId,
        tenant.id,
        SharedEnums.ApiKeyTypeEnum.WEALTH_KERNEL_API
      );

      if (
        keyData &&
        keyData?.keyType === SharedEnums.ApiKeyTypeEnum.WEALTH_KERNEL_API
      ) {
        canPerformTransactActions = true;
      }

      return {
        canPerformTransactActions,
        firstName,
        lastName,
        tenantRealm,
        profileBioRichText,
        contactMeReasonsRichText,
        jobTitle,
        advisorSubscriptionInPlace: hasActiveSubscription,
        contactLink,
        fullProfileLink,
        advisorProfilePictureUrl,
        incomeThreshold: topLevelOptions?.incomeThreshold || null,
        retireeSavingsThreshold:
          topLevelOptions?.retireeSavingsThreshold || null,
        advisorSubscriptionIds,
      };
    } catch (error) {
      this.#logger.error(
        `${loggingPrefix} Error encountered getting advisor profile. Input: ${inputForLogging} .Error: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  public async GetTenantFromOriginUrl(
    requestId: string,
    origin: string
  ): Promise<PrismaModel.Tenant> {
    if (!origin) {
      throw this.#generateMissingOriginError(requestId);
    }

    const loggingPrefix = LoggingUtils.generateLogPrefix(
      this.GetTenantFromOriginUrl.name,
      requestId
    );
    const inputForLogging = {
      origin,
    };
    this.#logger.debug(
      `${loggingPrefix} Input: ${JsonUtils.Stringify(inputForLogging)}`
    );
    try {
      this.#logger.log(
        `${loggingPrefix} Getting tenant by for origin ${origin}.`
      );
      const tenant =
        await this.connectTenantGoalTypeCentralDbRepository.GetTenantFromUrl(
          origin
        );
      this.#logger.debug(
        `${loggingPrefix} Tenant: ${JsonUtils.Stringify(tenant)}.`
      );
      this.#logger.log(
        `${loggingPrefix} Acquired tenant for origin (${origin}).`
      );
      return tenant;
    } catch (error) {
      this.#logger.error(
        `${loggingPrefix} Error encountered getting tenant by URL. Input: ${inputForLogging} .Error: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  public async GetLegalDocuments({
    requestId,
    origin,
    requesterId,
  }: {
    requestId: string;
    origin: string;
    requesterId?: string;
  }): Promise<ConnectLegalDocumentsDto.IConnectLegalDocumentsDto> {
    if (!origin) {
      throw this.#generateMissingOriginError(requestId);
    }
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetLegalDocuments.name,
      requestId
    );
    try {
      this.#logger.log(
        `${logPrefix} Getting legal documents for origin ${origin}.`
      );

      const tenant = await this.GetTenantFromOriginUrl(requestId, origin);

      this.#logger.log(`${logPrefix} Acquiring legal documents for tenant.`);
      const tracking = { requestId, requesterId };
      const response = await this.legalDocumentsCoreDomain.GetLegalDocumentSet(
        tenant.id,
        tracking
      );
      this.#logger.log(`${logPrefix} Acquired legal documents for tenant.`);
      this.#logger.debug(
        `${logPrefix} Legal documents: ${JsonUtils.Stringify(response)}.`
      );
      return response;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(error)}`
      );
      throw error;
    }
  }

  #generateMissingOriginError(requestId: string) {
    return new ErrorUtils.ColossusError(
      'Missing origin input',
      requestId,
      {},
      400,
      SharedEnums.ErrorCodes.GenericErrorCodesEnum.MALFORMED_REQUEST
    );
  }

  public async GetGoalTypes(
    requestId: string,
    origin: string
  ): Promise<ConnectTenantDto.IConnectTenantGoalTypeDto[]> {
    if (!origin) {
      throw this.#generateMissingOriginError(requestId);
    }
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.GetGoalTypes.name,
      requestId
    );
    try {
      this.#logger.log(`${logPrefix} Getting goal types for origin ${origin}.`);

      const tenant = await this.GetTenantFromOriginUrl(requestId, origin);

      this.#logger.log(`${logPrefix} Acquiring goal types for tenant.`);

      const tenantId: string = tenant.id;
      const goalTypes =
        await this.connectTenantGoalTypeCentralDbRepository.GetTenantGoalTypesFromId(
          {
            tenantId,
          }
        );

      this.#logger.log(`${logPrefix} Acquired goal types for tenant.`);
      this.#logger.debug(
        `${logPrefix} Goal Types for tenant (${tenantId}): ${JsonUtils.Stringify(
          goalTypes
        )}.`
      );

      return goalTypes;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(error)}`
      );
      throw error;
    }
  }

  public async UpsertLead(
    tracking: IColossusTrackingDto,
    lead: ConnectLeadsDto.IConnectLeadsItemDto,
    origin: string
  ) {
    const { requestId } = tracking;
    if (!origin) {
      throw this.#generateMissingOriginError(requestId);
    }
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.UpsertLead.name,
      requestId
    );
    const inputForLogging = {
      tracking,
      lead,
    };
    this.#logger.debug(
      `${logPrefix} Input: ${JsonUtils.Stringify(inputForLogging)}`
    );
    try {
      this.#logger.log(`${logPrefix} Saving/updating leads.`);
      const { id: tenantId } = await this.GetTenantFromOriginUrl(
        requestId,
        origin
      );
      await this.leadsCentralDbRepository.UpsertLead({
        tenantId,
        lead,
        tracking,
      });

      // Emails: consider returning here if performance is an issue,
      // leaving sending of emails to a dangling promise
      if (!lead.sendAppointmentEmail && !lead.sendGoalProjectionEmail) {
        this.#logger.log(
          `${logPrefix} Current lead does not require sending of emails.`
        );
        return;
      }

      const tenant: AugmentedTenant = await this.tenantCentralDb.FindTenantById(
        tenantId
      );

      if (!tenant) {
        this.#logger.warn(
          `${logPrefix} Tenant (${tenantId}) not found. Skipping sending emails (appointment, goal projection).`
        );
        return;
      }

      const branding = {
        logoUrl: tenant?.branding?.branding?.logoUrl || null,
        brandColor: tenant?.branding?.branding?.brandColor || '#62DBB6',
        tradeName: tenant?.branding?.branding?.tradeName,
        headerBgColor: tenant?.branding?.branding?.headerBgColor || '#F2F2F2',
      } as ITenantBrandingDto.ITenantBrandingDto;

      if (!branding.logoUrl && !branding.tradeName) {
        this.#logger.warn(
          `${logPrefix} Tenant branding (url AND trade name) not found. Skipping sending emails (appointment, goal projection).`
        );
        return;
      }

      if (lead.sendAppointmentEmail) {
        if (tenant.connectAdvisors.length < 1) {
          this.#logger.warn(
            `${logPrefix} No advisor profile found for tenant (${tenantId}). Skipping sending appointment email.`
          );
          return;
        }
        if (tenant.httpUrls.length < 1) {
          this.#logger.warn(
            `${logPrefix} No advisor profile found for tenant (${tenantId}). Skipping sending appointment email.`
          );
          return;
        }
        const advisor = tenant.connectAdvisors[0];
        const investorPortalUrl = tenant.httpUrls[0].url;

        if (advisor.contactLink) {
          await this.#bakeAndSendSchedulingEmail({
            requestId,
            lead,
            branding,
            advisor,
            investorPortalUrl,
          });
        } else {
          await this.#bakeAndSendPleaseAwaitAppointmentEmail({
            requestId,
            lead,
            branding,
            advisor,
            investorPortalUrl,
          });
        }
      }

      if (lead.sendGoalProjectionEmail) {
        await this.#sendGoalProjectionEmail({
          requestId,
          lead,
          tenant,
          branding,
        });
      }
    } catch (error) {
      const message = [
        `${logPrefix} Error while saving/updating leads`,
        `Input: ${JsonUtils.Stringify(inputForLogging)}.`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.#logger.error(message);
      throw error;
    }
  }

  public async UpsertInvestor(
    tracking: IColossusTrackingDto,
    lead: ConnectLeadsDto.IConnectLeadsItemDto,
    origin: string
  ): Promise<void> {
    const { requestId } = tracking;
    if (!origin) {
      throw this.#generateMissingOriginError(requestId);
    }
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpsertInvestor.name,
      requestId
    );
    const inputForLogging = {
      tracking,
      lead,
    };
    this.#logger.debug(
      `${logPrefix} Input: ${JsonUtils.Stringify(inputForLogging)}`
    );
    try {
      this.#logger.log(`${logPrefix} Saving/updating investor.`);

      /**
       * TODO:
       *
       * Add method to check if the investor is already a user.
       *
       * If the person is already a user, throw error.
       */

      const { id: tenantId } = await this.GetTenantFromOriginUrl(
        requestId,
        origin
      );
      await this.investorCentralDb.UpsertInvestorLead(
        requestId,
        tenantId,
        lead
      );
      await this.goalCentralDb.UpsertLeadGoal(requestId, tenantId, lead);

      // Emails: consider returning here if performance is an issue,
      // leaving sending of emails to a dangling promise
      if (!lead.sendAppointmentEmail && !lead.sendGoalProjectionEmail) {
        this.#logger.log(
          `${logPrefix} Current lead does not require sending of emails.`
        );
        return;
      }

      const tenant: AugmentedTenant = await this.tenantCentralDb.FindTenantById(
        tenantId
      );

      if (!tenant) {
        this.#logger.warn(
          `${logPrefix} Tenant (${tenantId}) not found. Skipping sending emails (appointment, goal projection).`
        );
        return;
      }

      /**
       * TODO: Consolidate this with the OTP email sending branding.
       */
      const branding = {
        logoUrl: tenant?.branding?.branding?.logoUrl || null,
        brandColor: tenant?.branding?.branding?.brandColor || '#62DBB6',
        tradeName: tenant?.branding?.branding?.tradeName,
        headerBgColor: tenant?.branding?.branding?.headerBgColor || '#F2F2F2',
      } as ITenantBrandingDto.ITenantBrandingDto;

      if (!branding.logoUrl && !branding.tradeName) {
        this.#logger.warn(
          `${logPrefix} Tenant branding (url AND trade name) not found. Skipping sending emails (appointment, goal projection).`
        );
        return;
      }

      if (lead.sendAppointmentEmail) {
        if (tenant.connectAdvisors.length < 1) {
          this.#logger.warn(
            `${logPrefix} No advisor profile found for tenant (${tenantId}). Skipping sending appointment email.`
          );
          return;
        }
        if (tenant.httpUrls.length < 1) {
          this.#logger.warn(
            `${logPrefix} No advisor profile found for tenant (${tenantId}). Skipping sending appointment email.`
          );
          return;
        }
        const advisor = tenant.connectAdvisors[0];
        const investorPortalUrl = tenant.httpUrls[0].url;

        if (advisor.contactLink) {
          await this.#bakeAndSendSchedulingEmail({
            requestId,
            lead,
            branding,
            advisor,
            investorPortalUrl,
          });
        } else {
          await this.#bakeAndSendPleaseAwaitAppointmentEmail({
            requestId,
            lead,
            branding,
            advisor,
            investorPortalUrl,
          });
        }
      }

      if (lead.sendGoalProjectionEmail) {
        await this.#sendGoalProjectionEmail({
          requestId,
          lead,
          tenant,
          branding,
        });
      }
    } catch (error) {
      const message = [
        `${logPrefix} Error while saving/updating investors`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.#logger.error(message);
      this.#logger.debug(`Input: ${JsonUtils.Stringify(inputForLogging)}.`);
      throw error;
    }
  }

  async #bakeAndSendPleaseAwaitAppointmentEmail({
    requestId,
    lead,
    advisor,
    investorPortalUrl,
    branding,
  }: {
    requestId: string;
    lead: ConnectLeadsDto.IConnectLeadsItemDto;
    advisor: PrismaModel.ConnectAdvisor;
    investorPortalUrl: string;
    branding: ITenantBrandingDto.ITenantBrandingDto;
  }) {
    const loggingPrefix = LoggingUtils.generateLogPrefix(
      this.#bakeAndSendPleaseAwaitAppointmentEmail.name,
      requestId
    );
    const emailBody =
      await this.notificationTemplatesRepository.GenerateTemplatedMessage({
        templateName: TemplateNameEnum.PLEASE_AWAIT_APPOINTMENT,
        channel: NotificationTemplateChannelEnum.EMAIL,
        parameters: {
          investorPortalUrl,
          agentName: advisor?.firstName,
          ...branding,
          name: lead.name,
        } as IPleaseAwaitAppointmentTemplateParametersDto,
      });
    this.#logger.debug(
      `${loggingPrefix} Generated email body. Body: ${emailBody}.`
    );
    await this.notificationRepository.NotifyUser({
      body: emailBody,
      to: lead.email,
      subject: 'We’ll get back to you soon!',
      type: NotificationTypeEnum.EMAIL,
    });
    return;
  }

  async #bakeAndSendSchedulingEmail({
    requestId,
    lead,
    advisor,
    investorPortalUrl,
    branding,
  }: {
    requestId: string;
    lead: ConnectLeadsDto.IConnectLeadsItemDto;
    advisor: PrismaModel.ConnectAdvisor;
    investorPortalUrl: string;
    branding: ITenantBrandingDto.ITenantBrandingDto;
  }) {
    const loggingPrefix = LoggingUtils.generateLogPrefix(
      this.#bakeAndSendSchedulingEmail.name,
      requestId
    );
    const emailBody =
      await this.notificationTemplatesRepository.GenerateTemplatedMessage({
        templateName: TemplateNameEnum.SCHEDULE_APPOINTMENT,
        channel: NotificationTemplateChannelEnum.EMAIL,
        parameters: {
          ...branding,
          investorPortalUrl,
          agentName: advisor?.firstName,
          contactLink: advisor?.contactLink,
          name: lead.name,
        } as IScheduleAppointmentTemplateParametersDto,
      });
    this.#logger.debug(
      `${loggingPrefix} Generated email body. Body: ${emailBody}.`
    );
    // generate email body
    await this.notificationRepository.NotifyUser({
      body: emailBody,
      to: lead.email,
      subject: 'Schedule an appointment',
      type: NotificationTypeEnum.EMAIL,
    });
    return;
  }

  async #sendGoalProjectionEmail({
    requestId,
    tenant,
    lead,
    branding,
  }: {
    requestId: string;
    tenant: AugmentedTenant;
    lead: ConnectLeadsDto.IConnectLeadsItemDto;
    branding: ITenantBrandingDto.ITenantBrandingDto;
  }) {
    const loggingPrefix = LoggingUtils.generateLogPrefix(
      this.#sendGoalProjectionEmail.name,
      requestId
    );
    const inputForLogging = {
      lead,
      tenant,
    };
    this.#logger.debug(
      `${loggingPrefix} Input: ${JsonUtils.Stringify(inputForLogging)}`
    );

    try {
      const portfolioSummaries =
        await this.portfolioSummaryDb.GetConnectPortfolioSummaries({
          requestId,
          tenantRealm: tenant.id,
        });

      this.#logger.debug(
        [
          `${loggingPrefix} Acquired tenant and portfolio summary.`,
          `Tenant: ${JsonUtils.Stringify(tenant)}.`,
          `Portfolio Summaries: ${JsonUtils.Stringify(portfolioSummaries)}.`,
        ].join(' ')
      );

      const targetPortfolio = portfolioSummaries.find(
        (x) => x.id === lead.riskAppetite
      );

      if (!targetPortfolio) {
        this.#logger.warn(
          `${loggingPrefix} Target portfolio (${lead.riskAppetite}) not found for tenant (${tenant.id}). Skipping sending goal projection email.`
        );
        return;
      }

      const {
        name: portfolioName,
        description: portfolioDescription,
        expectedReturnPercent,
        expectedVolatilityPercent,
        key,
        assetClassAllocation,
      } = targetPortfolio;

      const emailBody =
        await this.notificationTemplatesRepository.GenerateTemplatedMessage({
          templateName: TemplateNameEnum.SEND_INVESTMENT_PLAN_TO_LEAD,
          channel: NotificationTemplateChannelEnum.EMAIL,
          parameters: {
            lead,
            portfolioDescription,
            portfolioExpectedReturn: Number.parseFloat(expectedReturnPercent),
            portfolioExpectedVolatility: Number.parseFloat(
              expectedVolatilityPercent
            ),
            portfolioAssetDistribution: _.chain(assetClassAllocation)
              .filter((x) => x.included === true)
              .map((x) => {
                const { assetClass, percentOfPortfolio } = x;
                return {
                  type: assetClass,
                  percentageInInteger: Number.parseFloat(percentOfPortfolio),
                };
              })
              .value(),
            branding,
            portfolioKey: key as SharedEnums.PortfolioEnums.PortfolioKeyEnum,
            portfolioName,
          } as ISendInvestmentPlanToLeadParametersDto,
        });

      this.#logger.debug(
        `${loggingPrefix} Generated email body. Body: ${emailBody}.`
      );

      await this.notificationRepository.NotifyUser({
        body: emailBody,
        to: lead.email,
        subject: 'Your financial plan is ready!',
        type: NotificationTypeEnum.EMAIL,
      });
    } catch (error) {
      const message: string = [
        `${loggingPrefix} Error encountered sending goal projection email.`,
        `Input: ${JsonUtils.Stringify(inputForLogging)}.`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');

      this.#logger.error(message);

      throw error;
    }
  }

  public async GetInvestorLatestQuestionnaireVersion(
    requestUrl: string,
    requestId: string
  ): Promise<IGetLatestQuestionnaireVersion> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetInvestorLatestQuestionnaireVersion.name,
      requestId
    );
    try {
      this.#logger.log(
        `${logPrefix} Validating if "${requestUrl}" is allowed to serve questionnaire versions`
      );

      if (!this.#isRequestUrlValid(requestUrl, requestId)) {
        const invalidRequestUrlError = new ErrorUtils.ColossusError(
          'The origin of this request does not conform to a valid HTTP url.',
          requestId,
          {
            requestUrl,
          },
          400,
          SharedEnums.ErrorCodes.GenericErrorCodesEnum.MALFORMED_REQUEST
        );
        this.#logger.error(
          `${logPrefix} Error: ${JsonUtils.Stringify(invalidRequestUrlError)}`
        );
        throw invalidRequestUrlError;
      }

      const tenantHttpEntry = await this.tenantCentralDb.GetTenantHttpUrl(
        requestUrl
      );

      const { tenantId } = tenantHttpEntry;

      const tenantInfo = await this.tenantCentralDb.FindTenantById(tenantId);
      this.#logger.debug(
        `${logPrefix} Tenant info: ${JsonUtils.Stringify({
          tenantInfo,
        })}.`
      );
      const isTenancyValid = await this.#guardValidityOfTenancy(
        requestId,
        requestUrl,
        tenantInfo
      );
      if (!isTenancyValid) {
        const invalidTenancyError = new ErrorUtils.ColossusError(
          [
            `The tenant bound to the requested url (${requestUrl}) has invalid configuration.`,
            `Please ensure that the subscription is still valid and all configurations are in place.`,
          ].join(' '),
          requestId,
          {
            requestUrl,
          },
          422,
          SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_SETUP_INCOMPLETE_OR_EXPIRED
        );
        this.#logger.error(
          `${logPrefix} Error: ${JsonUtils.Stringify(invalidTenancyError)}`
        );
        throw invalidTenancyError;
      }

      const results =
        await this.riskProfilingDbRepo.GetLatestRiskQuestionnaireVersionNumber({
          tenantId,
          requestId,
        });

      return results;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error getting Questionnaire Version. Error: ${JSON.stringify(
          error
        )}  `
      );
      throw error;
    }
  }

  public async GetInvestorRiskQuestionnaire(
    requestUrl: string,
    requestId: string
  ): Promise<InvestorRiskQuestionnaire> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetInvestorRiskQuestionnaire.name,
      requestId
    );
    try {
      this.#logger.log(
        `${logPrefix} Validating if "${requestUrl}" is allowed to serve questionnaire versions`
      );

      if (!this.#isRequestUrlValid(requestUrl, requestId)) {
        const invalidRequestUrlError = new ErrorUtils.ColossusError(
          'The origin of this request does not conform to a valid HTTP url.',
          requestId,
          {
            requestUrl,
          },
          400,
          SharedEnums.ErrorCodes.GenericErrorCodesEnum.MALFORMED_REQUEST
        );
        this.#logger.error(
          `${logPrefix} Error: ${JsonUtils.Stringify(invalidRequestUrlError)}`
        );
        throw invalidRequestUrlError;
      }

      const tenantHttpEntry = await this.tenantCentralDb.GetTenantHttpUrl(
        requestUrl
      );

      const { tenantId } = tenantHttpEntry;

      const tenantInfo = await this.tenantCentralDb.FindTenantById(tenantId);
      this.#logger.debug(
        `${logPrefix} Tenant info: ${JsonUtils.Stringify({
          tenantInfo,
        })}.`
      );
      const isTenancyValid = await this.#guardValidityOfTenancy(
        requestId,
        requestUrl,
        tenantInfo
      );
      if (!isTenancyValid) {
        const invalidTenancyError = new ErrorUtils.ColossusError(
          [
            `The tenant bound to the requested url (${requestUrl}) has invalid configuration.`,
            `Please ensure that the subscription is still valid and all configurations are in place.`,
          ].join(' '),
          requestId,
          {
            requestUrl,
          },
          422,
          SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_SETUP_INCOMPLETE_OR_EXPIRED
        );
        this.#logger.error(
          `${logPrefix} Error: ${JsonUtils.Stringify(invalidTenancyError)}`
        );
        throw invalidTenancyError;
      }

      const results = await this.riskProfilingDbRepo.GetRiskQuestionnaire({
        tenantId,
        requestId,
      });

      return results;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error getting Questionnaires. Error: ${JSON.stringify(
          error
        )}  `
      );
      throw error;
    }
  }

  public async ComputeRiskProfileScore(
    requestUrl: string,
    input: CalculateRiskProfileScoreRequest,
    claims: IServerCoreIamClaimsDto,
    requestId: string
  ): Promise<IRiskCalculateResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ComputeRiskProfileScore.name,
      requestId
    );

    const loggingPayload: Record<string, unknown> = {
      input,
      claims,
    };

    this.#logger.debug(
      `${logPrefix} Start. Input: ${JsonUtils.Stringify(loggingPayload)}.`
    );

    this.#logger.log(
      `${logPrefix} Validating if "${requestUrl}" is allowed to calculate risk score`
    );

    if (!this.#isRequestUrlValid(requestUrl, requestId)) {
      const invalidRequestUrlError = new ErrorUtils.ColossusError(
        'The origin of this request does not conform to a valid HTTP url.',
        requestId,
        {
          requestUrl,
        },
        400,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.MALFORMED_REQUEST
      );
      this.#logger.error(
        `${logPrefix} Error: ${JsonUtils.Stringify(invalidRequestUrlError)}`
      );
      throw invalidRequestUrlError;
    }

    try {
      const tenantHttpEntry = await this.tenantCentralDb.GetTenantHttpUrl(
        requestUrl
      );

      const { tenantId } = tenantHttpEntry;

      const tenantInfo = await this.tenantCentralDb.FindTenantById(tenantId);
      this.#logger.debug(
        `${logPrefix} Tenant info: ${JsonUtils.Stringify({
          tenantInfo,
        })}.`
      );
      const isTenancyValid = await this.#guardValidityOfTenancy(
        requestId,
        requestUrl,
        tenantInfo
      );
      if (!isTenancyValid) {
        const invalidTenancyError = new ErrorUtils.ColossusError(
          [
            `The tenant bound to the requested url (${requestUrl}) has invalid configuration.`,
            `Please ensure that the subscription is still valid and all configurations are in place.`,
          ].join(' '),
          requestId,
          {
            requestUrl,
          },
          422,
          SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_SETUP_INCOMPLETE_OR_EXPIRED
        );
        this.#logger.error(
          `${logPrefix} Error: ${JsonUtils.Stringify(invalidTenancyError)}`
        );
        throw invalidTenancyError;
      }

      // Get risk Questionnaires for the version
      const riskQuestionnaires =
        await this.riskProfilingDbRepo.GetRiskQuestionnaire({
          tenantId: tenantId,
          requestId: requestId,
          versionNumber: input.questionnaireVersion,
        });

      const payload: IBambuApiLibraryCalculateRiskPayloadDto =
        this.assembleApiPayloadForRiskProfilingApi(
          requestId,
          riskQuestionnaires,
          input
        );

      const results = await this.bambuApiLibraryService.CalculateRiskScore(
        requestId,
        payload,
        claims
      );

      const responsePayload = await this.assembleRiskScoreResponse(
        requestId,
        tenantId,
        riskQuestionnaires,
        input,
        results
      );

      this.#logger.debug(
        `${logPrefix} End. Input: ${JsonUtils.Stringify({
          ...loggingPayload,
          results,
          responsePayload,
        })}`
      );

      return responsePayload;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error Getting risk score.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}.`,
        `Error: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');

      this.#logger.error(errorMessage);
      throw error;
    }
  }

  private assembleApiPayloadForRiskProfilingApi(
    requestId: string,
    dbPayload: IGetRiskQuestionnaire,
    input: CalculateRiskProfileScoreRequest
  ): IBambuApiLibraryCalculateRiskPayloadDto {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.assembleApiPayloadForRiskProfilingApi.name,
      requestId
    );

    this.#logger.log(`${logPrefix} assembling Api Payload ForRiskProfilingApi`);

    try {
      const groupedQuestions = _.chain(dbPayload.Questionnaire)
        .groupBy((x) => x.groupingType)
        .value();

      const riskCapacityQuestions: IQuestionnaireGrouping[] =
        groupedQuestions['RISK_CAPACITY'];

      const riskToleranceQuestions: IQuestionnaireGrouping[] =
        groupedQuestions['RISK_TOLERANCE'];

      const assembledPayload = {
        nbRiskBuckets: '5',
        roundFlag: true,
        questionnaire: [
          {
            questionId: '1',
            questionCategoryName: 'Risk Capacity',
            questionCapFlag: true,
            questionWeight: '0.5',
            questionRoundFlag: true,
            questionDetails: this.assembleRiskCapacityQuestionDetails(
              requestId,
              riskCapacityQuestions,
              input
            ),
          },
          {
            questionId: '2',
            questionCategoryName: 'Risk Tolerance',
            questionCapFlag: true,
            questionWeight: '0.5',
            questionRoundDownFlag: true,
            questionDetails: this.assembleRiskToleranceQuestionDetails(
              requestId,
              riskToleranceQuestions,
              input
            ),
          },
        ],
      };

      this.#logger.debug(`Payload ${JsonUtils.Stringify(assembledPayload)}`);

      return assembledPayload;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while Assembling Api Payload ForRiskProfilingApi ${JsonUtils.Stringify(
          error
        )}  `
      );
      throw error;
    }
  }

  private assembleRiskCapacityQuestionDetails(
    requestId: string,
    questionGroup: IQuestionnaireGrouping[],
    input: CalculateRiskProfileScoreRequest
  ): IBambuApiLibraryQuestionnairePayloadDto[] {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.assembleRiskCapacityQuestionDetails.name,
      requestId
    );

    this.#logger.log(
      `${logPrefix} Assembling RiskCapacity QuestionDetails,
      )}`
    );

    try {
      const riskCapacityQuestionsGrouped = _.chain(questionGroup)
        .groupBy((x) => x.groupingName)
        .value();

      const result = [];

      const financialHealthKey = 'FINANCIAL_HEALTH';
      const financialRiskCapacityQuestionGroup =
        riskCapacityQuestionsGrouped[financialHealthKey][0];

      const financialHealthGroupingAdditionalConfiguration =
        financialRiskCapacityQuestionGroup.additionalConfiguration as Record<
          string,
          unknown
        >;

      const apiFinancialHealthQuestionDetail = {
        questionId: '1.1',
        questionCategoryName: financialHealthKey,
        questionWeight: financialRiskCapacityQuestionGroup.groupingWeight,
        ...financialHealthGroupingAdditionalConfiguration,
        questionDetails: financialRiskCapacityQuestionGroup.Questions.map(
          (question) => {
            const {
              id: questionId,
              questionWeight,
              questionFormat,
              additionalConfiguration,
              questionType: questionCategoryName,
              Answers: answers,
            } = question;

            const processedQuestion = {
              questionId,
              questionCategoryName,
              questionWeight,
              questionAnswer: null,
            };

            const additionalConfig = additionalConfiguration as Record<
              string,
              unknown
            >;

            if (
              questionFormat === 'NUMERIC_ENTRY' &&
              questionCategoryName === 'INCOME'
            ) {
              if (additionalConfig?.scoreRangeConfig) {
                delete additionalConfig.scoreRangeConfig;
              }

              if (additionalConfig) {
                Object.assign(processedQuestion, additionalConfig);
              }

              processedQuestion.questionAnswer = input.answers
                .find((x) => x.questionId === questionId)
                ?.answerScoreNumber.toString();
            } else {
              if (additionalConfig) {
                Object.assign(processedQuestion, additionalConfig);
              }

              const clientAnswer = input.answers.find(
                (x) => x.questionId === questionId
              );

              const { answerId } = clientAnswer;
              const answerInDb = answers.find((x) => x.id === answerId);

              processedQuestion.questionAnswer = answerInDb.score;
            }
            processedQuestion.questionId = question.sortKey.toString();

            return processedQuestion;
          }
        ),
      };

      result.push(apiFinancialHealthQuestionDetail);

      const ageKey = 'AGE';
      const ageRiskCapacityQuestionGroup =
        riskCapacityQuestionsGrouped[ageKey][0];
      const ageGroupingAdditionalConfiguration =
        ageRiskCapacityQuestionGroup.additionalConfiguration as Record<
          string,
          unknown
        >;

      const { id: ageQuestionId } = ageRiskCapacityQuestionGroup.Questions[0];
      const ageQuestionAnswer = input.answers.find(
        (x) => x.questionId === ageQuestionId
      );
      const apiAgeQuestionDetail = {
        ...ageGroupingAdditionalConfiguration,
        questionId: '1.2',
        questionCategoryName: ageKey,
        questionWeight: ageRiskCapacityQuestionGroup.groupingWeight,
        questionAnswer: ageQuestionAnswer.answerScoreNumber.toString(),
      };

      result.push(apiAgeQuestionDetail);

      const goalYearKey = 'GOAL';
      const goalYearRiskCapacityQuestionGroup =
        riskCapacityQuestionsGrouped[goalYearKey][0];
      const goalYearGroupingAdditionalConfiguration =
        goalYearRiskCapacityQuestionGroup.additionalConfiguration as Record<
          string,
          unknown
        >;
      const goalYearInput = input.answers.find(
        (x) => x.questionGroupingId === goalYearRiskCapacityQuestionGroup.id
      );
      const apiGoalYearQuestionDetail = {
        ...goalYearGroupingAdditionalConfiguration,
        questionId: '1.3',
        questionCategoryName: goalYearKey,
        questionWeight: goalYearRiskCapacityQuestionGroup.groupingWeight,
        questionAnswer: goalYearInput.answerScoreNumber.toString(),
      };
      result.push(apiGoalYearQuestionDetail);

      const productKnowledgeAndExperienceKey = 'FINANCIAL_KNOWLEDGE';
      const productKnowledgeAndExperienceRiskCapacityQuestionGroup =
        riskCapacityQuestionsGrouped[productKnowledgeAndExperienceKey][0];
      const productKnowledgeAndExperienceGroupingAdditionalConfiguration =
        productKnowledgeAndExperienceRiskCapacityQuestionGroup.additionalConfiguration as Record<
          string,
          unknown
        >;
      const productKnowledgeAndExperienceInput = input.answers.find(
        (x) =>
          x.questionGroupingId ===
          productKnowledgeAndExperienceRiskCapacityQuestionGroup.id
      );
      const clientAnswerId = productKnowledgeAndExperienceInput.answerId;
      const answerValue =
        productKnowledgeAndExperienceRiskCapacityQuestionGroup.Questions[0].Answers.find(
          (x) => x.id === clientAnswerId
        ).score;
      const apiProductKnowledgeAndExperienceQuestionDetail = {
        ...productKnowledgeAndExperienceGroupingAdditionalConfiguration,
        questionId: '1.4',
        questionCategoryName: productKnowledgeAndExperienceKey,
        questionWeight:
          productKnowledgeAndExperienceRiskCapacityQuestionGroup.groupingWeight,
        questionAnswer: answerValue,
      };
      result.push(apiProductKnowledgeAndExperienceQuestionDetail);
      return result;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while Assembling RiskCapacity Question details ${JsonUtils.Stringify(
          error
        )}  `
      );
      throw error;
    }
  }

  private assembleRiskToleranceQuestionDetails(
    requestId: string,
    questionGroup: IQuestionnaireGrouping[],
    input: CalculateRiskProfileScoreRequest
  ): IBambuApiLibraryQuestionnairePayloadDto[] {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.assembleRiskToleranceQuestionDetails.name,
      requestId
    );

    this.#logger.log(`${logPrefix} Assembling Risk Tolerance QuestionDetails.`);

    try {
      const assembledData = questionGroup[0].Questions.map(
        (x: IQuestion, index) => {
          const {
            id: questionId,
            questionType: questionCategoryName,
            questionWeight,
            additionalConfiguration,
            Answers: answers,
          } = x;
          const questionAdditionalConfiguration =
            (additionalConfiguration as Record<string, unknown>) ||
            ({} as Record<string, unknown>);

          const targetInput = input.answers.find(
            (x) => x.questionId === questionId
          );

          let questionAnswer = String(targetInput.answerScoreNumber);

          if (answers.length > 0) {
            const targetAnswer = answers.find(
              (x) => x.id === targetInput.answerId
            );
            questionAnswer = targetAnswer.score;
          }

          return {
            questionId: String(index + 1),
            questionCategoryName,
            questionWeight,
            questionAnswer,
            ...questionAdditionalConfiguration,
          };
        }
      );

      this.#logger.debug(
        `${logPrefix} Assembled Risk Tolerance QuestionDetails ${JsonUtils.Stringify(
          assembledData
        )}.`
      );

      return assembledData;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while Assembling Risk Tolerance Question details ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }

  private async assembleRiskScoreResponse(
    requestId: string,
    tenantId: string,
    riskQuestionnaires: IGetRiskQuestionnaire,
    requestInput: CalculateRiskProfileScoreRequest,
    apiLibResponse: CalculateRiskProfileScoreResponse
  ): Promise<IRiskCalculateResponseDto> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.assembleRiskScoreResponse.name,
      requestId
    );
    this.#logger.log(`${logPrefix} Assembling Risk Score Response.`);

    try {
      const riskProfiles = await this.riskProfilingDbRepo.GetRiskProfiles(
        tenantId,
        requestId
      );

      const modelRiskProfile = _.find(riskProfiles, {
        lowerLimit: apiLibResponse.overallScore,
        upperLimit: apiLibResponse.overallScore,
      });

      const modelPortfolio =
        await this.portfolioSummaryDb.GetConnectModelPortfolio(
          requestId,
          tenantId,
          modelRiskProfile.id
        );

      const payload: IRiskCalculateResponseDto = {
        questionnaireId: riskQuestionnaires.id,
        questionnaireVersion: riskQuestionnaires.activeVersion,
        questionnairePayload: requestInput.answers,
        riskProfileComputationResult: apiLibResponse.overallScoreDetails,
        riskProfileScore: apiLibResponse.overallScore,
        modelRiskProfile: {
          riskProfileId: modelRiskProfile.id,
          riskProfileName: modelRiskProfile.riskProfileName,
          riskProfileDescription: modelRiskProfile.riskProfileDescription,
        },
        modelPortfolioId: modelPortfolio.id,
      };

      this.#logger.log(`${logPrefix} Assembled Risk Score Response.`);

      return payload;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while Assembling RiskScore Response Data ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }

  public async GetInvestorRiskProfiles(
    requestUrl: string,
    requestId: string
  ): Promise<IRiskProfileDto[] | null> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetInvestorRiskProfiles.name,
      requestId
    );
    try {
      this.#logger.log(
        `${logPrefix} Validating if "${requestUrl}" is allowed to serve questionnaire versions`
      );

      if (!this.#isRequestUrlValid(requestUrl, requestId)) {
        const invalidRequestUrlError = new ErrorUtils.ColossusError(
          'The origin of this request does not conform to a valid HTTP url.',
          requestId,
          {
            requestUrl,
          },
          400,
          SharedEnums.ErrorCodes.GenericErrorCodesEnum.MALFORMED_REQUEST
        );
        this.#logger.error(
          `${logPrefix} Error: ${JsonUtils.Stringify(invalidRequestUrlError)}`
        );
        throw invalidRequestUrlError;
      }

      const tenantHttpEntry = await this.tenantCentralDb.GetTenantHttpUrl(
        requestUrl
      );

      const { tenantId } = tenantHttpEntry;

      const tenantInfo = await this.tenantCentralDb.FindTenantById(tenantId);
      this.#logger.debug(
        `${logPrefix} Tenant info: ${JsonUtils.Stringify({
          tenantInfo,
        })}.`
      );
      const isTenancyValid = await this.#guardValidityOfTenancy(
        requestId,
        requestUrl,
        tenantInfo
      );
      if (!isTenancyValid) {
        const invalidTenancyError = new ErrorUtils.ColossusError(
          [
            `The tenant bound to the requested url (${requestUrl}) has invalid configuration.`,
            `Please ensure that the subscription is still valid and all configurations are in place.`,
          ].join(' '),
          requestId,
          {
            requestUrl,
          },
          422,
          SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_SETUP_INCOMPLETE_OR_EXPIRED
        );
        this.#logger.error(
          `${logPrefix} Error: ${JsonUtils.Stringify(invalidTenancyError)}`
        );
        throw invalidTenancyError;
      }

      const results: IRiskProfileDto[] =
        await this.riskProfilingDbRepo.GetRiskProfiles(tenantId, requestId);

      return results;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error getting Investor Risk Profiles. Error: ${JSON.stringify(
          error
        )}  `
      );
      throw error;
    }
  }
}
