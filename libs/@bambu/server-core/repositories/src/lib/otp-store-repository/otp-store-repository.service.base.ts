import { OtpDto } from '@bambu/shared';

// This repository models database/memory cache interfaces for OTPs that are generated and issued.
export abstract class OtpStoreRepositoryServiceBase {
  /**
   * Invalidate all unused, unexpired OTPs for the given user and purpose, then registers a new OTP with the provided code.
   */
  abstract InvalidateOtpsThenRegisterOtp(otp: OtpDto.IOtpDto): Promise<void>;

  /**
   * This method verifies an OTP. If the OTP is valid, it is immediately used and cannot be used again.
   * There may be a small window (not in the current implementation at the time of writing) where
   * a race condition allows the OTP to be used twice. At the time of writing, there is also another place
   * where some sort of verification is performed, which is the typical stateless TOTP verification.
   */
  abstract VerifyOtp(params: OtpDto.IOtpDto): Promise<boolean>;

  public abstract InvalidateOtpsThenRegisterOtpForInvestorPlatformUser(
    requestId: string,
    { otp, tenantId, userId, purpose, mode, ttlInSeconds }: OtpDto.IOtpDto
  ): Promise<void>;

  public abstract PendingOtpIsPresent(
    requestId: string,
    tenantId: string,
    userId: string,
    purpose: keyof typeof OtpDto.OtpPurposeDataMap
  ): Promise<boolean>;
}
