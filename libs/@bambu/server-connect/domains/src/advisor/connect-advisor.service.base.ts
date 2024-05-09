import { IColossusTrackingDto } from '@bambu/server-core/dto';
import {
  AuthenticationDto,
  ConnectAdvisorDto,
  ConnectLeadsDto,
  ConnectPortfolioSummaryDto,
  ConnectTenantDto,
  IGenericDataSummaryDto,
} from '@bambu/shared';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IGetProfileInputDto } from '../tools';

export interface ISetProfilePictureOpts {
  tenantId: string;
  filePath: string;
  originalFilename: string;
  contentType: string;
  userId: string;
  tracking?: IColossusTrackingDto;
}

export interface IUnsetProfilePictureOpts {
  tenantId: string;
  userId: string;
  tracking?: IColossusTrackingDto;
}

export interface ISetInternalProfilePictureOpts {
  tenantId: string;
  filePath: string;
  originalFilename: string;
  contentType: string;
  userId: string;
  tracking?: IColossusTrackingDto;
}

export interface IUnsetInternalProfilePictureOpts {
  tenantId: string;
  userId: string;
  tracking?: IColossusTrackingDto;
}

export interface ISetGoalTypesInput {
  requestId: string;
  tenantRealm: string;
  goalTypeIds: string[];
  userIdForLogging?: string; // for logging only
  trackPlatformSetupProgress: boolean;
}

export interface IAdvisorServiceGetLeadByIdParamDto {
  id: string;
  tenantId: string;
}

export interface IGenerateValueForSummaryObjectNumberRulesParamsDto {
  roundOffNumbers?: boolean;
  decimalPlaces?: number;
}

export class GenerateValueForSummaryObjectNumberRulesParamsDto
  implements IGenerateValueForSummaryObjectNumberRulesParamsDto
{
  @IsBoolean()
  roundOffNumbers = false;

  @IsNumber()
  decimalPlaces = 2;
}

export interface IGenerateValueForSummaryObjectParamsDto {
  value: unknown | undefined | null;
  emptyValuePlaceholder?: string;
  numberRules?: IGenerateValueForSummaryObjectNumberRulesParamsDto;
}

export class GenerateValueForSummaryObjectParamsDto
  implements IGenerateValueForSummaryObjectParamsDto
{
  value: unknown | undefined | null = null;

  @IsString()
  emptyValuePlaceholder = '-';

  @IsObject()
  @Type(() => GenerateValueForSummaryObjectNumberRulesParamsDto)
  @ValidateNested()
  numberRules: GenerateValueForSummaryObjectNumberRulesParamsDto =
    new GenerateValueForSummaryObjectNumberRulesParamsDto();
}

export abstract class ConnectAdvisorServiceBase {
  abstract GetTradeNameAndSubdomain(
    tenantId: string
  ): Promise<ConnectTenantDto.IConnectTenantTradeNameAndSubdomainDto>;

  abstract SetTradeNameAndSubdomain({
    tracking,
    tenantIdOrRealm,
    payload,
  }: {
    tracking: IColossusTrackingDto;
    tenantIdOrRealm: string;
    payload: ConnectTenantDto.IConnectTenantTradeNameAndSubdomainDto;
  }): Promise<void>;

  abstract Create(
    tracking: IColossusTrackingDto,
    connectCreateAdvisorDto: ConnectAdvisorDto.IConnectAdvisorCreateRequestDto
  ): Promise<AuthenticationDto.IAuthenticationLoginResponseDto>;

  abstract Login(
    requestId: string,
    connectLoginAdvisorDto: ConnectAdvisorDto.IConnectAdvisorLoginRequestDto
  ): Promise<AuthenticationDto.IAuthenticationLoginResponseDto>;

  abstract SendChangePasswordEmailLink(
    params: ConnectAdvisorDto.IConnectAdvisorSendResetPasswordEmailOtpRequestDto,
    tracking: IColossusTrackingDto
  ): Promise<void>;

  abstract VerifyUserEmailByEmailOtp(
    requestId: string,
    connectVerifyAdvisorEmailDto: ConnectAdvisorDto.IConnectAdvisorAccountInitialEmailVerificationRequestDto
  ): Promise<AuthenticationDto.IAuthenticationLoginResponseDto | boolean>;

  abstract ChangePasswordByEmailOtp(
    credentials: ConnectAdvisorDto.IConnectAdvisorResetPasswordRequestDto,
    tracking: IColossusTrackingDto
  ): Promise<boolean>;

  // TODO: consider restrictions on the state of the Advisor when this may be called.
  abstract UpdateProfile(
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
  ): Promise<void>;

  abstract SetProfileBio(
    connectAdvisor: Pick<
      ConnectAdvisorDto.IConnectAdvisorProfileInformationDto,
      'userId' | 'tenantRealm' | 'profileBioRichText' | 'fullProfileLink'
    >,
    tracking: IColossusTrackingDto
  ): Promise<void>;

