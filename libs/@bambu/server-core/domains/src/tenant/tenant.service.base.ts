import { PrismaModel } from '@bambu/server-core/db/central-db';
import { IColossusTrackingDto } from '@bambu/server-core/dto';
import { IamDto, OtpDto } from '@bambu/shared';
import {
  ApplicationResponse,
  GroupResponse,
  RegistrationResponse,
  TenantResponse,
} from '@fusionauth/typescript-client';

export interface ISendChangePasswordLinkParams {
  tenantId: string;
  userId: string;
  mode?: OtpDto.EnumOtpMode;
  email: string;
  tracking: IColossusTrackingDto;
}

export interface IChangeUserPasswordByEmailOtpParams {
  tenantId: string;
  tenantName: string;
  username: string;
  otp: string;
  newPassword: string;
  tracking: IColossusTrackingDto;
}

export interface ICreateTenantApplicationForFusionAuthParamsDto {
  applicationName: string;
  applicationId: string;
  tenantId: string;
  tracking: IColossusTrackingDto;
}

export interface ICreateTenantGroupForFusionAuthParamsDto {
  groupId?: string;
  groupName: string;
  tenantId: string;
  singletonRoleId: string;
  additionalRoleIds?: string[];
  tracking: IColossusTrackingDto;
}

export interface ICreateInitialTenantUserForFusionAuthParamsDto {
  applicationId: string;
  applicationPreferredLanguages?: string[];
  tenantId: string;
  userId?: string;
  username: string;
  email: string;
  password: string;
  mobilePhone?: string;
  groupMemberships?: string[];
  additionalUserMetadata?: Record<string, unknown>;
  tracking: IColossusTrackingDto;
}

export interface ISetupHubSpotForNewTenantParamsDto {
  email: string;
  dealPipelineParameters: {
    dealName: string;
  };
  enableMarketing: boolean;
  tracking: IColossusTrackingDto;
}

export interface ISendOtpForInitialVerificationParams {
  tenantId: string;
  userId: string;
  mode?: OtpDto.EnumOtpMode;
  email: string;
  requestId?: string;
}

export interface IVerifyUserEmailByEmailOtpParams {
  requestId: string;
  tenantName: string;
  tenantId: string;
  username: string;
  otp: string;
}

export abstract class TenantServiceBase {
  abstract GetTenantIdFromTenantName(tenantName: string): Promise<string>;

  abstract CreateTenantWithInitialUser(
    tracking: IColossusTrackingDto,
    tenantName: string,
    initialUser: Omit<IamDto.IIamAdminCreateUserDto, 'groups'>,
    enableMarketing: boolean
  ): Promise<void>;

  // TODO: start of methods that we should consider moving to a TenantUserServiceBase
  // TODO: current return type is simply iam information; when we have better requirements this needs to be
  //   a Tenant User object (to be defined) that contains the user's IAM information as well as information from the db.
  abstract GetTenantUserByUsername(
    realmId: string,
    username: string
  ): Promise<IamDto.IIamUserInformationDto>;

  // Returns true iff at the end of the operation user is enabled.
  abstract VerifyUserEmailByEmailOtp(
    params: IVerifyUserEmailByEmailOtpParams
  ): Promise<boolean>;

  abstract ChangeUserPasswordByEmailOtp(
    params: IChangeUserPasswordByEmailOtpParams
  ): Promise<boolean>;

  public abstract GetTenantIdFromTenantNameSafe(
    requestId: string,
    tenantName: string
  ): Promise<string | null>;

  abstract GetTenantUserByUsernameSafe(
    requestId: string,
    tenantName: string,
    username: string
  ): Promise<IamDto.IIamUserInformationDto | null>;

  public abstract SendChangePasswordLink(
    params: ISendChangePasswordLinkParams
  ): Promise<void>;

  public abstract SendOtpForInitialVerification(
    params: ISendOtpForInitialVerificationParams
  ): Promise<void>;

  public abstract GetTenantFromTenantNameSafe(
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
  >;

  public abstract CreateTenantViaFusionAuth(
    tracking: IColossusTrackingDto,
    tenantName: string,
    tenantId: string
  ): Promise<{ dbTenant: PrismaModel.Tenant; iamTenant: TenantResponse }>;

  public abstract CreateTenantApplicationForFusionAuth(
    input: ICreateTenantApplicationForFusionAuthParamsDto
  ): Promise<ApplicationResponse>;

  public abstract CreateTenantGroupForFusionAuth(
    input: ICreateTenantGroupForFusionAuthParamsDto
  ): Promise<GroupResponse>;

  public abstract CreateInitialTenantUserForFusionAuth(
    input: ICreateInitialTenantUserForFusionAuthParamsDto
  ): Promise<{
    iamTenantAdminUser: RegistrationResponse;
    dbUser: Omit<PrismaModel.User, 'Tenant' | 'otps' | 'connectAdvisor'>;
  }>;

  public abstract CreateTenantApplicationForFusionAuthWithDefaultGroups(
    input: ICreateTenantApplicationForFusionAuthParamsDto
  ): Promise<{
    iamServiceTenantApplication: ApplicationResponse;
    iamApplicationSingletonGroups: GroupResponse[];
  }>;

  public abstract SetupHubSpotForNewTenant(
    input: ISetupHubSpotForNewTenantParamsDto
  ): Promise<void>;

  public abstract GuardAgainstTenantCreationWithExistingUser(
    requestId: string,
    username: string
  ): Promise<void>;

  // TODO: end of methods that we should consider moving to a TenantUserServiceBase
}
