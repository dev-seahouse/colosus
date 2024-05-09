// noinspection ES6PreferShortImport

import { IInvestorClientConfigDto } from '@bambu/server-core/configuration';
import { Enums } from '@bambu/server-core/constants';
import { PrismaModel } from '@bambu/server-core/db/central-db';
import {
  AuthenticationServiceBase,
  IamAdminServiceBase,
  IAuthenticationLoginRequestDto,
  IAuthenticationLoginResponseDto,
  TenantBrandingServiceBase,
  TenantServiceBase,
} from '@bambu/server-core/domains';
import { IColossusTrackingDto } from '@bambu/server-core/dto';
import {
  BlobRepositoryServiceBase,
  CacheManagerRepositoryServiceBase,
  ConnectAdvisorCentralDbRepositoryService,
  ConnectAdvisorPreferencesCentralDbRepositoryServiceBase,
  ConnectPortfolioSummaryCentralDbRepositoryService,
  ConnectTenantCentralDbRepositoryService,
  ConnectTenantGoalTypeCentralDbRepositoryService,
  GoalTypeCentralDbRepositoryService,
  IGetInvestorLeadsPagedResponseDataDto,
  InvestorCentralDbRepositoryServiceBase,
  LeadsCentralDbRepositoryService,
  RiskProfilingCentralDbService,
  TenantCentralDbRepositoryService,
  UserCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import {
  BambuEventEmitterService,
  ErrorUtils,
  HUBSPOT_EVENTS,
  HubspotUpdateContactPayload,
  JoseUtils,
  JsonUtils,
  LoggingUtils,
  UuidUtils,
} from '@bambu/server-core/utilities';
import {
  AuthenticationDto,
  ConnectAdvisorDto,
  ConnectLeadsDto,
  ConnectPortfolioSummaryDto,
  ConnectTenantDto,
  IGenericDataSummaryDto,
  OtpDto,
  SharedEnums,
} from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import * as crypto from 'crypto';
import * as _ from 'lodash';
import * as Luxon from 'luxon';
import { ConnectToolsServiceBase, IGetProfileInputDto } from '../tools';
import {
  ConnectAdvisorServiceBase,
  GenerateValueForSummaryObjectNumberRulesParamsDto,
  GenerateValueForSummaryObjectParamsDto,
  IAdvisorServiceGetLeadByIdParamDto,
  IGenerateValueForSummaryObjectNumberRulesParamsDto,
  IGenerateValueForSummaryObjectParamsDto,
  ISetGoalTypesInput,
  ISetInternalProfilePictureOpts,
  ISetProfilePictureOpts,
  IUnsetInternalProfilePictureOpts,
  IUnsetProfilePictureOpts,
} from './connect-advisor.service.base';
import { IamDto } from '@bambu/shared';

@Injectable()
export class ConnectAdvisorService implements ConnectAdvisorServiceBase {
  readonly #logger = new Logger(ConnectAdvisorService.name);

  constructor(
    private readonly investorClientConfig: ConfigService<IInvestorClientConfigDto>,
    private readonly connectAdvisorCentralDb: ConnectAdvisorCentralDbRepositoryService,
    private readonly connectPortfolioSummaryCentralDb: ConnectPortfolioSummaryCentralDbRepositoryService,
    private readonly goalTypeCentralDb: GoalTypeCentralDbRepositoryService,
    private readonly connectTenantGoalTypeCentralDb: ConnectTenantGoalTypeCentralDbRepositoryService,
    private readonly tenantCentralDb: TenantCentralDbRepositoryService,
    private readonly tenantService: TenantServiceBase,
    private readonly authenticationService: AuthenticationServiceBase,
    private readonly connectToolsService: ConnectToolsServiceBase,
    private readonly iamAdminService: IamAdminServiceBase,
    private readonly tenantBrandingService: TenantBrandingServiceBase,
    private readonly cacheManagerRepository: CacheManagerRepositoryServiceBase,
    private readonly connectTenantCentralDb: ConnectTenantCentralDbRepositoryService,
    private readonly blobRepository: BlobRepositoryServiceBase,
    private readonly eventEmitter: BambuEventEmitterService,
    private readonly connectAdvisorPreferencesCentralDb: ConnectAdvisorPreferencesCentralDbRepositoryServiceBase,
    private readonly userCentralDb: UserCentralDbRepositoryService,
    private readonly leadsCentralDb: LeadsCentralDbRepositoryService,
    private readonly riskProfilesCentralDb: RiskProfilingCentralDbService,
    private readonly investorCentralDb: InvestorCentralDbRepositoryServiceBase
  ) {}

  async SetInternalProfilePicture({
    tenantId,
    userId,
    filePath,
    originalFilename,
    contentType,
    tracking,
  }: ISetInternalProfilePictureOpts): Promise<void> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.SetInternalProfilePicture.name,
      tracking.requestId
    );
    try {
      const tenant = await this.tenantCentralDb.FindTenantById(tenantId);

      const advisorInternalProfilePictureUrl =
        await this.blobRepository.CreatePublicBlobFromLocalFile(
          filePath,
          contentType,
          Enums.FileUpload.Paths.DOCUMENTS,
          originalFilename
        );
      await this.connectAdvisorCentralDb.UpsertAdvisor({
        tenantRealm: tenant.realm,
        userId,
        advisorInternalProfilePictureUrl,
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error getting tenant id from tenant name: ${error}.`
      );
      throw error;
    }
  }

  async UnsetInternalProfilePicture({
    tenantId,
    userId,
    tracking,
  }: IUnsetInternalProfilePictureOpts): Promise<void> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.UnsetInternalProfilePicture.name,
      tracking.requestId
    );
    try {
      const tenant = await this.tenantCentralDb.FindTenantById(tenantId);
      await this.connectAdvisorCentralDb.UpsertAdvisor({
        userId,
        tenantRealm: tenant.realm,
        advisorInternalProfilePictureUrl: null,
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error unsetting profile picture: ${error}.`
      );
      throw error;
    }
  }

  async SetProfilePicture({
    tenantId,
    userId,
    filePath,
    originalFilename,
    contentType,
    tracking,
  }: ISetProfilePictureOpts): Promise<void> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.SetProfilePicture.name,
      tracking.requestId
    );
    try {
      const tenant = await this.tenantCentralDb.FindTenantById(tenantId);

      const advisorProfilePictureUrl =
        await this.blobRepository.CreatePublicBlobFromLocalFile(
          filePath,
          contentType,
          Enums.FileUpload.Paths.DOCUMENTS,
          originalFilename
        );
      await this.connectAdvisorCentralDb.UpsertAdvisor({
        tenantRealm: tenant.realm,
        userId,
        advisorProfilePictureUrl,
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error getting tenant id from tenant name: ${error}.`
      );
      throw error;
    }
  }

  async UnsetProfilePicture({
    tenantId,
    userId,
    tracking,
  }: IUnsetProfilePictureOpts): Promise<void> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.UnsetProfilePicture.name,
      tracking.requestId
    );
    try {
      const tenant = await this.tenantCentralDb.FindTenantById(tenantId);
      await this.connectAdvisorCentralDb.UpsertAdvisor({
        userId,
        tenantRealm: tenant.realm,
        advisorProfilePictureUrl: null,
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error unsetting profile picture: ${error}.`
      );
      throw error;
    }
  }

  async GetTradeNameAndSubdomain(
    tenantId: string
  ): Promise<ConnectTenantDto.IConnectTenantTradeNameAndSubdomainDto> {
    const tenant = await this.tenantCentralDb.FindTenantById(tenantId);
    let subdomain: string | null = null;
    if (tenant?.httpUrls?.length) {
      const fullHost = new URL(tenant.httpUrls[0].url).host;
      const { host } = this.investorClientConfig.get(
        'investorClient'
      ) as IInvestorClientConfigDto['investorClient'];
      subdomain = fullHost.replace(`.${host}`, '');
    }
    const branding = await this.tenantBrandingService.GetBranding({ tenantId });
    const tradeName = branding.tradeName;
    return { subdomain, tradeName };
  }

  async SetTradeNameAndSubdomain({
    tracking,
    tenantIdOrRealm,
    payload,
  }: {
    tracking: IColossusTrackingDto;
    tenantIdOrRealm: string;
    payload: ConnectTenantDto.IConnectTenantTradeNameAndSubdomainDto;
  }): Promise<void> {
    const { requestId } = tracking;
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.SetTradeNameAndSubdomain.name,
      requestId
    );
    const input = { payload, tenantIdOrRealm };

    /**
     * Guard against blank subdomain.
     */
    if (
      !payload.subdomain ||
      typeof payload.subdomain !== 'string' ||
      payload.subdomain.trim().length < 1
    ) {
      const message: string = [
        `Subdomain is missing.`,
        `Please provide a subdomain.`,
      ].join(' ');

      const missingSubdomainError = new ErrorUtils.ColossusError(
        message,
        requestId,
        {
          input,
        },
        400,
        SharedEnums.ErrorCodes.BrandingAndSubdomainErrorCodesEnum.SUBDOMAIN_MISSING
      );

      this.#logger.error(
        [
          `${logPrefix} Missing subdomain from payload.`,
          `Input: ${JsonUtils.Stringify(input)}.`,
          `Error details: ${JsonUtils.Stringify(missingSubdomainError)}.`,
        ].join(' ')
      );

      throw missingSubdomainError;
    }

    /**
     * Guard against subdomain with funny characters.
     */
    const regExForSubdomain = /[^a-zA-Z0-9_-]/g;

    if (payload.subdomain.match(regExForSubdomain)) {
      const messageBuilder: string[] = [
        `Subdomain contains invalid characters.`,
        `Please choose a different subdomain.`,
      ];

      const invalidChars = [];

      for (let i = 0; i < payload.subdomain.length; i++) {
        const char = payload.subdomain.charAt(i);

        if (char.match(regExForSubdomain)) {
          if (char.trim().length < 1) {
            invalidChars.push(`' '`);
            continue;
          }

          invalidChars.push(`'${char}'`);
        }
      }

      const uniqueInvalidChars = _.uniq(invalidChars);

      messageBuilder.push(
        `Invalid characters: [${uniqueInvalidChars.join(',')}].`
      );

      const message: string = messageBuilder.join(' ');

      const invalidSubdomainError = new ErrorUtils.ColossusError(
        message,
        requestId,
        {
          input,
        },
        400,
        SharedEnums.ErrorCodes.BrandingAndSubdomainErrorCodesEnum.SUBDOMAIN_INVALID
      );

      this.#logger.error(
        [
          `${logPrefix} Invalid subdomain requested.`,
          `Input: ${JsonUtils.Stringify(input)}.`,
          `Error details: ${JsonUtils.Stringify(invalidSubdomainError)}.`,
        ].join(' ')
      );

      throw invalidSubdomainError;
    }

    const investorClientConfig = this.investorClientConfig.getOrThrow(
      'investorClient',
      { infer: true }
    );
    const { blacklistedSubdomains } = investorClientConfig;

    if (blacklistedSubdomains.includes(payload.subdomain)) {
      const message: string = [
        'Subdomain is not allowed.',
        'Please choose a different subdomain.',
      ].join(' ');
      const blacklistedDomainError = new ErrorUtils.ColossusError(
        message,
        requestId,
        {
          input,
        },
        400,
        SharedEnums.ErrorCodes.BrandingAndSubdomainErrorCodesEnum.FORBIDDEN_SUBDOMAIN
      );

      this.#logger.error(
        [
          `${logPrefix} Blacklisted domain requested.`,
          `Blacklisted domain: ${payload.subdomain}.`,
          `Blacklisted domains: ${blacklistedSubdomains.join(', ')}.`,
          `Input: ${JsonUtils.Stringify(input)}.`,
          `Error details: ${JsonUtils.Stringify(blacklistedDomainError)}.`,
        ].join(' ')
      );

      throw blacklistedDomainError;
    }

    try {
      /**
       * Workaround.
       *
       * We are moving towards using UUIDs for tenant realms, but we still have some legacy code that uses tenant names.
       */
      const tenantId: string =
        await this.tenantService.GetTenantIdFromTenantName(tenantIdOrRealm);

      const branding = await this.tenantBrandingService.GetBranding({
        tenantId,
      });
      await this.tenantBrandingService.SetBranding({
        tenantId,
        ...branding,
        tradeName: payload.tradeName,
        tracking,
        trackPlatformSetupProgress: false,
      });

      const { host } = investorClientConfig;
      const hostname = new URL(`http://${host}`).hostname;
      this.#logger.debug(`Host: ${host}, hostname: ${hostname}`);
      const fullUrl = `${hostname === 'localhost' ? 'http://' : 'https://'}${
        payload.subdomain
      }.${host}`;
      this.#logger.debug(`fullUrl: ${fullUrl}`);
      await this.tenantCentralDb.SetTenantHttpUrl(
        tenantIdOrRealm,
        fullUrl,
        tracking.requesterId
      );
    } catch (error) {
      const errorMessage: string = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(input)}.`,
        `Error: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');

      this.#logger.error(errorMessage);

      throw error;
    }
  }

  /*
   * Note: The current implementation at the time of writing directly uses
   * certain very low-level domains.
   * Hence for example we use the IAM admin service directly to update names on the IAM service,
   * and we directly use DB repositories to update the advisor profile.
   *
   * However the notion of updating an advisor is a business-wide concept,
   * and for this reason it may be preferable to have some low-level service coordination
   * be abstracted into an advisor domain in the @bambu/server-core/domains package.
   * The current technical problem preventing that is the problem of implementing such a service
   * with parameters and response that can be parametrized for different products (Connect, Transact, etc.)
   *
   * Nevertheless, there is still need for logic specific to Connect's advisor domain,
   * most notably logic that allows `UpdateProfile` to have an effect only at a certain point in the
   * advisor's onboarding process, if that is desired.
   */
  async UpdateProfile(
    requestId: string,
    connectAdvisor: Omit<
      ConnectAdvisorDto.IConnectAdvisorProfileInformationDto,
      | 'subscriptions'
      | 'hasActiveSubscription'
      | 'profileBioRichText'
      | 'contactMeReasonsRichText'
      | 'contactLink'
      | 'fullProfileLink'
      | 'advisorProfilePictureUrl'
      | 'platformSetupStatus'
    >
  ): Promise<void> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.UpdateProfile.name,
      requestId
    );
    try {
      const { userId, tenantRealm, firstName, lastName } = connectAdvisor;
      /*
       * At time of writing, the advisor's firstName and lastName are duplicated across the IAM service and the DB.
       * Of course, whereas this has been done pragmatically to make retrieval of the advisor's complete profile easier,
       * we may consider the fields in the IAM and DB to be sources of truth for slightly different purposes.
       *
       * Consider the PII in the IAM to be the source of truth when discussing identifying information that may be used
       * or defined across products, or from third parties (consider for example federation or importing accounts from third-party IAM systems),
       * which may be used to initially populate, non-definitively, the advisor's profile in the DB.
       *
       * Consider the PII in the DB to be the source of truth when discussing information that is specific to Connect, e.g.
       * what is used for billing and regulation of the user's operations on the Connect platform.
       */
      // Precondition: the user must be set up correctly in both the IAM service and the DB, if it is present in either.
      await this.iamAdminService.SetUserPersonalNames(requestId, {
        realmId: tenantRealm,
        userId,
        firstName,
        lastName,
      });

      /**
       * Workaround.
       *
       * We are moving towards using UUIDs for tenant realms, but we still have some legacy code that uses tenant names.
       */
      const clonedData = _.cloneDeep(connectAdvisor);

      if (UuidUtils.isStringUuid(clonedData.tenantRealm)) {
        const tenant = await this.tenantCentralDb.FindTenantById(
          clonedData.tenantRealm
        );

        if (!tenant) {
          // noinspection ExceptionCaughtLocallyJS
          throw new Error(
            `Tenant not found for realm ${clonedData.tenantRealm}`
          );
        }

        clonedData.tenantRealm = tenant.realm;
      }

      await this.connectAdvisorCentralDb.UpsertAdvisor(clonedData);

      const user = await this.iamAdminService.GetRealmUser(tenantRealm, userId);
      if (user && user.email) {
        this.eventEmitter.emitAsync<{
          email: string;
          payload: HubspotUpdateContactPayload;
        }>(HUBSPOT_EVENTS.CONTACT_UPDATE, {
          email: user.email,
          payload: {
            company: clonedData.businessName,
            country: clonedData.countryOfResidence,
            firstname: clonedData.firstName,
            lastname: clonedData.lastName,
            jobtitle: clonedData.jobTitle,
          },
        });
      }

      return;
    } catch (e) {
      this.#logger.error(
        `${logPrefix} Error while updating advisor profile: ${e}`
      );
      throw e;
    }
  }

  async SetProfileBio(
    connectAdvisor: Pick<
      ConnectAdvisorDto.IConnectAdvisorProfileInformationDto,
      'userId' | 'tenantRealm' | 'profileBioRichText' | 'fullProfileLink'
    >,
    tracking: IColossusTrackingDto
  ): Promise<void> {
    const { requestId } = tracking;
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.SetProfileBio.name,
      requestId
    );
    try {
      const { userId, tenantRealm, profileBioRichText, fullProfileLink } =
        connectAdvisor;
      await this.connectAdvisorCentralDb.UpsertAdvisor({
        userId,
        tenantRealm,
        profileBioRichText,
        fullProfileLink,
      });

      await this.#updateSetupStatusForUserContent(
        tracking,
        tenantRealm,
        userId
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while setting advisor profile bio: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  async #updateSetupStatusForUserContent(
    tracking: IColossusTrackingDto,
    tenantRealm: string,
    userId: string
  ): Promise<void> {
    const { requestId, requesterId } = tracking;
    const loggingPrefix = LoggingUtils.generateLogPrefix(
      this.#updateSetupStatusForUserContent.name,
      requestId
    );
    const input = {
      tenantRealm,
    };

    const advisor = await this.connectAdvisorCentralDb.FindAdvisor({
      tenantRealm,
      userId,
    });

    if (!advisor) {
      throw new Error(
        `Advisor not found for tenant realm ${tenantRealm} and user ID ${userId}.`
      );
    }

    try {
      const { profileBio, contactMeReasons, tenantId } = advisor;

      const isProfileBioSet =
        profileBio &&
        typeof profileBio === 'string' &&
        profileBio.trim().length > 0;

      const isContactMeReasonsSet =
        contactMeReasons &&
        typeof contactMeReasons === 'string' &&
        contactMeReasons.trim().length > 0;

      const isAdvisorSetupComplete = isProfileBioSet && isContactMeReasonsSet;

      await this.connectTenantCentralDb.UpdateConnectTenantSetupState(
        requestId,
        tenantId,
        {
          hasUpdatedContent: isAdvisorSetupComplete,
        },
        requesterId
      );
    } catch (error) {
      const message: string = [
        `${loggingPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(input)}.`,
        `Error: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.#logger.error(message);
      throw error;
    }
  }

  async SetContactData(
    connectAdvisor: Pick<
      ConnectAdvisorDto.IConnectAdvisorProfileInformationDto,
      'userId' | 'tenantRealm' | 'contactMeReasonsRichText' | 'contactLink'
    >,
    tracking: IColossusTrackingDto
  ): Promise<void> {
    const { requestId } = tracking;
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.SetContactData.name,
      requestId
    );
    try {
      const { tenantRealm, userId, contactMeReasonsRichText, contactLink } =
        connectAdvisor;

      await this.connectAdvisorCentralDb.UpsertAdvisor({
        userId,
        tenantRealm,
        contactMeReasonsRichText,
        contactLink,
      });

      await this.#updateSetupStatusForUserContent(
        tracking,
        tenantRealm,
        userId
      );
    } catch (e) {
      this.#logger.error(
        `${logPrefix} Error while setting advisor profile bio: ${JsonUtils.Stringify(
          e
        )}`
      );
      throw e;
    }
  }

  async GetProfile({
    userId,
    tenantRealm,
    requestId,
  }: IGetProfileInputDto): Promise<ConnectAdvisorDto.IConnectAdvisorProfileInformationDto> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetProfile.name,
      requestId
    );
    try {
      return await this.connectToolsService.GetAdvisorProfile({
        tenantRealm,
        userId,
        requestId,
      });
    } catch (e) {
      this.#logger.error(
        `${logPrefix} Error while retrieving advisor profile: ${e}`
      );
      throw e;
    }
  }

  async ChangePasswordByEmailOtp(
    {
      username,
      otp,
      newPassword,
    }: ConnectAdvisorDto.IConnectAdvisorResetPasswordRequestDto,
    tracking: IColossusTrackingDto
  ): Promise<boolean> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ChangePasswordByEmailOtp.name,
      tracking.requestId
    );

    try {
      this.#logger.verbose(`${logPrefix} Changing password by email otp.`);
      this.#logger.verbose(`${logPrefix} Username: ${username}.`);

      const tenantName =
        await this.connectToolsService.PredictTenantNameFromAdvisorUsername(
          username
        );

      const tenantId = await this.tenantService.GetTenantIdFromTenantNameSafe(
        tracking.requestId,
        tenantName
      );

      if (!tenantId) {
        const missingTenantError = new ErrorUtils.ColossusError(
          `Tenant does not exist for user (${username}).`,
          tracking.requestId,
          {
            username,
          },
          404,
          SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_NOT_FOUND
        );

        this.#logger.error(
          `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
            missingTenantError
          )}.`
        );

        throw missingTenantError;
      }
      const verified = await this.tenantService.ChangeUserPasswordByEmailOtp({
        tenantName,
        tenantId,
        username,
        otp,
        newPassword,
        tracking,
      });

      this.#logger.debug(
        `${logPrefix} Password change by email otp successful? ${JsonUtils.Stringify(
          {
            verified,
          }
        )}.`
      );

      return verified;
    } catch (e) {
      this.#logger.error(
        `${logPrefix} Error while changing password by email otp: ${e}, ${tracking}`
      );
      throw e;
    }
  }

  async VerifyUserEmailByEmailOtp(
    requestId: string,
    connectVerifyAdvisorEmailDto: ConnectAdvisorDto.IConnectAdvisorAccountInitialEmailVerificationRequestDto
  ): Promise<AuthenticationDto.IAuthenticationLoginResponseDto | boolean> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.VerifyUserEmailByEmailOtp.name,
      requestId
    );

    try {
      const { otp, username, refresh_token } = connectVerifyAdvisorEmailDto;
      const tenantName: string =
        await this.connectToolsService.PredictTenantNameFromAdvisorUsername(
          username
        );

      const tenantId = await this.tenantService.GetTenantIdFromTenantNameSafe(
        requestId,
        tenantName
      );

      if (!tenantId) {
        const missingTenantError = new ErrorUtils.ColossusError(
          `Tenant does not exist for user (${username}).`,
          requestId,
          {
            username,
          },
          404,
          SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_NOT_FOUND
        );

        this.#logger.error(
          `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
            missingTenantError
          )}.`
        );

        throw missingTenantError;
      }
      const verified: boolean =
        await this.tenantService.VerifyUserEmailByEmailOtp({
          requestId,
          tenantId,
          tenantName,
          username,
          otp,
        });
      if (verified && refresh_token) {
        // return await this.authenticationService.Refresh(refresh_token);
        return await this.authenticationService.RefreshJwtToken(
          requestId,
          refresh_token,
          tenantId
        );
      }
      return verified;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while verifying user email: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  // TODO: except for the Connect-specific login, refactor tenant account creation to @bambu/server-core
  public async CreateAdvisorTenantWithInitialUserViaFusionAuth(
    tracking: IColossusTrackingDto,
    dto: ConnectAdvisorDto.IConnectAdvisorCreateRequestDto
  ): Promise<AuthenticationDto.IAuthenticationLoginResponseDto> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.CreateAdvisorTenantWithInitialUserViaFusionAuth.name,
      tracking.requestId
    );
    try {
      const { username, password, enableMarketing } = dto;
      const email = username;

      await this.tenantService.GuardAgainstTenantCreationWithExistingUser(
        tracking.requestId,
        username
      );

      const tenantName: string =
        await this.connectToolsService.PredictTenantNameFromAdvisorUsername(
          username
        );

      const tenantId: string = crypto.randomUUID();
      const transactApplicationId: string = crypto.randomUUID();

      await this.tenantService.CreateTenantViaFusionAuth(
        tracking,
        tenantName,
        tenantId
      );
      const connectApplicationName = `bambu-go-connect-${tenantName}`;

      const {
        iamServiceTenantApplication: iamServiceTenantConnectApplication,
        iamApplicationSingletonGroups: iamConnectApplicationSingletonGroups,
      } =
        await this.tenantService.CreateTenantApplicationForFusionAuthWithDefaultGroups(
          {
            tenantId,
            applicationId: tenantId,
            applicationName: connectApplicationName,
            tracking,
          }
        );
      const iamServiceTenantConnectAdminUserGroups =
        iamConnectApplicationSingletonGroups.filter((x) => {
          const groups = [x.group, ...(x.groups || [])].filter(
            (group) => group
          );
          const adminGroups = groups.filter(
            (group) =>
              group.tenantId === tenantId &&
              group.roles &&
              group.roles[tenantId] &&
              group.roles[tenantId].some(({ name }) =>
                IamDto.DEFAULT_SUPER_USER_ROLES.map(
                  ({ name: suName }) => suName
                ).includes(name)
              )
          );
          return adminGroups.length > 0;
        });

      this.#logger.debug(
        `${logPrefix} Created tenant application for connect.`
      );
      const transactApplicationName = `bambu-go-transact-${tenantName}`;

      this.#logger.debug(
        `${logPrefix} Created tenant application for transact.`
      );
      // Note: for now, we are not saving the transact application ID in the database.
      //   This does not presently pose a problem since we are using a full-access API key
      //     to basically do everything.
      const {
        // iamServiceTenantApplication: _iamServiceTenantTransactApplication,
        iamApplicationSingletonGroups: iamTransactApplicationSingletonGroups,
      } =
        await this.tenantService.CreateTenantApplicationForFusionAuthWithDefaultGroups(
          {
            tenantId,
            applicationId: transactApplicationId,
            applicationName: transactApplicationName,
            tracking,
          }
        );
      const iamServiceTenantTransactAdminUserGroups =
        iamTransactApplicationSingletonGroups.filter((x) => {
          const groups = [x.group, ...(x.groups || [])].filter(
            (group) => group
          );
          const adminGroups = groups.filter(
            (group) =>
              group.tenantId === tenantId &&
              group.roles &&
              group.roles[transactApplicationId] &&
              group.roles[transactApplicationId].some(({ name }) =>
                IamDto.DEFAULT_SUPER_USER_ROLES.map(
                  ({ name: suName }) => suName
                ).includes(name)
              )
          );
          return adminGroups.length > 0;
        });

      const { dbUser } =
        await this.tenantService.CreateInitialTenantUserForFusionAuth({
          userId: crypto.randomUUID(),
          password,
          tenantId,
          applicationId: tenantId,
          groupMemberships: [
            ...iamServiceTenantConnectAdminUserGroups,
            ...iamServiceTenantTransactAdminUserGroups,
          ].map((x) => x.group.id),
          username,
          email,
          applicationPreferredLanguages: ['en'],
          tracking,
        });

      await this.tenantService.SendOtpForInitialVerification({
        tenantId,
        userId: dbUser.id,
        requestId: tracking.requestId,
        email,
        mode: OtpDto.EnumOtpMode.EMAIL,
      });

      await this.riskProfilesCentralDb.InitializeTenantRiskProfiles({
        tenantId: tenantId,
        requestId: tracking.requestId,
      });

      await this.riskProfilesCentralDb.InitializeQuestionnaireData({
        tenantId: tenantId,
        requestId: tracking.requestId,
      });

      await this.connectPortfolioSummaryCentralDb.InitializeTenantPortfolioSummaries(
        {
          tenantRealm: tenantName,
        }
      );

      await this.tenantBrandingService.InitializeBranding({ tenantId });

      await this.tenantCentralDb.InitializeConnectTenant({
        tenantId,
      });

      await this.#seedTenantGoals(tracking.requestId, tenantName);

      await this.#createDefaultPreferencesForAllTenantConnectAdvisors(
        tracking.requestId,
        tenantId
      );

      await this.tenantService.SetupHubSpotForNewTenant({
        dealPipelineParameters: {
          dealName: 'Connect',
        },
        email,
        enableMarketing,
        tracking,
      });

      // return this.authenticationService.Login(tracking.requestId, {
      //   realmId: tenantId,
      //   password,
      //   username: email,
      //   applicationId: iamServiceTenantApplication.application.id,
      // });

      return this.loginWithRetry(tracking.requestId, {
        realmId: tenantId,
        password,
        username: email,
        applicationId: iamServiceTenantConnectApplication.application.id,
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while creating advisor: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }

  /**
   * We are doing this because it seems that FusionAuth does not always fully set up
   * the tenant before we try to log-in.
   * @param requestId
   * @param credentials
   * @param maxRetries
   * @param delay
   * @private
   */
  private async loginWithRetry(
    requestId: string,
    credentials: IAuthenticationLoginRequestDto,
    maxRetries = 8,
    delay = 500
  ): Promise<IAuthenticationLoginResponseDto> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.loginWithRetry.name,
      requestId
    );
    let retries = 0;
    while (retries <= maxRetries) {
      try {
        return await this.authenticationService.Login(requestId, credentials);
      } catch (error) {
        this.#logger.error(
          `${logPrefix} Error while logging in: ${JsonUtils.Stringify(error)}.`
        );

        retries += 1;

        const exponentialBackoff = delay * 2 ** retries;

        this.#logger.log(
          [
            `${logPrefix} Retrying in ${exponentialBackoff}ms.`,
            `Retry ${retries} of ${maxRetries}.`,
          ].join(' ')
        );
        this.#logger.debug(
          `${logPrefix} Payload: ${JsonUtils.Stringify(credentials)}.`
        );

        await new Promise((resolve) => setTimeout(resolve, exponentialBackoff));
      }
    }
    throw new Error('Max retries exceeded.');
  }

  async Create(
    tracking: IColossusTrackingDto,
    {
      username,
      password,
      enableMarketing = false,
    }: ConnectAdvisorDto.IConnectAdvisorCreateRequestDto
  ): Promise<AuthenticationDto.IAuthenticationLoginResponseDto> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.Create.name,
      tracking.requestId
    );

    try {
      const email: string = username;
      const tenantName: string =
        await this.connectToolsService.PredictTenantNameFromAdvisorUsername(
          username
        );
      await this.tenantService.CreateTenantWithInitialUser(
        tracking,
        tenantName,
        {
          username,
          email,
          password,
        },
        enableMarketing
      );
      const tenantId: string =
        await this.tenantService.GetTenantIdFromTenantName(tenantName);
      await this.connectPortfolioSummaryCentralDb.InitializeTenantPortfolioSummaries(
        { tenantRealm: tenantName }
      );
      await this.tenantBrandingService.InitializeBranding({ tenantId });

      await this.tenantCentralDb.InitializeConnectTenant({
        tenantId,
      });

      await this.#seedTenantGoals(tracking.requestId, tenantName);
      await this.#createDefaultPreferencesForAllTenantConnectAdvisors(
        tracking.requestId,
        tenantId
      );

      return await this.authenticationService.Login(tracking.requestId, {
        username,
        password,
        realmId: tenantName,
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while creating advisor: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }

  async #createDefaultPreferencesForAllTenantConnectAdvisors(
    requestId: string,
    tenantId: string,
    batchSize = 10
  ) {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#createDefaultPreferencesForAllTenantConnectAdvisors.name,
      requestId
    );

    this.#logger.debug(
      `${logPrefix} Creating default advisor preferences for tenant (${tenantId}).`
    );

    try {
      const numberOfUsers = await this.userCentralDb.GetCountOfUsersByTenantId(
        tenantId
      );
      this.#logger.debug(`${logPrefix} Number of users: ${numberOfUsers}.`);

      const numberOfPages = Math.ceil(numberOfUsers / batchSize);
      this.#logger.debug(`${logPrefix} Number of pages: ${numberOfPages}.`);

      for (let page = 0; page < numberOfPages; page++) {
        const users = await this.userCentralDb.GetUsersByTenantId(
          tenantId,
          page,
          batchSize
        );
        this.#logger.debug(
          `${logPrefix} Users: ${JsonUtils.Stringify(users)}.`
        );

        const promises = users.map((user) => {
          return this.#createDefaultConnectAdvisorPreferences(requestId, {
            tenantUuid: tenantId,
            userId: user.id,
          });
        });

        await Promise.all(promises);
        this.#logger.debug(
          `${logPrefix} Created default advisor preferences for page ${page}.`
        );
      }
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered: ${JsonUtils.Stringify(error)}.`
      );
      throw error;
    }
  }

  async #createDefaultConnectAdvisorPreferences(
    requestId: string,
    input: {
      tenantUuid: string;
      userId: string;
    }
  ): Promise<void> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#createDefaultConnectAdvisorPreferences.name,
      requestId
    );

    this.#logger.debug(`${logPrefix} Creating default advisor preferences.`);
    this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(input)}`);

    try {
      const { tenantUuid: tenantId, userId } = input;
      const connectTenant =
        await this.connectTenantCentralDb.GetConnectTenantByTenantId(tenantId);
      const { incomeThreshold, retireeSavingsThreshold } = connectTenant;

      const defaultAdvisorPreferences: ConnectAdvisorDto.IConnectAdvisorPreferencesMutableDto =
        {
          tenantId,
          userId,
          minimumAnnualIncomeThreshold: incomeThreshold,
          minimumRetirementSavingsThreshold: retireeSavingsThreshold,
        };

      await this.connectAdvisorPreferencesCentralDb.UpsertConnectAdvisorPreferences(
        requestId,
        defaultAdvisorPreferences
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while creating default advisor preferences: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  async #seedTenantGoals(requestId: string, tenantRealm: string) {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#seedTenantGoals.name,
      requestId
    );

    const inputForLogging = {
      requestId,
      tenantRealm,
    };
    this.#logger.debug(
      `${logPrefix} Input: ${JsonUtils.Stringify(inputForLogging)}.`
    );

    try {
      const goalTemplates = await this.goalTypeCentralDb.GetAll();

      this.#logger.debug(
        `${logPrefix} The goalTemplates: ${JsonUtils.Stringify(goalTemplates)}.`
      );

      const goalTemplateIds = goalTemplates.map((x) => x.id);

      await this.SetGoalTypes({
        requestId: requestId,
        tenantRealm: tenantRealm,
        goalTypeIds: goalTemplateIds,
        trackPlatformSetupProgress: false,
      });
    } catch (error) {
      this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(error)}`);
      throw error;
    }
  }

  public async SendChangePasswordEmailLink(
    {
      email,
    }: ConnectAdvisorDto.IConnectAdvisorSendResetPasswordEmailOtpRequestDto,
    tracking: IColossusTrackingDto
  ): Promise<void> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.SendChangePasswordEmailLink.name,
      tracking.requestId
    );
    const tenantName =
      await this.connectToolsService.PredictTenantNameFromAdvisorUsername(
        email
      );
    const [tenantId, tenantUser] = await Promise.all([
      this.tenantService.GetTenantIdFromTenantNameSafe(
        tracking.requestId,
        tenantName
      ),
      this.tenantService.GetTenantUserByUsernameSafe(
        tracking.requestId,
        tenantName,
        email
      ),
    ]);

    this.#logger.debug(
      `${logPrefix} Tenant Data: ${JsonUtils.Stringify({
        tenantName,
        tenantId,
        tenantUser,
      })}.`
    );

    if (!tenantId) {
      const missingTenantError = new ErrorUtils.ColossusError(
        `Tenant does not exist for email (${email}).`,
        tracking.requestId,
        {
          email,
        },
        404,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_NOT_FOUND
      );

      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          missingTenantError
        )}.`
      );

      throw missingTenantError;
    }

    if (!tenantUser) {
      const missingTenantUserError = new ErrorUtils.ColossusError(
        `Tenant does have user with requested email (${email}).`,
        tracking.requestId,
        {
          email,
        },
        404,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_USER_NOT_FOUND
      );

      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          missingTenantUserError
        )}.`
      );

      throw missingTenantUserError;
    }

    await this.tenantService.SendChangePasswordLink({
      email,
      tenantId,
      mode: OtpDto.EnumOtpMode.EMAIL,
      userId: tenantUser.id,
      tracking,
    });
  }

  public async ResendTenantOtp(
    requestId: string,
    email: string
  ): Promise<void> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.ResendTenantOtp.name,
      requestId
    );
    const tenantName =
      await this.connectToolsService.PredictTenantNameFromAdvisorUsername(
        email
      );
    const [tenantId, tenantUser] = await Promise.all([
      this.tenantService.GetTenantIdFromTenantNameSafe(requestId, tenantName),
      this.tenantService.GetTenantUserByUsernameSafe(
        requestId,
        tenantName,
        email
      ),
    ]);

    this.#logger.debug(
      `${logPrefix} Tenant Data: ${JsonUtils.Stringify({
        tenantName,
        tenantId,
        tenantUser,
      })}.`
    );

    if (!tenantId) {
      const missingTenantError = new ErrorUtils.ColossusError(
        `Tenant does not exist for email (${email}).`,
        requestId,
        {
          email,
        },
        404,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_NOT_FOUND
      );

      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          missingTenantError
        )}.`
      );

      throw missingTenantError;
    }

    if (!tenantUser) {
      const missingTenantUserError = new ErrorUtils.ColossusError(
        `Tenant does have user with requested email (${email}).`,
        requestId,
        {
          email,
        },
        404,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_USER_NOT_FOUND
      );

      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          missingTenantUserError
        )}.`
      );

      throw missingTenantUserError;
    }

    if (tenantUser.emailVerified) {
      const emailIsVerifiedError = new ErrorUtils.ColossusError(
        `The email (${email}) already has been OTP verified.`,
        requestId,
        {
          email,
        },
        409,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_USER_OTP_ALREADY_VERIFIED
      );

      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          emailIsVerifiedError
        )}.`
      );

      throw emailIsVerifiedError;
    }

    await this.tenantService.SendOtpForInitialVerification({
      email,
      tenantId,
      userId: tenantUser.id,
      requestId,
    });
  }

  async Login(
    requestId: string,
    { username, password }: ConnectAdvisorDto.IConnectAdvisorLoginRequestDto
  ): Promise<AuthenticationDto.IAuthenticationLoginResponseDto> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.Login.name,
      requestId
    );
    try {
      /**
       * TODO:
       *
       * Once we move off KeyCloak, realmId will be optional and no longer needed.
       *
       * We will query the FusionAuth IAM for the tenantId based on username and use that instead.
       */
      const realmId =
        await this.connectToolsService.PredictTenantNameFromAdvisorUsername(
          username
        );

      const loginResponse = await this.authenticationService.Login(requestId, {
        username,
        password,
        realmId,
      });

      const { access_token: accessToken } = loginResponse;

      this.ensureUserIsAdvisor(accessToken, requestId);

      this.#ensureUserOtpVerified(accessToken, requestId);

      return loginResponse;
    } catch (e) {
      this.#logger.error(`${logPrefix} Error while logging in advisor: ${e}`);
      throw e;
    }
  }

  private ensureUserIsAdvisor(accessToken: string, requestId: string) {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.ensureUserIsAdvisor.name,
      requestId
    );

    const claimsFromToken = JoseUtils.parseArbitraryJWT(accessToken);
    const roles: string[] = claimsFromToken.roles as string[];

    if (!roles.includes('Advisor')) {
      const invalidUserRoleError = new ErrorUtils.ColossusError(
        `Invalid user role`,
        requestId,
        {
          claimsFromToken,
        },
        401,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.INVALID_USER_ROLE
      );

      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          invalidUserRoleError
        )}.`
      );

      throw invalidUserRoleError;
    }
  }

  #ensureUserOtpVerified(accessToken: string, requestId: string) {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#ensureUserOtpVerified.name,
      requestId
    );

    const claimsFromToken = JoseUtils.parseArbitraryJWT(accessToken);

    if (claimsFromToken.email_verified === false) {
      const emailNotVerifiedError = new ErrorUtils.ColossusError(
        `The user's email has not been verified.`,
        requestId,
        {
          claimsFromToken,
        },
        409,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.OTP_REQUIRED
      );

      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          emailNotVerifiedError
        )}.`
      );

      throw emailNotVerifiedError;
    }
  }

  public async SetGoalTypes(input: ISetGoalTypesInput): Promise<void> {
    const {
      requestId,
      tenantRealm,
      goalTypeIds,
      userIdForLogging,
      trackPlatformSetupProgress,
    } = input;

    const logPrefix = LoggingUtils.generateLogPrefix(
      this.SetGoalTypes.name,
      requestId
    );
    const inputForLogging = {
      userId: userIdForLogging,
      tenantRealm,
      goalTypeIds,
    };
    this.#logger.debug(
      `${logPrefix} Inputs: ${JsonUtils.Stringify(inputForLogging)}.`
    );

    try {
      if (!tenantRealm) {
        // noinspection ExceptionCaughtLocallyJS
        throw ErrorUtils.getDefaultMissingClaimsError(requestId, {
          goalTypeIds,
        });
      }

      /**
       * Workaround.
       *
       * We are moving towards using UUIDs for tenant realms, but we still have some legacy code that uses tenant names.
       */
      let realmName: string = tenantRealm;

      if (UuidUtils.isStringUuid(realmName)) {
        const tenant = await this.tenantCentralDb.FindTenantById(realmName);

        if (!tenant) {
          // noinspection ExceptionCaughtLocallyJS
          throw ErrorUtils.getDefaultMissingTenantInDbError({ requestId });
        }

        realmName = tenant.realm;
      }

      await this.connectTenantGoalTypeCentralDb.SetTenantGoalTypes(
        realmName,
        goalTypeIds,
        userIdForLogging
      );

      if (!trackPlatformSetupProgress) {
        return;
      }

      let tenantId: string = tenantRealm;

      if (!UuidUtils.isStringUuid(realmName)) {
        const tenant = await this.tenantCentralDb.FindTenantByRealm(realmName);

        tenantId = tenant.id;
      }

      await this.connectTenantCentralDb.UpdateConnectTenantSetupState(
        requestId,
        tenantId,
        {
          hasUpdatedGoals: true,
        },
        requestId
      );
    } catch (error) {
      const errorMessage: string = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(inputForLogging)}.`,
        `Details: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }

  public async FlushInvestorPortalCachedHtml(
    requestId: string,
    tenantRealm: string
  ): Promise<void> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.FlushInvestorPortalCachedHtml.name,
      requestId
    );
    this.#logger.log(
      `${logPrefix} Flushing HTML cache for investor portal for tenant (${tenantRealm}).`
    );

    /**
     * Workaround.
     *
     * We are moving towards using UUIDs for tenant realms, but we still have some legacy code that uses tenant names.
     */
    let tenant:
      | (PrismaModel.Tenant & {
          apiKeys: PrismaModel.TenantApiKey[];
          httpUrls: PrismaModel.TenantHttpUrl[] | null;
          branding: PrismaModel.TenantBranding | null;
          connectAdvisors: PrismaModel.ConnectAdvisor[];
          tenantSubscriptions: PrismaModel.TenantSubscription[];
        })
      | null;
    if (UuidUtils.isStringUuid(tenantRealm)) {
      tenant = await this.tenantCentralDb.FindTenantById(tenantRealm);
    } else {
      tenant = await this.tenantCentralDb.FindTenantByRealm(tenantRealm);
    }

    if (!tenant) {
      const missingTenantError = ErrorUtils.getDefaultMissingTenantInDbError({
        requestId,
        metadata: {
          tenantRealm,
        },
      });
      this.#logger.error(
        `${logPrefix} ${JsonUtils.Stringify(missingTenantError)}`
      );
      throw missingTenantError;
    }
    const httpUrls = tenant.httpUrls;
    if (httpUrls.length < 1) {
      this.#logger.log(
        `${logPrefix} No Urls mapped to tenant (${tenantRealm}).`
      );
      return;
    }
    await Promise.all(
      httpUrls.map((x) => {
        const { url } = x;
        return this.cacheManagerRepository.DeleteInvestorProxyHtmlCache(
          requestId,
          url
        );
      })
    );
  }

  public async GetTenantTopLevelOptions(
    tracking: IColossusTrackingDto,
    tenantId: string
  ): Promise<ConnectTenantDto.IConnectTenantSetTopLevelOptionsRequestDto> {
    const { requestId, requesterId } = tracking;
    const loggingPrefix = LoggingUtils.generateLogPrefix(
      this.GetTenantTopLevelOptions.name,
      requestId
    );
    const inputForLogging = {
      tenantId,
      requesterId,
    };
    this.#logger.debug(
      [
        `${loggingPrefix} Inputs: ${JsonUtils.Stringify(inputForLogging)}.`,
      ].join(' ')
    );

    try {
      const updatedValue =
        await this.connectTenantCentralDb.GetConnectTenantTopLevelSettings({
          tenantId,
          requestId,
        });
      const returnPayload: ConnectTenantDto.IConnectTenantSetTopLevelOptionsRequestDto =
        {
          incomeThreshold: updatedValue.incomeThreshold,
          contactLink: updatedValue.contactLink,
          retireeSavingsThreshold: updatedValue.retireeSavingsThreshold,
        };
      this.#logger.debug(
        [
          `${loggingPrefix} Acquired db value(s): ${JsonUtils.Stringify(
            updatedValue
          )}.`,
          `${loggingPrefix} Returning: ${JsonUtils.Stringify(returnPayload)}.`,
        ].join(' ')
      );
      return returnPayload;
    } catch (error) {
      const message: string = [
        `${loggingPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(inputForLogging)}.`,
        `Details: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.#logger.error(message);
      throw error;
    }
  }

  public async SetTenantTopLevelOptions({
    tracking,
    tenantId,
    payload,
  }: {
    tracking: IColossusTrackingDto;
    tenantId: string;
    payload: ConnectTenantDto.IConnectTenantSetTopLevelOptionsRequestDto;
  }): Promise<ConnectTenantDto.IConnectTenantSetTopLevelOptionsRequestDto> {
    const { requestId, requesterId } = tracking;
    const loggingPrefix = LoggingUtils.generateLogPrefix(
      this.SetTenantTopLevelOptions.name,
      requestId
    );
    const inputForLogging = {
      tenantId,
      payload,
      requesterId,
    };
    this.#logger.debug(
      [
        `${loggingPrefix} Inputs: ${JsonUtils.Stringify(inputForLogging)}.`,
      ].join(' ')
    );

    try {
      const { incomeThreshold, retireeSavingsThreshold, contactLink } = payload;
      const updatedValue =
        await this.connectTenantCentralDb.UpdateConnectTenantTopLevelSettings({
          tenantId,
          updatedBy: requesterId,
          requestId,
          incomeThreshold,
          contactLink,
          retireeSavingsThreshold,
        });

      await this.connectTenantCentralDb.UpdateConnectTenantSetupState(
        requestId,
        tenantId,
        {
          hasUpdatedLeadSettings: true,
        },
        requesterId
      );

      const returnPayload: ConnectTenantDto.IConnectTenantSetTopLevelOptionsRequestDto =
        {
          incomeThreshold: updatedValue.incomeThreshold,
          contactLink: updatedValue.contactLink,
          retireeSavingsThreshold: updatedValue.retireeSavingsThreshold,
        };
      this.#logger.debug(
        [
          `${loggingPrefix} Updated db value(s): ${JsonUtils.Stringify(
            updatedValue
          )}.`,
          `${loggingPrefix} Returning: ${JsonUtils.Stringify(returnPayload)}.`,
        ].join(' ')
      );
      return returnPayload;
    } catch (error) {
      const message: string = [
        `${loggingPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(inputForLogging)}.`,
        `Details: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.#logger.error(message);
      throw error;
    }
  }

  public async SetConnectPortfolioSummary(input: {
    tracking: IColossusTrackingDto;
    tenantRealm: string;
    connectPortfolioSummaryDto: Omit<
      ConnectPortfolioSummaryDto.IConnectPortfolioSummaryDto,
      'reviewed'
    >;
  }): Promise<void> {
    const { requestId, requesterId } = input.tracking;
    const loggingPrefix = LoggingUtils.generateLogPrefix(
      this.SetConnectPortfolioSummary.name,
      requestId
    );
    this.#logger.debug(
      `${loggingPrefix} Inputs: ${JsonUtils.Stringify(input)}.`
    );
    try {
      const { tenantRealm, connectPortfolioSummaryDto } = input;
      await this.connectPortfolioSummaryCentralDb.SetConnectPortfolioSummary({
        tenantRealm,
        requestId,
        connectPortfolioSummaryDto,
        requesterId,
      });
      const latestSummaries =
        await this.connectPortfolioSummaryCentralDb.GetConnectPortfolioSummaries(
          {
            tenantRealm,
            requestId,
          }
        );
      // const pendingReviewCount = latestSummaries.filter(
      //   (x) => x.reviewed === false
      // ).length;
      const reviewedCount = latestSummaries.filter(
        (x) => x.reviewed === true
      ).length;
      /**
       * Workaround.
       *
       * We are moving towards using UUIDs for tenant realms, but we still have some legacy code that uses tenant names.
       */
      let tenantId = tenantRealm;
      if (!UuidUtils.isStringUuid(tenantRealm)) {
        const tenant = await this.tenantCentralDb.FindTenantByRealm(
          tenantRealm
        );
        tenantId = tenant.id;
      }
      await this.connectTenantCentralDb.UpdateConnectTenantSetupState(
        requestId,
        tenantId,
        {
          // hasUpdatedPortfolios: pendingReviewCount === 0,
          hasUpdatedPortfolios: reviewedCount > 0,
        },
        requesterId
      );
    } catch (error) {
      const message: string = [
        `${loggingPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(input)}.`,
        `Details: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.#logger.error(message);
      throw error;
    }
  }

  public async GetConnectAdvisorPreferences(
    requestId: string,
    userId: string,
    tenantId: string
  ): Promise<ConnectAdvisorDto.IConnectAdvisorPreferencesDto | null> {
    const loggingPrefix = LoggingUtils.generateLogPrefix(
      this.GetConnectAdvisorPreferences.name,
      requestId
    );
    this.#logger.debug(
      `${loggingPrefix} Inputs: ${JsonUtils.Stringify({
        userId,
        tenantId,
      })}`
    );
    try {
      const preferences =
        await this.connectAdvisorPreferencesCentralDb.GetConnectAdvisorPreferences(
          requestId,
          userId,
          tenantId
        );

      if (preferences) {
        this.#logger.debug(
          `${loggingPrefix} Returning: ${JsonUtils.Stringify(preferences)}.`
        );
        return preferences;
      }

      this.#logger.verbose(
        `${loggingPrefix} No preferences found for user (${userId}), creating default preferences.`
      );

      return null;
    } catch (error) {
      const message: string = [
        `${loggingPrefix} Error encountered.`,
        `Details: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.#logger.error(message);
      throw error;
    }
  }

  public async UpdateConnectAdvisorPreferences(
    requestId: string,
    input: ConnectAdvisorDto.IConnectAdvisorPreferencesMutableDto
  ): Promise<ConnectAdvisorDto.IConnectAdvisorPreferencesDto> {
    const loggingPrefix = LoggingUtils.generateLogPrefix(
      this.UpdateConnectAdvisorPreferences.name,
      requestId
    );
    this.#logger.debug(
      `${loggingPrefix} Inputs: ${JsonUtils.Stringify(input)}`
    );
    this.#guardConnectAdvisorPreferencesPayload(requestId, input);
    try {
      const dbResult =
        await this.connectAdvisorPreferencesCentralDb.UpsertConnectAdvisorPreferences(
          requestId,
          {
            ...input,
            createdBy: input.userId,
            updatedBy: input.userId,
          }
        );
      this.#logger.debug(
        `${loggingPrefix} Returning: ${JsonUtils.Stringify(dbResult)}.`
      );
      return dbResult;
    } catch (error) {
      this.#logger.error(
        `${loggingPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }

  #guardConnectAdvisorPreferencesPayload(
    requestId: string,
    input: ConnectAdvisorDto.IConnectAdvisorPreferencesMutableDto
  ) {
    const { minimumRetirementSavingsThreshold, minimumAnnualIncomeThreshold } =
      input;

    if (minimumRetirementSavingsThreshold < 0) {
      throw new ErrorUtils.ColossusError(
        `Minimum retirement savings threshold must be greater than or equal to 0.`,
        requestId,
        { input },
        400,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.MALFORMED_REQUEST
      );
    }

    if (minimumAnnualIncomeThreshold < 0) {
      throw new ErrorUtils.ColossusError(
        `Minimum annual income threshold must be greater than or equal to 0.`,
        requestId,
        { input },
        400,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.MALFORMED_REQUEST
      );
    }
  }

  public async GetConnectLeads(
    requestId: string,
    input: ConnectLeadsDto.IConnectAdvisorLeadsRequestDto
  ): Promise<ConnectLeadsDto.IConnectLeadsDto> {
    const loggingPrefix = LoggingUtils.generateLogPrefix(
      this.GetConnectLeads.name,
      requestId
    );
    this.#logger.debug(
      `${loggingPrefix} Inputs: ${JsonUtils.Stringify(input)}.`
    );

    try {
      const { tenantId, userId } = input;
      await Promise.all([
        this.#ensureTenantExists(requestId, tenantId),
        this.#ensureTenantUserExists(requestId, tenantId, userId),
      ]);

      /**
       * 2023-08-15
       * Currently, not in use as user level settings are now dormant until we have more clarity on the future of the Connect Advisor and Transact products.
       */
      // const preferences = await this.#ensureConnectAdvisorPreferencesExists(
      //   requestId,
      //   tenantId,
      //   userId
      // );
      //
      // const {
      //   minimumRetirementSavingsThreshold,
      //   minimumAnnualIncomeThreshold,
      // } = preferences;

      const [minimumRetirementSavingsThreshold, minimumAnnualIncomeThreshold] =
        await this.getLeadQualificationThresholds(requestId, tenantId);

      const leads = await this.leadsCentralDb.GetLeadsByTenantIdPaginated(
        requestId,
        {
          ...input,
          minimumSavings: minimumRetirementSavingsThreshold,
          minimumIncome: minimumAnnualIncomeThreshold,
        }
      );

      this.#logger.debug(
        `${loggingPrefix} Returning: ${JsonUtils.Stringify(leads)}`
      );
      return leads;
    } catch (error) {
      this.#logger.error(
        `${loggingPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }

  async #ensureTenantExists(requestId: string, tenantId: string) {
    const tenant = await this.tenantService.GetTenantFromTenantNameSafe(
      requestId,
      tenantId
    );

    if (!tenant) {
      // noinspection ExceptionCaughtLocallyJS
      throw ErrorUtils.getDefaultMissingTenantInDbErrorWithTenantId({
        tenantId,
        requestId,
      });
    }

    return tenant;
  }

  async #ensureTenantUserExists(
    requestId: string,
    tenantId: string,
    userId: string
  ) {
    const tenantUser = await this.userCentralDb.GetUserByUserId(userId);

    if (!tenantUser) {
      // noinspection ExceptionCaughtLocallyJS
      throw new ErrorUtils.ColossusError(
        `User not found.`,
        requestId,
        {
          userId,
          tenantId,
        },
        404,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_USER_NOT_FOUND
      );
    }

    if (tenantUser.tenantId !== tenantId) {
      // noinspection ExceptionCaughtLocallyJS
      throw new ErrorUtils.ColossusError(
        `User and tenant mapping invalid.`,
        requestId,
        {
          userId,
          tenantId,
        },
        404,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.UNHANDLED
      );
    }

    return tenantUser;
  }

  // /**
  //  * Gets the preferences for the given user/advisor.
  //  *
  //  * 2023-08-15
  //  * Currently, not in use as user level settings are now dormant until we have more clarity on the future of the Connect Advisor and Transact products.
  //  * @param requestId
  //  * @param tenantId
  //  * @param userId
  //  * @private
  //  */
  // async #ensureConnectAdvisorPreferencesExists(
  //   requestId: string,
  //   tenantId: string,
  //   userId: string
  // ): Promise<ConnectAdvisorDto.IConnectAdvisorPreferencesDto | null> {
  //   const preferences: Promise<ConnectAdvisorDto.IConnectAdvisorPreferencesDto | null> =
  //     this.GetConnectAdvisorPreferences(requestId, userId, tenantId);
  //
  //   if (!preferences) {
  //     throw new ErrorUtils.ColossusError(`Preferences not found.`, requestId, {
  //       requestId,
  //       tenantId,
  //     });
  //   }
  //
  //   return preferences;
  // }

  private async getLeadQualificationThresholds(
    requestId: string,
    tenantId: string
  ): Promise<readonly [number, number]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.getLeadQualificationThresholds.name,
      requestId
    );

    const connectTenant =
      await this.connectTenantCentralDb.GetConnectTenantByTenantId(tenantId);

    if (!connectTenant) {
      throw new ErrorUtils.ColossusError(
        `Connect tenant not found for top level settings.`,
        requestId,
        {
          tenantId,
        },
        500,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_NOT_FOUND
      );
    }

    const minimumRetirementSavingsThreshold =
      connectTenant?.retireeSavingsThreshold ?? 0;
    const minimumAnnualIncomeThreshold = connectTenant?.incomeThreshold ?? 0;

    const responseTuple: readonly [number, number] = [
      minimumRetirementSavingsThreshold,
      minimumAnnualIncomeThreshold,
    ];

    this.#logger.debug(
      `${logPrefix} Returning: ${JSON.stringify(
        responseTuple
      )} for tenant ${tenantId}.`
    );

    return responseTuple;
  }

  public async GetLeadById(
    requestId: string,
    input: IAdvisorServiceGetLeadByIdParamDto
  ): Promise<ConnectLeadsDto.IConnectLeadsAdvisorDto> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetLeadById.name,
      requestId
    );

    this.#logger.debug(`${logPrefix} Inputs: ${JsonUtils.Stringify(input)}.`);

    try {
      const { id, tenantId } = input;
      await this.#ensureTenantExists(requestId, tenantId);

      const lead = await this.#getLeadById(requestId, id, tenantId);

      this.#logger.debug(
        `${logPrefix} Returning: ${JsonUtils.Stringify(lead)}.`
      );

      return lead;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }

  async #getLeadById(
    requestId: string,
    id: string,
    tenantId: string
  ): Promise<ConnectLeadsDto.IConnectLeadsAdvisorDto> {
    const lead = await this.leadsCentralDb.GetLeadById(requestId, {
      tenantId,
      id,
    });

    this.guardAgainstLeadObjectNull(requestId, id, tenantId, lead);

    return lead;
  }

  private guardAgainstLeadObjectNull(
    requestId: string,
    id: string,
    tenantId: string,
    lead: unknown
  ): void {
    if (!lead) {
      throw new ErrorUtils.ColossusError(
        `Lead not found.`,
        requestId,
        {
          id,
          tenantId,
        },
        404,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.UNHANDLED
      );
    }
  }

  public async UpdateLeadById(
    requestId: string,
    input: ConnectLeadsDto.IConnectLeadsAdvisorUpdateDto
  ): Promise<ConnectLeadsDto.IConnectLeadsAdvisorDto> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.UpdateLeadById.name,
      requestId
    );

    this.#logger.debug(`${logPrefix} Inputs: ${JsonUtils.Stringify(input)}.`);

    try {
      const { id, tenantId, timeStamp } = input;

      const [lead] = await Promise.all([
        await this.#getLeadById(requestId, id, tenantId),
        await this.#ensureTenantExists(requestId, tenantId),
      ]);

      this.#guardAgainstOlderUpdatesToLead(requestId, {
        payloadTimeStamp: timeStamp,
        dbResultTimeStamp: lead.updatedAt as Date,
        id,
      });

      this.#logger.debug(
        `${logPrefix} Existing lead found: ${JsonUtils.Stringify(lead)}.`
      );

      const { status, userId } = input;

      const result = await this.leadsCentralDb.UpdateLeadById(
        requestId,
        id,
        userId,
        tenantId,
        {
          status,
        }
      );

      this.#logger.debug(
        `${logPrefix} Returning: ${JsonUtils.Stringify(result)}.`
      );
      return result;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }

  #guardAgainstOlderUpdatesToLead(
    requestId: string,
    {
      id,
      payloadTimeStamp,
      dbResultTimeStamp,
    }: { id: string; payloadTimeStamp: Date; dbResultTimeStamp: Date }
  ) {
    const submittedTimeStamp = Luxon.DateTime.fromJSDate(payloadTimeStamp);
    const submittedUnixEpoch = submittedTimeStamp.toUnixInteger();

    const dbTimeStamp = Luxon.DateTime.fromJSDate(dbResultTimeStamp as Date);
    const dbUnixEpoch = dbTimeStamp.toUnixInteger();

    if (dbUnixEpoch > submittedUnixEpoch) {
      throw new ErrorUtils.ColossusError(
        `Db entry is newer than submitted entry.`,
        requestId,
        {
          id,
          submittedUnixEpoch,
          dbUnixEpoch,
        },
        409,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.UNHANDLED
      );
    }
  }

  public async GetLeadSummaryById(
    requestId: string,
    input: IAdvisorServiceGetLeadByIdParamDto
  ): Promise<IGenericDataSummaryDto[]> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetLeadSummaryById.name,
      requestId
    );

    this.#logger.debug(`${logPrefix} Inputs: ${JsonUtils.Stringify(input)}.`);

    try {
      const lead = await this.leadsCentralDb.GetLeadByIdForSummary(requestId, {
        ...input,
      });

      const { tenantId, id } = input;

      this.guardAgainstLeadObjectNull(requestId, id, tenantId, lead);

      const numberParsingRules = plainToInstance(
        GenerateValueForSummaryObjectNumberRulesParamsDto,
        {
          roundOffNumbers: true,
          decimalPlaces: 0,
        } as IGenerateValueForSummaryObjectNumberRulesParamsDto
      );

      const responsePayload: IGenericDataSummaryDto[] = [
        {
          displayName: 'User Details',
          key: 'USER_DETAILS',
          fields: [
            {
              displayName: 'Name',
              key: 'NAME',
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              value: await this.generateValueForSummaryObject({
                value: lead.name,
              }),
            },
            {
              displayName: 'Status',
              key: 'STATUS',
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              value: await this.generateValueForSummaryObject({
                value: lead.status,
              }),
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
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              format: SharedEnums.EnumGenericDataSummaryFieldFormat.EMAIL,
              value: await this.generateValueForSummaryObject({
                value: lead?.email,
              }),
            },
            {
              displayName: 'Phone Number',
              key: 'PHONE_NUMBER',
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              format: SharedEnums.EnumGenericDataSummaryFieldFormat.PHONE,
              value: await this.generateValueForSummaryObject({
                value: lead?.phoneNumber,
              }),
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
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              value: await this.generateValueForSummaryObject({
                value: lead?.zipCode,
              }),
            },
            {
              displayName: 'Age',
              key: 'AGE',
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              value: await this.generateValueForSummaryObject({
                value: lead?.age,
              }),
            },
            {
              displayName: lead.isRetired
                ? 'Retirement Savings'
                : 'Annual Income',
              key: lead.isRetired ? 'RETIREMENT_SAVINGS' : 'ANNUAL_INCOME',
              type: SharedEnums.EnumGenericDataSummaryFieldType.CURRENCY,
              value: await this.generateValueForSummaryObject({
                value: lead.isRetired
                  ? lead?.currentSavings
                  : lead?.incomePerAnnum,
                numberRules: numberParsingRules,
              }),
            },
            {
              displayName: 'Monthly Savings',
              key: 'MONTHLY_SAVINGS',
              type: SharedEnums.EnumGenericDataSummaryFieldType.CURRENCY,
              value: await this.generateValueForSummaryObject({
                value: lead?.monthlySavings,
                numberRules: numberParsingRules,
              }),
            },
            {
              displayName: 'Investment Style',
              key: 'INVESTMENT_STYLE',
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              value: await this.generateValueForSummaryObject({
                value: _.startCase(
                  _.toLower(lead?.ConnectPortfolioSummary?.key)
                ),
              }),
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
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              value: await this.generateValueForSummaryObject({
                value: lead?.goalName,
              }),
            },
            {
              displayName: 'Timeframe (Years)',
              key: 'TARGET_YEAR',
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              value: await this.generateValueForSummaryObject({
                value: lead?.goalTimeframe,
              }),
            },
            {
              displayName: 'Target Goal',
              key: 'TARGET_GOAL',
              type: SharedEnums.EnumGenericDataSummaryFieldType.CURRENCY,
              value: await this.generateValueForSummaryObject({
                value: lead.goalValue,
                numberRules: numberParsingRules,
              }),
            },
            {
              displayName: 'Suggested Monthly Contribution',
              key: 'SUGGESTED_MONTHLY_CONTRIBUTION',
              type: SharedEnums.EnumGenericDataSummaryFieldType.CURRENCY,
              value: await this.generateValueForSummaryObject({
                value: lead?.monthlyContribution,
                numberRules: numberParsingRules,
              }),
            },
            {
              displayName: 'Recommended Portfolio',
              key: 'RECOMMENDED_PORTFOLIO',
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              value: await this.generateValueForSummaryObject({
                value: lead?.ConnectPortfolioSummary?.name,
              }),
            },
          ],
        },
      ];

      this.#logger.debug(
        `${logPrefix} Returning: ${JsonUtils.Stringify(responsePayload)}.`
      );
      return responsePayload;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }

  private async generateValueForSummaryObject(
    input: IGenerateValueForSummaryObjectParamsDto
  ): Promise<string> {
    const transformed = plainToInstance(
      GenerateValueForSummaryObjectParamsDto,
      input
    );
    await validateOrReject(transformed);
    const { value, numberRules, emptyValuePlaceholder } = transformed;

    const { roundOffNumbers, decimalPlaces } = numberRules;

    // noinspection PointlessBooleanExpressionJS
    if (value === undefined || value === null) {
      return emptyValuePlaceholder;
    }

    if (typeof value === 'number' && roundOffNumbers) {
      return value.toFixed(decimalPlaces);
    }

    return String(value);
  }

  public async GetConnectInvestorLeads(
    requestId: string,
    input: ConnectLeadsDto.IConnectAdvisorLeadsRequestDto
  ): Promise<ConnectLeadsDto.IConnectLeadsDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetConnectInvestorLeads.name,
      requestId
    );
    this.#logger.debug(`${logPrefix} Inputs: ${JsonUtils.Stringify(input)}.`);

    try {
      const { tenantId, userId } = input;
      await Promise.all([
        this.#ensureTenantExists(requestId, tenantId),
        this.#ensureTenantUserExists(requestId, tenantId, userId),
      ]);

      const [minimumRetirementSavingsThreshold, minimumAnnualIncomeThreshold] =
        await this.getLeadQualificationThresholds(requestId, tenantId);

      const result = await this.investorCentralDb.GetInvestorLeadsPaged(
        requestId,
        {
          ...input,
          tenantId,
          userId,
          minimumIncome: minimumAnnualIncomeThreshold,
          minimumSavings: minimumRetirementSavingsThreshold,
        }
      );

      const data: ConnectLeadsDto.IConnectLeadsAdvisorDto[] = [];

      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        data.push(...this.mapInvestorLeadsToConnectLeads(result.data));
      }

      return {
        ...result,
        data,
      };
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }

  private mapInvestorLeadsToConnectLeads(
    dbRows: IGetInvestorLeadsPagedResponseDataDto[]
  ): ConnectLeadsDto.IConnectLeadsAdvisorDto[] {
    return dbRows.map((x) => this.mapInvestorLeadToConnectLead(x));
  }

  private mapInvestorLeadToConnectLead(
    x: IGetInvestorLeadsPagedResponseDataDto
  ): ConnectLeadsDto.IConnectLeadsAdvisorDto {
    const goal = x?.Goals[0];
    const projectedReturns = goal?.data
      ?.projectedReturns as ConnectLeadsDto.IConnectLeadsProjectedReturnsDto;
    const rsp = goal?.GoalRecurringDepositPlans[0];

    return {
      tenantId: x.tenantId,
      email: x.email,
      age: x.age,
      name: x.name,
      id: x.id,
      updatedBy: x.updatedBy,
      updatedAt: x.updatedAt,
      projectedReturns,
      monthlyContribution: rsp?.amount,
      riskAppetite: goal?.connectPortfolioSummaryId,
      computedRiskProfile: goal?.computedRiskProfile,
      sendAppointmentEmail: goal?.sendLeadAppointmentEmail,
      initialInvestment: goal?.initialInvestment,
      sendGoalProjectionEmail: goal?.sendLeadGoalProjectionEmail,
      goalValue: goal?.goalValue,
      goalTimeframe: goal?.goalTimeframe,
      incomePerAnnum: x.incomePerAnnum,
      currentSavings: x.currentSavings,
      isRetired: x.isRetired,
      monthlySavings: x.monthlySavings,
      recommendedMonthlyContribution: goal?.recommendedMonthlyContribution,
      status: x.leadReviewStatus as SharedEnums.LeadsEnums.EnumLeadStatus,
      goalDescription: goal?.goalDescription,
      goalName: goal?.goalName,
      zipCode: x.zipCode,
      createdAt: x.createdAt,
      phoneNumber: x.phoneNumber,
      createdBy: x.createdBy,
      notes: '-',
    };
  }

  public async GetConnectInvestorLeadById(
    requestId: string,
    input: IAdvisorServiceGetLeadByIdParamDto
  ): Promise<ConnectLeadsDto.IConnectLeadsAdvisorDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetConnectInvestorLeadById.name,
      requestId
    );
    this.#logger.debug(`${logPrefix} Inputs: ${JsonUtils.Stringify(input)}.`);
    try {
      const { id, tenantId } = input;
      await this.#ensureTenantExists(requestId, tenantId);
      const dbRow = await this.investorCentralDb.GetInvestorLeadById(
        requestId,
        id
      );

      if (!dbRow) {
        // noinspection ExceptionCaughtLocallyJS
        throw new ErrorUtils.ColossusError(
          'Lead not found.',
          requestId,
          input,
          404
        );
      }

      return this.mapInvestorLeadToConnectLead(dbRow);
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(input)}.`,
        `Details: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }

  public async UpdateLeadInvestorReviewStatusByInvestorId(
    requestId: string,
    input: ConnectLeadsDto.IConnectLeadsAdvisorUpdateDto
  ): Promise<ConnectLeadsDto.IConnectLeadsAdvisorDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateLeadInvestorReviewStatusByInvestorId.name,
      requestId
    );
    this.#logger.debug(`${logPrefix} Inputs: ${JsonUtils.Stringify(input)}.`);
    try {
      const { id, tenantId, timeStamp } = input;
      const [lead] = await Promise.all([
        this.GetConnectInvestorLeadById(requestId, {
          id,
          tenantId,
        }),
        await this.#ensureTenantExists(requestId, tenantId),
      ]);
      this.#guardAgainstOlderUpdatesToLead(requestId, {
        id,
        payloadTimeStamp: timeStamp,
        dbResultTimeStamp: lead.updatedAt as Date,
      });
      this.#logger.debug(
        `${logPrefix} Existing lead found: ${JsonUtils.Stringify(lead)}.`
      );
      const { status, userId } = input;
      await this.investorCentralDb.UpdateLeadInvestorReviewStatusByInvestorId(
        requestId,
        {
          status,
          updatedBy: userId,
          id,
          tenantId,
        }
      );
      const result = this.GetConnectInvestorLeadById(requestId, {
        id,
        tenantId,
      });
      this.#logger.debug(
        `${logPrefix} Returning: ${JsonUtils.Stringify(result)}.`
      );
      return result;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(input)}.`,
        `Details: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }

  public async GetConnectInvestorLeadSummaryById(
    requestId: string,
    input: IAdvisorServiceGetLeadByIdParamDto
  ): Promise<IGenericDataSummaryDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetConnectInvestorLeadSummaryById.name,
      requestId
    );
    this.#logger.debug(`${logPrefix} Inputs: ${JsonUtils.Stringify(input)}.`);
    try {
      const { tenantId, id } = input;
      const rawLead = await this.GetConnectInvestorLeadById(requestId, {
        tenantId,
        id,
      });
      const connectPortfolioSummary =
        await this.connectPortfolioSummaryCentralDb.GetConnectModelPortfolio(
          requestId,
          tenantId,
          rawLead.riskAppetite
        );
      const lead = {
        ...rawLead,
        ConnectPortfolioSummary: connectPortfolioSummary,
      };
      this.guardAgainstLeadObjectNull(requestId, id, tenantId, lead);
      const numberParsingRules = plainToInstance(
        GenerateValueForSummaryObjectNumberRulesParamsDto,
        {
          roundOffNumbers: true,
          decimalPlaces: 0,
        } as IGenerateValueForSummaryObjectNumberRulesParamsDto
      );
      const responsePayload: IGenericDataSummaryDto[] = [
        {
          displayName: 'User Details',
          key: 'USER_DETAILS',
          fields: [
            {
              displayName: 'Name',
              key: 'NAME',
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              value: await this.generateValueForSummaryObject({
                value: lead.name,
              }),
            },
            {
              displayName: 'Status',
              key: 'STATUS',
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              value: await this.generateValueForSummaryObject({
                value: lead.status,
              }),
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
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              format: SharedEnums.EnumGenericDataSummaryFieldFormat.EMAIL,
              value: await this.generateValueForSummaryObject({
                value: lead?.email,
              }),
            },
            {
              displayName: 'Phone Number',
              key: 'PHONE_NUMBER',
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              format: SharedEnums.EnumGenericDataSummaryFieldFormat.PHONE,
              value: await this.generateValueForSummaryObject({
                value: lead?.phoneNumber,
              }),
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
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              value: await this.generateValueForSummaryObject({
                value: lead?.zipCode,
              }),
            },
            {
              displayName: 'Age',
              key: 'AGE',
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              value: await this.generateValueForSummaryObject({
                value: lead?.age,
              }),
            },
            {
              displayName: lead.isRetired
                ? 'Retirement Savings'
                : 'Annual Income',
              key: lead.isRetired ? 'RETIREMENT_SAVINGS' : 'ANNUAL_INCOME',
              type: SharedEnums.EnumGenericDataSummaryFieldType.CURRENCY,
              value: await this.generateValueForSummaryObject({
                value: lead.isRetired
                  ? lead?.currentSavings
                  : lead?.incomePerAnnum,
                numberRules: numberParsingRules,
              }),
            },
            {
              displayName: 'Monthly Savings',
              key: 'MONTHLY_SAVINGS',
              type: SharedEnums.EnumGenericDataSummaryFieldType.CURRENCY,
              value: await this.generateValueForSummaryObject({
                value: lead?.monthlySavings,
                numberRules: numberParsingRules,
              }),
            },
            {
              displayName: 'Investment Style',
              key: 'INVESTMENT_STYLE',
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              value: await this.generateValueForSummaryObject({
                value: _.startCase(
                  _.toLower(lead?.ConnectPortfolioSummary?.key)
                ),
              }),
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
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              value: await this.generateValueForSummaryObject({
                value: lead?.goalName,
              }),
            },
            {
              displayName: 'Timeframe (Years)',
              key: 'TARGET_YEAR',
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              value: await this.generateValueForSummaryObject({
                value: lead?.goalTimeframe,
              }),
            },
            {
              displayName: 'Target Goal',
              key: 'TARGET_GOAL',
              type: SharedEnums.EnumGenericDataSummaryFieldType.CURRENCY,
              value: await this.generateValueForSummaryObject({
                value: lead.goalValue,
                numberRules: numberParsingRules,
              }),
            },
            {
              displayName: 'Initial Contribution',
              key: 'INITIAL_CONTRIBUTION',
              type: SharedEnums.EnumGenericDataSummaryFieldType.CURRENCY,
              value: await this.generateValueForSummaryObject({
                value: lead.initialInvestment,
                numberRules: numberParsingRules,
              }),
            },
            {
              displayName: 'Monthly Contribution',
              key: 'MONTHLY_CONTRIBUTION',
              type: SharedEnums.EnumGenericDataSummaryFieldType.CURRENCY,
              value: await this.generateValueForSummaryObject({
                value: lead.monthlyContribution,
                numberRules: numberParsingRules,
              }),
            },
            {
              displayName: 'Recommended Portfolio',
              key: 'RECOMMENDED_PORTFOLIO',
              type: SharedEnums.EnumGenericDataSummaryFieldType.STRING,
              value: await this.generateValueForSummaryObject({
                value: lead?.ConnectPortfolioSummary?.name,
              }),
            },
            ...(lead?.recommendedMonthlyContribution !== 0
              ? [
                  {
                    displayName: 'Suggested Monthly Contribution',
                    key: 'SUGGESTED_MONTHLY_CONTRIBUTION',
                    type: SharedEnums.EnumGenericDataSummaryFieldType.CURRENCY,
                    value: await this.generateValueForSummaryObject({
                      value: lead?.recommendedMonthlyContribution,
                      numberRules: numberParsingRules,
                    }),
                  },
                ]
              : []),
          ],
        },
      ];
      this.#logger.debug(
        `${logPrefix} Returning: ${JsonUtils.Stringify(responsePayload)}.`
      );

      return responsePayload;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(input)}.`,
        `Details: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }
}
