import { IOtpConfigDto } from '@bambu/server-core/configuration';
import {
  IColossusTrackingDto,
  TransactInvestorDto,
} from '@bambu/server-core/dto';
import {
  NotificationRepositoryServiceBase,
  NotificationTemplateChannelEnum,
  NotificationTemplatesRepositoryServiceBase,
  NotificationTypeEnum,
  OtpStoreRepositoryServiceBase,
  TemplateNameEnum,
  TenantCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
  OtpUtils,
} from '@bambu/server-core/utilities';
import { OtpDto, TenantBrandingDto as ITenantBrandingDto } from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IOtpSendRequestDto,
  IOtpVerifyRequestDto,
  OtpServiceBase,
} from './otp.service.base';

// This should be replaced with TTLs managed in DBs, and then also that tenants can configure their own TTLs for some purposes for investors.
const TEMPORARY_BAMBU_TTL_IN_SECONDS = 60 * 5;

enum SHARED_ERROR_MESSAGES {
  NO_EMAIL_PROVIDED_ERROR_MESSAGE = 'No email for user found. Unable to send OTP.',
  OTP_STUB_MISCONFIGURED_ERROR_MESSAGE = 'OTP is not enabled, and no stubbed OTP is provided.',
}

@Injectable()
export class OtpService implements OtpServiceBase {
  readonly #logger = new Logger(OtpService.name);
  readonly #secret: string;
  readonly #connectAdvisorBaseUrl: string;
  readonly #otpEnabled: boolean;
  readonly #stubbedOtp: string | null;

  constructor(
    private readonly otpRepository: OtpStoreRepositoryServiceBase,
    private readonly otpConfig: ConfigService<IOtpConfigDto>,
    private readonly notificationTemplatesRepository: NotificationTemplatesRepositoryServiceBase,
    private readonly notificationRepository: NotificationRepositoryServiceBase,
    private readonly tenantCentralDb: TenantCentralDbRepositoryService
  ) {
    const fullConfig = this.otpConfig.getOrThrow('otp', { infer: true });

    const { otpEnabled, secret, connectAdvisorBaseUrl, stubbedOtp } =
      fullConfig;

    this.#logger.debug(`OTP config: ${JsonUtils.Stringify(fullConfig)}`);

    this.#secret = secret;
    this.#connectAdvisorBaseUrl = connectAdvisorBaseUrl;
    this.#otpEnabled = otpEnabled;
    this.#stubbedOtp = stubbedOtp;
  }

