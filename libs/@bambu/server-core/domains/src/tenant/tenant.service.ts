// noinspection ES6PreferShortImport

import { PrismaModel } from '@bambu/server-core/db/central-db';
import { IColossusTrackingDto } from '@bambu/server-core/dto';
import {
  FusionAuthIamApplicationRepositoryServiceBase,
  FusionAuthIamGroupRepositoryServiceBase,
  FusionAuthIamTenantRepositoryServiceBase,
  FusionAuthIamUserRepositoryServiceBase,
  TenantCentralDbRepositoryService,
  UserCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import {
  BambuEventEmitterService,
  ErrorUtils,
  HUBSPOT_EVENTS,
  JsonUtils,
  LoggingUtils,
  UuidUtils,
} from '@bambu/server-core/utilities';
import { IamDto, OtpDto, SharedEnums } from '@bambu/shared';
import {
  ApplicationResponse,
  GroupResponse,
  RegistrationResponse,
  TenantResponse,
} from '@fusionauth/typescript-client';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import * as crypto from 'crypto';
import { IamAdminServiceBase } from '../iam/iam-admin.service.base';
import { OtpServiceBase, IOtpVerifyRequestDto } from '../otp';
import {
  IChangeUserPasswordByEmailOtpParams,
  ICreateInitialTenantUserForFusionAuthParamsDto,
  ICreateTenantApplicationForFusionAuthParamsDto,
  ICreateTenantGroupForFusionAuthParamsDto,
  ISendChangePasswordLinkParams,
  ISendOtpForInitialVerificationParams,
  ISetupHubSpotForNewTenantParamsDto,
  IVerifyUserEmailByEmailOtpParams,
  TenantServiceBase,
} from './tenant.service.base';

export interface IFusionAuthTenantGroupCreationDto {
  groups: IFusionAuthTenantGroupCreationItemsDto[];
  tenantId: string;
  tracking: IColossusTrackingDto;
}

export interface IFusionAuthTenantGroupCreationItemsDto {
  groupId: string;
  groupName: string;
  singletonRoleId: string;
  additionalRoleIds?: string[];
}

@Injectable()
export class TenantService implements TenantServiceBase {
  readonly #logger: Logger = new Logger(TenantService.name);

  constructor(
    private readonly iamAdminService: IamAdminServiceBase,
    private readonly tenantCentralDb: TenantCentralDbRepositoryService,
    private readonly userCentralDb: UserCentralDbRepositoryService,
    private readonly otpService: OtpServiceBase,
    private readonly eventEmitterService: BambuEventEmitterService,
    private readonly fusionAuthTenant: FusionAuthIamTenantRepositoryServiceBase,
    private readonly fusionAuthApplication: FusionAuthIamApplicationRepositoryServiceBase,
    private readonly fusionAuthGroup: FusionAuthIamGroupRepositoryServiceBase,
    private readonly fusionAuthUser: FusionAuthIamUserRepositoryServiceBase
  ) {}

  public async GetTenantFromTenantNameSafe(
    requestId: string,
    tenantName: string
  ): Promise<
    | (PrismaModel.Tenant & {
        apiKeys: PrismaModel.TenantApiKey[];
        httpUrls: PrismaModel.TenantHttpUrl[];
      })
    | null
    | (PrismaModel.Tenant & {
        apiKeys: PrismaModel.TenantApiKey[];
        httpUrls: PrismaModel.TenantHttpUrl[] | null;
        branding: PrismaModel.TenantBranding | null;
        connectAdvisors: PrismaModel.ConnectAdvisor[];
        tenantSubscriptions: PrismaModel.TenantSubscription[];
      })
  > {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.GetTenantFromTenantNameSafe.name,
      requestId
    );
    try {
      /**
       * Workaround.
       *
       * We are moving towards using UUIDs for tenant realms, but we still have some legacy code that uses tenant names.
       */
      if (UuidUtils.isStringUuid(tenantName)) {
        return this.tenantCentralDb.FindTenantById(tenantName);
      }
      return this.tenantCentralDb.FindTenantByRealm(tenantName);
    } catch (error) {
      const errorMessage: string = [
        `${logPrefix} Error getting tenant from tenant name (${tenantName}).`,
        `Details: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }

  async GetTenantIdFromTenantName(tenantName: string): Promise<string> {
    const logPrefix = `${this.GetTenantIdFromTenantName.name} -`;
    try {
      /**
       * Workaround.
       *
       * We are moving towards using UUIDs for tenant realms, but we still have some legacy code that uses tenant names.
       */
      if (UuidUtils.isStringUuid(tenantName)) {
        return tenantName;
      }

      const tenant = await this.tenantCentralDb.FindTenantByRealm(tenantName);

      if (!tenant) {
        // noinspection ExceptionCaughtLocallyJS
        throw ErrorUtils.getDefaultMissingTenantInDbErrorWithTenantId({
          tenantId: tenantName,
        });
      }

      return tenant.id;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Error getting tenant id from tenant name.`,
        `Input: ${JsonUtils.Stringify({ tenantName })}.`,
        `Details: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }

  public async GetTenantIdFromTenantNameSafe(
    requestId: string,
    tenantName: string
  ): Promise<string | null> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetTenantIdFromTenantNameSafe.name,
      requestId
    );
    try {
      /**
       * Workaround.
       *
       * We are moving towards using UUIDs for tenant realms, but we still have some legacy code that uses tenant names.
       */
      if (UuidUtils.isStringUuid(tenantName)) {
        return tenantName;
      }

      const dbRow = await this.tenantCentralDb.FindTenantByRealm(tenantName);
      if (dbRow && dbRow.id) {
        return dbRow.id;
      }

      return null;
    } catch (error) {
      this.#logger.error(
        [
          `${logPrefix} Error while getting tenant id from tenant name.`,
          `Details: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async CreateTenantViaFusionAuth(
    tracking: IColossusTrackingDto,
    tenantName: string,
    tenantId: string
  ): Promise<{ dbTenant: PrismaModel.Tenant; iamTenant: TenantResponse }> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.CreateTenantViaFusionAuth.name,
      tracking.requestId
    );
    const inputForLogging = {
      tenantName,
      tenantId,
    };
    try {
      this.#logger.verbose(`${logPrefix} Creating tenant (${tenantName}).`);
      this.#logger.debug(
        `${logPrefix} Input: ${JsonUtils.Stringify(inputForLogging)}.`
      );
      this.#logger.verbose(
        `${logPrefix} Creating tenant (${tenantName}) in Fusion Auth.`
      );
      const tenantCreationResponse = await this.fusionAuthTenant.Create({
        tenantId,
        tenantName,
        tenantCreationPayload:
          await this.fusionAuthTenant.GetTenantDefaultConfiguration(
            tracking.requestId,
            tenantName
          ),
        tracking,
      });

      this.#logger.verbose(
        `${logPrefix} Tenant (${tenantName}) created in Fusion Auth.`
      );
      this.#logger.debug(
        `${logPrefix} Tenant created in fusion auth ${JsonUtils.Stringify(
          tenantCreationResponse
        )}.`
      );

      this.#logger.verbose(
        `${logPrefix} Creating tenant (${tenantName}) in DB.`
      );

      const dbTenant = await this.tenantCentralDb.CreateTenant({
        realm: tenantName,
        tracking,
        linkedToKeyCloak: false,
        usesIdInsteadOfRealm: true,
        linkedToFusionAuth: true,
        id: tenantId,
      });

      this.#logger.verbose(`${logPrefix} Tenant created in DB.`);
      this.#logger.debug(
        `${logPrefix} Tenant created in DB: ${JsonUtils.Stringify(dbTenant)}.`
      );

      return {
        iamTenant: tenantCreationResponse,
        dbTenant,
      };
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error creating tenant ${JsonUtils.Stringify(error)}`
      );
      throw error;
    }
  }

  public async CreateTenantApplicationForFusionAuth(
    input: ICreateTenantApplicationForFusionAuthParamsDto
  ): Promise<ApplicationResponse> {
    const { tenantId, applicationId, applicationName, tracking } = input;
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.CreateTenantApplicationForFusionAuth.name,
      tracking.requestId
    );

    try {
      this.#logger.verbose(
        `${logPrefix} Creating tenant application (${applicationName}).`
      );
      this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(input)}.`);

      // Note: since `creationPayload` is not specified here, the tenant will be created with a default configuration.
      // You can get the default configuration by calling `fusionAuthApplication.GetTenantApplicationDefaultConfiguration(applicationName, tenantId)`.
      // `GetTenantApplicationDefaultConfiguration` accepts an optional `roles` payload, that if not specified, as when called by not passing `creationPayload`, will set up the default roles.
      const tenantApplicationCreationResponse =
        await this.fusionAuthApplication.Create({
          applicationId,
          tenantId,
          applicationName,
          tracking,
        });

      this.#logger.debug(
        `${logPrefix} Tenant application created ${JsonUtils.Stringify(
          tenantApplicationCreationResponse
        )}.`
      );
      return tenantApplicationCreationResponse;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error creating tenant ${JsonUtils.Stringify(error)}`
      );
      throw error;
    }
  }

  public async GuardAgainstTenantCreationWithExistingUser(
    requestId: string,
    username: string
  ): Promise<void> {
    const existingUser = await this.fusionAuthUser.FindUserByLoginId(
      requestId,
      username
    );
    if (!existingUser) {
      return;
    }
    throw new ErrorUtils.ColossusError(
      `User already is in another tenant or has an existing tenant on the platform.`,
      requestId,
      { username },
      409,
      SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_USER_ALREADY_EXISTS
    );
  }

  public async CreateTenantApplicationForFusionAuthWithDefaultGroups(
    input: ICreateTenantApplicationForFusionAuthParamsDto
  ): Promise<{
    iamServiceTenantApplication: ApplicationResponse;
    iamApplicationSingletonGroups: GroupResponse[];
  }> {
    const { tenantId, applicationName, tracking } = input;
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.CreateTenantApplicationForFusionAuthWithDefaultGroups.name,
      tracking.requestId
    );
    try {
      this.#logger.verbose(
        `${logPrefix} Creating tenant application (${applicationName}) with groups.`
      );
      this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(input)}.`);
      const iamServiceTenantApplication =
        await this.CreateTenantApplicationForFusionAuth(input);
      const rolesInApplication = iamServiceTenantApplication.application.roles;
      const groups: IFusionAuthTenantGroupCreationItemsDto[] =
        rolesInApplication.map((role) => ({
          groupId: crypto.randomUUID(),
          singletonRoleId: role.id,
          groupName: `${iamServiceTenantApplication.application.id}-${role.name}`,
        }));
      const iamApplicationSingletonGroups =
        await this.createDefaultGroupsForTenantForFusionAuthTenant({
          tenantId,
          groups,
          tracking,
        });
      return {
        iamServiceTenantApplication,
        iamApplicationSingletonGroups,
      };
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error creating tenant ${JsonUtils.Stringify(error)}`
      );
      throw error;
    }
  }

  private async createDefaultGroupsForTenantForFusionAuthTenant(
    input: IFusionAuthTenantGroupCreationDto
  ): Promise<GroupResponse[]> {
    const { groups, tenantId, tracking } = input;
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.createDefaultGroupsForTenantForFusionAuthTenant.name,
      tracking.requestId
    );
    try {
      this.#logger.verbose(`${logPrefix} Creating default groups for tenant.`);
      this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(input)}.`);

      const groupCreationPromises = groups.map((groupCreationItem) =>
        this.CreateTenantGroupForFusionAuth({
          ...groupCreationItem,
          tenantId,
          tracking,
        })
      );

      const groupCreationResults = await Promise.all(groupCreationPromises);

      this.#logger.verbose(`${logPrefix} Default groups created for tenant.`);
      this.#logger.debug(
        `${logPrefix} Default groups created for tenant: ${JsonUtils.Stringify(
          groupCreationResults
        )}.`
      );

      return groupCreationResults;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error creating default groups for tenant ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  public async CreateTenantGroupForFusionAuth(
    input: ICreateTenantGroupForFusionAuthParamsDto
  ): Promise<GroupResponse> {
    const {
      tenantId,
      groupName,
      groupId,
      singletonRoleId,
      additionalRoleIds,
      tracking,
    } = input;
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.CreateTenantGroupForFusionAuth.name,
      tracking.requestId
    );
    try {
      this.#logger.verbose(
        `${logPrefix} Creating group ${groupName}) for tenant (${tenantId}).`
      );
      this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(input)}.`);
      const fusionAuthGroupId = groupId || crypto.randomUUID();
      const tenantGroupCreationResponse =
        await this.fusionAuthGroup.CreateGroup({
          groupId: fusionAuthGroupId,
          tenantId,
          roleIds: [singletonRoleId, ...(additionalRoleIds ?? [])],
          name: groupName,
          tracking,
        });
      this.#logger.debug(
        `${logPrefix} Tenant application created ${JsonUtils.Stringify(
          tenantGroupCreationResponse
        )}.`
      );
      return tenantGroupCreationResponse;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error creating tenant ${JsonUtils.Stringify(error)}`
      );
      throw error;
    }
  }

  public async CreateInitialTenantUserForFusionAuth(
    input: ICreateInitialTenantUserForFusionAuthParamsDto
  ): Promise<{
    iamTenantAdminUser: RegistrationResponse;
    dbUser: Omit<PrismaModel.User, 'Tenant' | 'otps' | 'connectAdvisor'>;
  }> {
    const {
      tenantId,
      userId,
      email,
      additionalUserMetadata,
      username,
      applicationPreferredLanguages,
      applicationId,
      groupMemberships,
      password,
      mobilePhone,
      tracking,
    } = input;

    const logPrefix = LoggingUtils.generateLogPrefix(
      this.CreateInitialTenantUserForFusionAuth.name,
      tracking.requestId
    );
    try {
      this.#logger.verbose(
        `${logPrefix} Creating initial user for tenant (${tenantId}) in Fusion Auth.`
      );
      this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(input)}.`);
      const fusionAuthUserId = userId || crypto.randomUUID();

      const tenantUserCreationResponse =
        await this.fusionAuthUser.CreateUserAndRegisterToApplication(
          tracking.requestId,
          {
            tenantId,
            applicationId,
            applicationPreferredLanguages,
            user: {
              userId: fusionAuthUserId,
              email,
              additionalMetadata: additionalUserMetadata,
              username,
              groupMemberships,
              password,
              mobilePhone,
            },
          }
        );
      this.#logger.verbose(
        `${logPrefix} Tenant initial user created in Fusion Auth.`
      );
      this.#logger.debug(
        `${logPrefix} Tenant initial user created created ${JsonUtils.Stringify(
          tenantUserCreationResponse
        )}.`
      );

      this.#logger.verbose(`${logPrefix} Creating initial user in DB.`);
      this.#logger.debug(
        `${logPrefix} Input: ${JsonUtils.Stringify({
          input,
          id: fusionAuthUserId,
        })}.`
      );

      const dbUser = await this.userCentralDb.CreateUser(tracking.requestId, {
        tenantId,
        id: fusionAuthUserId,
      });

      this.#logger.verbose(`${logPrefix} Initial user created in DB.`);
      this.#logger.debug(
        `${logPrefix} Initial user created in DB: ${JsonUtils.Stringify(
          dbUser
        )}.`
      );

      return { iamTenantAdminUser: tenantUserCreationResponse, dbUser };
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error creating tenant ${JsonUtils.Stringify(error)}`
      );
      throw error;
    }
  }

  async CreateTenantWithInitialUser(
    tracking: IColossusTrackingDto,
    tenantName: string,
    initialUser: Omit<IamDto.IIamAdminCreateUserDto, 'groups'>,
    enableMarketing: boolean
  ): Promise<void> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.CreateTenantWithInitialUser.name,
      tracking.requestId
    );

    try {
      const tenant = await this.tenantCentralDb.CreateTenant({
        realm: tenantName,
        tracking,
        linkedToKeyCloak: true,
        usesIdInsteadOfRealm: true,
      });

      const { id: tenantDbId } = tenant;

      await this.iamAdminService.CreateTenantRealmWithInitialUser(
        tenantDbId,
        initialUser
      );

      this.#logger.debug(`${logPrefix} Getting iamUserInformation.`);
      const iamUserInformation =
        await this.iamAdminService.GetRealmUserByUsername(
          tracking.requestId,
          tenantDbId,
          initialUser.username
        );

      if (!iamUserInformation) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(
          'IAM tenant initialized with initial user, but initial user not found by calling GetRealmUserByUsername.'
        );
      }
      this.#logger.debug(`${logPrefix} Gotten iamUserInformation.`);

      this.#logger.debug(`${logPrefix} Updating tenant in DB.`);
      await this.tenantCentralDb.UpdateTenant(tracking.requestId, tenantDbId, {
        linkedToKeyCloak: true,
        updatedAt: new Date(),
      });
      this.#logger.debug(`${logPrefix} Updated tenant in DB.`);

      this.#logger.debug(`${logPrefix} Creating user in user in DB.`);
      await this.userCentralDb.CreateUser(tracking.requestId, {
        tenantId: tenantDbId,
        id: iamUserInformation.id,
      });
      this.#logger.debug(`${logPrefix} Created user in user in DB.`);

      await this.SendOtpForInitialVerification({
        tenantId: tenantDbId,
        userId: iamUserInformation.id,
        mode: OtpDto.EnumOtpMode.EMAIL,
        email: initialUser.email,
      });

      await this.eventEmitterService.emitAsync(
        HUBSPOT_EVENTS.INITIALISE_DEAL_PIPELINE,
        {
          email: initialUser.email,
          dealName: `Connect`,
        }
      );

      // Subscribe the user to hubspot marketing
      if (enableMarketing) {
        this.eventEmitterService.emitAsync<string>(
          HUBSPOT_EVENTS.ENABLE_MARKETING,
          initialUser.email
        );
      }

      this.#logger.log(`${logPrefix} Tenant created with initial user.`);

      const debugCompletionObjects = {
        initialUser,
        iamUserInformation,
      };
      this.#logger.debug(
        `${logPrefix} Tenant created with initial user: ${JsonUtils.Stringify(
          debugCompletionObjects
        )}`
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error creating tenant realm with initial user: ${error}`
      );
      throw error;
    }
  }

  public async SendChangePasswordLink({
    tenantId,
    mode = OtpDto.EnumOtpMode.EMAIL,
    userId,
    email,
    tracking,
  }: ISendChangePasswordLinkParams): Promise<void> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.SendChangePasswordLink.name,
      tracking.requestId
    );

    try {
      await this.otpService.SendOtp(
        {
          tenantId,
          userId,
          purpose: 'CHANGE_PASSWORD',
          mode,
          email,
        },
        tracking
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered when sending OTP. Details: ${JsonUtils.Stringify(
          {
            error,
            tracking,
          }
        )}`
      );
      throw error;
    }
  }

  public async SendOtpForInitialVerification({
    tenantId,
    mode = OtpDto.EnumOtpMode.EMAIL,
    userId,
    email,
    requestId,
  }: ISendOtpForInitialVerificationParams): Promise<void> {
    if (!requestId) {
      requestId = 'N/A';
    }
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.SendOtpForInitialVerification.name,
      requestId
    );

    try {
      await this.otpService.SendOtp({
        tenantId,
        userId,
        purpose: 'INITIAL_EMAIL_VERIFICATION',
        mode,
        email,
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered when sending OTP. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  async GetTenantUserByUsername(
    tenantName: string,
    username: string
  ): Promise<IamDto.IIamUserInformationDto> {
    const logPrefix = `${this.GetTenantUserByUsername.name} -`;
    try {
      return await this.iamAdminService.GetRealmUserByUsername(
        'N/A',
        tenantName,
        username
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error getting tenant user by username: ${error}`
      );
      throw error;
    }
  }

  async GetTenantUserByUsernameSafe(
    requestId: string,
    tenantName: string,
    username: string
  ): Promise<IamDto.IIamUserInformationDto | null> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.GetTenantUserByUsernameSafe.name,
      requestId
    );
    try {
      return await this.iamAdminService.GetRealmUserByUsername(
        requestId,
        tenantName,
        username
      );
    } catch (error) {
      if ((error as AxiosError).isAxiosError) {
        const statusCode = (error as AxiosError)?.response.status;
        if (statusCode === 404) {
          return null;
        }
      }
      this.#logger.error(
        `${logPrefix} Error getting tenant user by username: ${error}`
      );
      throw error;
    }
  }

  async ChangeUserPasswordByEmailOtp({
    tenantName,
    tenantId,
    username,
    otp,
    newPassword,
    tracking,
  }: IChangeUserPasswordByEmailOtpParams): Promise<boolean> {
    const { requestId } = tracking;

    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ChangeUserPasswordByEmailOtp.name,
      requestId
    );

    try {
      const iamUserInformation =
        await this.iamAdminService.GetRealmUserByUsername(
          requestId,
          tenantName,
          username
        );

      const verifyOtpRequest: IOtpVerifyRequestDto = {
        tenantId,
        userId: iamUserInformation.id,
        otp,
        purpose: 'CHANGE_PASSWORD',
        mode: OtpDto.EnumOtpMode.EMAIL,
      };

      const otpVerified = await this.otpService.VerifyOtp(
        verifyOtpRequest,
        tracking
      );

      if (!otpVerified) {
        this.#logger.debug(
          `${logPrefix} OTP provided for user ${username} is not valid`
        );
        return false;
      }

      await this.iamAdminService.ChangePasswordById({
        realmId: tenantName,
        userId: iamUserInformation.id,
        newPassword,
        tracking,
        username,
      });

      return true;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error changing password by email OTP: ${JsonUtils.Stringify(
          {
            error,
            tracking,
          }
        )}`
      );
      throw error;
    }
  }

  async VerifyUserEmailByEmailOtp({
    requestId,
    tenantName,
    tenantId,
    username,
    otp,
  }: IVerifyUserEmailByEmailOtpParams): Promise<boolean> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.VerifyUserEmailByEmailOtp.name,
      requestId
    );

    try {
      const user = await this.GetTenantUserByUsernameSafe(
        requestId,
        tenantName,
        username
      );

      const verifyOtpRequest: IOtpVerifyRequestDto = {
        tenantId,
        userId: user.id,
        otp,
        purpose: 'INITIAL_EMAIL_VERIFICATION',
        mode: OtpDto.EnumOtpMode.EMAIL,
      };

      const otpVerified = await this.otpService.VerifyOtp(verifyOtpRequest);

      if (!otpVerified) {
        this.#logger.debug(
          `${logPrefix} OTP provided for user ${username} is not valid`
        );
        return false;
      }

      await this.iamAdminService.VerifyUserEmailById(
        requestId,
        tenantName,
        user.id
      );

      return true;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error enabling user by verify email OTP: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  public async SetupHubSpotForNewTenant(
    input: ISetupHubSpotForNewTenantParamsDto
  ): Promise<void> {
    const dealName = input.dealPipelineParameters.dealName || 'Connect';
    const { email, enableMarketing } = input;
    await this.eventEmitterService.emitAsync(
      HUBSPOT_EVENTS.INITIALISE_DEAL_PIPELINE,
      {
        email,
        dealName,
      }
    );
    if (enableMarketing) {
      this.eventEmitterService.emitAsync<string>(
        HUBSPOT_EVENTS.ENABLE_MARKETING,
        email
      );
    }
  }
}
