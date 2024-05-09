import {
  IColossusTrackingDto,
  TransactInvestorDto,
} from '@bambu/server-core/dto';
import { OtpDto } from '@bambu/shared';

export interface IOtpMetadataDto {
  tenantId: string;
  userId: string;
  purpose: keyof typeof OtpDto.OtpPurposeDataMap;
  mode: OtpDto.EnumOtpMode;
  ttlInSeconds: number;
  digits?: number;
}

export interface IOtpSendRequestDto {
  tenantId: string;
  userId: string;
  purpose: keyof typeof OtpDto.OtpPurposeDataMap;
  mode: OtpDto.EnumOtpMode;
  email?: string;
  digits?: number;
}

export interface IOtpVerifyRequestDto {
  tenantId: string;
  userId: string;
  otp: string;
  purpose: keyof typeof OtpDto.OtpPurposeDataMap;
  mode: OtpDto.EnumOtpMode;
}

export abstract class OtpServiceBase {
  abstract SendOtp(
    params: IOtpSendRequestDto,
    tracking?: IColossusTrackingDto
  ): Promise<void>;

  abstract VerifyOtp(
    params: IOtpVerifyRequestDto,
    tracking?: IColossusTrackingDto
  ): Promise<boolean>;

  public abstract SendInvestorPlatformOtp(
    tracking: IColossusTrackingDto,
    otpSendRequest: TransactInvestorDto.IInvestorPlatformOtpSendRequestDto
  ): Promise<void>;

  public abstract PendingOtpIsPresent(
    requestId: string,
    tenantId: string,
    userId: string,
    purpose: keyof typeof OtpDto.OtpPurposeDataMap
  ): Promise<boolean>;

  public abstract VerifyInvestorPlatformOtp(
    tracking: IColossusTrackingDto,
    otpVerifyRequest: IOtpVerifyRequestDto
  ): Promise<boolean>;
}