  async SendOtp(
    otpSendRequest: IOtpSendRequestDto,
    tracking?: IColossusTrackingDto
  ): Promise<void> {
    const logPrefix = `${this.SendOtp.name} -`;
    try {
      const requestId =
        tracking && tracking.requestId ? tracking.requestId : 'N/A';
      const defaultMetadata =
        OtpDto.OtpPurposeDataMap[otpSendRequest.purpose][otpSendRequest.mode];
      if (!defaultMetadata) {
        throw new ErrorUtils.ColossusError(
          `No default metadata found for ${otpSendRequest.purpose} and ${otpSendRequest.mode}. It is likely an invalid mode for that purpose.`,
          tracking?.requestId,
          {},
          500
        );
      }
      this.guardAgainstInvalidStubOtpConfig(
        logPrefix,
        requestId,
        otpSendRequest
      );
      this.guardAgainstMissingEmailInput(logPrefix, requestId, otpSendRequest);

      const otpMetadata = {
        ...defaultMetadata,
        ...otpSendRequest,
        ttlInSeconds: TEMPORARY_BAMBU_TTL_IN_SECONDS,
      };

      this.#logger.debug(`OTP Metadata: ${JsonUtils.Stringify(otpMetadata)}.`);

      const otp: string = !this.#otpEnabled
        ? this.#stubbedOtp
        : OtpUtils.generateOtp(otpMetadata, this.#secret);

      await this.otpRepository.InvalidateOtpsThenRegisterOtp({
        ...otpMetadata,
        otp,
      });
      // TODO: fold logic in this switch construct into OtpPurposeDataMap
      switch (otpSendRequest.purpose) {
        case 'INITIAL_EMAIL_VERIFICATION':
          if (otpSendRequest.mode === OtpDto.EnumOtpMode.EMAIL) {
            await this.notificationRepository.NotifyUser({
              body: await this.#getInitialEmailVerificationOtpEmailTemplate(
                TEMPORARY_BAMBU_TTL_IN_SECONDS,
                otp
              ),
              type: NotificationTypeEnum.EMAIL,
              to: otpSendRequest.email,
              subject: 'Verify your login',
            });
          }
          break;
        case 'CHANGE_PASSWORD':
          if (otpSendRequest.mode === OtpDto.EnumOtpMode.EMAIL) {
            await this.notificationRepository.NotifyUser({
              body: await this.#getResetPasswordOtpEmailTemplate(
                TEMPORARY_BAMBU_TTL_IN_SECONDS,
                otp,
                otpSendRequest.email
              ),
              type: NotificationTypeEnum.EMAIL,
              to: otpSendRequest.email,
              subject: 'Reset your password',
            });
          }
          break;
        default:
          // noinspection ExceptionCaughtLocallyJS
          throw new ErrorUtils.ColossusError(
            'Invalid OTP purpose.',
            tracking?.requestId || 'N/A',
            {
              otpSendRequest,
            }
          );
      }
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error sending OTP: ${JsonUtils.Stringify(error)}.`
      );
      throw error;
    }
  }

  async #getResetPasswordOtpEmailTemplate(
    timeout: number,
    otp: string,
    email: string
  ) {
    const timeoutAsMinutes = timeout / 60;

    const url = `${
      this.#connectAdvisorBaseUrl
    }/reset-password-update?username=${encodeURIComponent(
      email
    )}&otp=${encodeURIComponent(otp)}`;
    return await this.notificationTemplatesRepository.GenerateTemplatedMessage({
      channel: NotificationTemplateChannelEnum.EMAIL,
      templateName: TemplateNameEnum.RESET_PASSWORD_OTP,
      parameters: {
        url,
        timeout: timeoutAsMinutes,
      },
    });
  }

  async #getInitialEmailVerificationOtpEmailTemplate(
    timeout: number,
    otp: string,
    supportEmail = 'support@bambu.co'
  ): Promise<string> {
    const timeoutAsMinutes = timeout / 60;
    // note that these group from the start, not the end. This shouldn't be an issue
    const otpGroupedDigits = otp.match(/.{1,3}/g) ?? [];

    return await this.notificationTemplatesRepository.GenerateTemplatedMessage({
      channel: NotificationTemplateChannelEnum.EMAIL,
      templateName: TemplateNameEnum.VERIFY_LOGIN_OTP,
      parameters: {
        otpGroupedDigits,
        supportEmail,
        timeout: timeoutAsMinutes,
      },
    });
  }

  async VerifyOtp(
    otpVerifyRequest: IOtpVerifyRequestDto,
    tracking?: IColossusTrackingDto
  ): Promise<boolean> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.VerifyOtp.name,
      tracking?.requestId
    );

    try {
      if (!this.#otpEnabled && otpVerifyRequest.otp === this.#stubbedOtp) {
        return true;
      }
      const defaultMetadata = this.ensureDefaultMetadataForOtpVerification(
        tracking?.requestId,
        otpVerifyRequest
      );

      const otp = {
        ...defaultMetadata,
        ...otpVerifyRequest,
        ttlInSeconds: TEMPORARY_BAMBU_TTL_IN_SECONDS,
      };

      if (!OtpUtils.verifyOtp(otp, this.#secret)) {
        this.#logger.debug(
          `${logPrefix} OTP ${otp.otp} failed totp verification`
        );
        return false;
      }
      if (await this.otpRepository.VerifyOtp(otp)) {
        return true;
      }
      this.#logger.debug(
        `${logPrefix} OTP ${otp.otp} failed to verify in database`
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error verifying OTP: ${JsonUtils.Stringify(error)}`
      );
      throw error;
    }
  }

  public async SendInvestorPlatformOtp(
    tracking: IColossusTrackingDto,
    otpSendRequest: TransactInvestorDto.IInvestorPlatformOtpSendRequestDto
  ): Promise<void> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.SendInvestorPlatformOtp.name,
      requestId
    );
    const defaultMetadata =
      OtpDto.OtpPurposeDataMap[otpSendRequest.purpose][otpSendRequest.mode];
    if (!defaultMetadata) {
      throw new ErrorUtils.ColossusError(
        `No default metadata found for ${otpSendRequest.purpose} and ${otpSendRequest.mode}. It is likely an invalid mode for that purpose.`,
        tracking?.requestId,
        {},
        500
      );
    }
    try {
      this.guardAgainstInvalidStubOtpConfig(
        logPrefix,
        requestId,
        otpSendRequest
      );
      this.guardAgainstMissingEmailInput(logPrefix, requestId, otpSendRequest);
      const otpMetadata = {
        ...defaultMetadata,
        ...otpSendRequest,
        ttlInSeconds: TEMPORARY_BAMBU_TTL_IN_SECONDS,
        userId: otpSendRequest.investorPlatformUserId,
      };
      this.#logger.debug(
        `Investor platform OTP Metadata: ${JsonUtils.Stringify(otpMetadata)}.`
      );
      const otp: string = !this.#otpEnabled
        ? this.#stubbedOtp
        : OtpUtils.generateOtp(otpMetadata, this.#secret);
      await this.otpRepository.InvalidateOtpsThenRegisterOtpForInvestorPlatformUser(
        requestId,
        {
          ...otpMetadata,
          otp,
        }
      );
      if (
        otpSendRequest.purpose === 'INVESTOR_EMAIL_VERIFICATION' &&
        otpSendRequest.mode === OtpDto.EnumOtpMode.EMAIL
      ) {
        await this.notificationRepository.NotifyUser({
          body: await this.getInvestorPlatformOtpEmailTemplate(
            otpMetadata.tenantId,
            TEMPORARY_BAMBU_TTL_IN_SECONDS,
            otp
          ),
          type: NotificationTypeEnum.EMAIL,
          to: otpSendRequest.email,
          subject: 'Please verify your account',
        });
        return;
      }
      // noinspection ExceptionCaughtLocallyJS
      throw new ErrorUtils.ColossusError('Unsupported OTP request', requestId, {
        otpSendRequest,
        otpMetadata,
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error sending OTP: ${JsonUtils.Stringify(error)}.`
      );
      throw error;
    }
  }

  private guardAgainstMissingEmailInput(
    logPrefix: string,
    requestId: string,
    metadata:
      | IOtpSendRequestDto
      | TransactInvestorDto.IInvestorPlatformOtpSendRequestDto
  ): void {
    if (metadata.mode === OtpDto.EnumOtpMode.EMAIL && !metadata.email) {
      const errorMessage =
        SHARED_ERROR_MESSAGES.NO_EMAIL_PROVIDED_ERROR_MESSAGE;

      this.#logger.error(`${logPrefix} ${errorMessage}`);

      throw new ErrorUtils.ColossusError(
        errorMessage,
        requestId,
        {
          otpSendRequest: metadata,
        },
        400
      );
    }
  }

  private guardAgainstInvalidStubOtpConfig(
    logPrefix: string,
    requestId: string,
    metadata: unknown
  ): void {
    if (!this.#stubbedOtp && !this.#otpEnabled) {
      this.#logger.error(
        `${logPrefix} ${SHARED_ERROR_MESSAGES.OTP_STUB_MISCONFIGURED_ERROR_MESSAGE}`
      );

      throw new ErrorUtils.ColossusError(
        SHARED_ERROR_MESSAGES.OTP_STUB_MISCONFIGURED_ERROR_MESSAGE,
        requestId,
        metadata,
        500
      );
    }
  }

  private async getInvestorPlatformOtpEmailTemplate(
    tenantId: string,
    timeout: number,
    otp: string,
    accountSelfDestructInHours = 48,
    supportEmail = 'support@bambu.co'
  ) {
    const tenant = await this.tenantCentralDb.FindTenantById(tenantId);

    /**
     * TODO: Consolidate this with lead upsert.
     */
    const branding = {
      logoUrl: tenant?.branding?.branding?.logoUrl || null,
      brandColor: tenant?.branding?.branding?.brandColor || '#62DBB6',
      tradeName: tenant?.branding?.branding?.tradeName,
      headerBgColor: tenant?.branding?.branding?.headerBgColor || '#F2F2F2',
    } as ITenantBrandingDto.ITenantBrandingDto;

    const timeoutAsMinutes = timeout / 60;
    // note that these group from the start, not the end. This shouldn't be an issue
    const otpGroupedDigits = otp.match(/.{1,3}/g) ?? [];

    const parameters: TransactInvestorDto.IInvestorLoginVerificationTemplateParametersDto =
      {
        accountSelfDestructInHours,
        brandColor: branding.brandColor,
        supportEmail,
        headerBgColor: branding.headerBgColor,
        logoUrl: branding.logoUrl,
        tradeName: branding.tradeName,
        timeoutInMinutes: timeoutAsMinutes,
        otpGroupedDigits,
      };

    return await this.notificationTemplatesRepository.GenerateTemplatedMessage({
      channel: NotificationTemplateChannelEnum.EMAIL,
      templateName: TemplateNameEnum.INVESTOR_LOGIN_VERIFICATION_OTP,
      parameters,
    });
  }

  public async PendingOtpIsPresent(
    requestId: string,
    tenantId: string,
    userId: string,
    purpose: keyof typeof OtpDto.OtpPurposeDataMap
  ): Promise<boolean> {
    return await this.otpRepository.PendingOtpIsPresent(
      requestId,
      tenantId,
      userId,
      purpose
    );
  }

  public async VerifyInvestorPlatformOtp(
    tracking: IColossusTrackingDto,
    otpVerifyRequest: IOtpVerifyRequestDto
  ): Promise<boolean> {
    const { requestId } = tracking;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.VerifyInvestorPlatformOtp.name,
      requestId
    );
    try {
      if (!this.#otpEnabled && otpVerifyRequest.otp === this.#stubbedOtp) {
        return true;
      }
      const defaultMetadata = this.ensureDefaultMetadataForOtpVerification(
        requestId,
        otpVerifyRequest
      );
      const otp = {
        ...defaultMetadata,
        ...otpVerifyRequest,
        ttlInSeconds: TEMPORARY_BAMBU_TTL_IN_SECONDS,
      };
      if (!OtpUtils.verifyOtp(otp, this.#secret)) {
        this.#logger.debug(
          `${logPrefix} OTP ${otp.otp} failed totp verification`
        );
        return false;
      }
      return await this.otpRepository.VerifyOtp(otp);
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error verifying OTP: ${JsonUtils.Stringify(error)}`
      );
      throw error;
    }
  }

  private ensureDefaultMetadataForOtpVerification(
    requestId: string,
    otpVerifyRequest: IOtpVerifyRequestDto
  ) {
    const defaultMetadata =
      OtpDto.OtpPurposeDataMap[otpVerifyRequest.purpose][otpVerifyRequest.mode];
    if (!defaultMetadata) {
      throw new ErrorUtils.ColossusError(
        `No default metadata found for ${String(
          otpVerifyRequest.purpose
        )} and ${
          otpVerifyRequest.mode
        }. It is likely an invalid mode for that purpose`,
        requestId,
        {},
        500
      );
    }

    return defaultMetadata;
  }
}