  abstract SetContactData(
    connectAdvisor: Pick<
      ConnectAdvisorDto.IConnectAdvisorProfileInformationDto,
      'userId' | 'tenantRealm' | 'contactMeReasonsRichText' | 'contactLink'
    >,
    tracking: IColossusTrackingDto
  ): Promise<void>;

  abstract GetProfile(
    params: IGetProfileInputDto
  ): Promise<ConnectAdvisorDto.IConnectAdvisorProfileInformationDto>;

  public abstract ResendTenantOtp(
    requestId: string,
    email: string
  ): Promise<void>;

  public abstract SetGoalTypes(input: ISetGoalTypesInput): Promise<void>;

  public abstract FlushInvestorPortalCachedHtml(
    requestId: string,
    tenantRealm: string
  ): Promise<void>;

  public abstract SetTenantTopLevelOptions({
    tracking,
    tenantId,
    payload,
  }: {
    tracking: IColossusTrackingDto;
    tenantId: string;
    payload: ConnectTenantDto.IConnectTenantSetTopLevelOptionsRequestDto;
  }): Promise<ConnectTenantDto.IConnectTenantSetTopLevelOptionsRequestDto>;

  public abstract GetTenantTopLevelOptions(
    tracking: IColossusTrackingDto,
    tenantId: string
  ): Promise<ConnectTenantDto.IConnectTenantSetTopLevelOptionsRequestDto>;

  abstract SetProfilePicture(params: ISetProfilePictureOpts): Promise<void>;

  abstract UnsetProfilePicture(params: IUnsetProfilePictureOpts): Promise<void>;

  abstract SetInternalProfilePicture(
    params: ISetInternalProfilePictureOpts
  ): Promise<void>;

  abstract UnsetInternalProfilePicture(
    params: IUnsetInternalProfilePictureOpts
  ): Promise<void>;

  public abstract SetConnectPortfolioSummary(input: {
    tracking: IColossusTrackingDto;
    tenantRealm: string;
    connectPortfolioSummaryDto: Omit<
      ConnectPortfolioSummaryDto.IConnectPortfolioSummaryDto,
      'reviewed'
    >;
  }): Promise<void>;

  public abstract CreateAdvisorTenantWithInitialUserViaFusionAuth(
    tracking: IColossusTrackingDto,
    dto: ConnectAdvisorDto.IConnectAdvisorCreateRequestDto
  ): Promise<AuthenticationDto.IAuthenticationLoginResponseDto>;

  public abstract GetConnectAdvisorPreferences(
    requestId: string,
    userId: string,
    tenantId: string
  ): Promise<ConnectAdvisorDto.IConnectAdvisorPreferencesDto | null>;

  public abstract UpdateConnectAdvisorPreferences(
    requestId: string,
    input: ConnectAdvisorDto.IConnectAdvisorPreferencesMutableDto
  ): Promise<ConnectAdvisorDto.IConnectAdvisorPreferencesDto>;

  public abstract GetConnectLeads(
    requestId: string,
    input: ConnectLeadsDto.IConnectAdvisorLeadsRequestDto
  ): Promise<ConnectLeadsDto.IConnectLeadsDto>;

  public abstract GetLeadById(
    requestId: string,
    input: IAdvisorServiceGetLeadByIdParamDto
  ): Promise<ConnectLeadsDto.IConnectLeadsAdvisorDto>;

  public abstract UpdateLeadById(
    requestId: string,
    input: ConnectLeadsDto.IConnectLeadsAdvisorUpdateDto
  ): Promise<ConnectLeadsDto.IConnectLeadsAdvisorDto>;

  public abstract GetLeadSummaryById(
    requestId: string,
    input: IAdvisorServiceGetLeadByIdParamDto
  ): Promise<IGenericDataSummaryDto[]>;

  public abstract GetConnectInvestorLeads(
    requestId: string,
    input: ConnectLeadsDto.IConnectAdvisorLeadsRequestDto
  ): Promise<ConnectLeadsDto.IConnectLeadsDto>;

  public abstract GetConnectInvestorLeadById(
    requestId: string,
    input: IAdvisorServiceGetLeadByIdParamDto
  ): Promise<ConnectLeadsDto.IConnectLeadsAdvisorDto>;

  public abstract UpdateLeadInvestorReviewStatusByInvestorId(
    requestId: string,
    input: ConnectLeadsDto.IConnectLeadsAdvisorUpdateDto
  ): Promise<ConnectLeadsDto.IConnectLeadsAdvisorDto>;

  public abstract GetConnectInvestorLeadSummaryById(
    requestId: string,
    input: IAdvisorServiceGetLeadByIdParamDto
  ): Promise<IGenericDataSummaryDto[]>;
}
