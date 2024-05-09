import { OtpDto } from '@bambu/shared';

export interface IInvestorLoginVerificationTemplateParametersDto {
  logoUrl: string | null;
  headerBgColor: string;
  brandColor: string;
  supportEmail: string;
  timeoutInMinutes: number;
  accountSelfDestructInHours: number;
  tradeName: string;
  otpGroupedDigits: string[];
}

export interface IGenericEmailGenerationTemplateResponseDto {
  ejsTemplate: string;
  ejsParameters: Record<string, unknown>;
}

// export type TemplateInputDto = IInvestorLoginVerificationTemplateParametersDto;

export interface IInvestorPlatformOtpSendRequestDto {
  tenantId: string;
  investorPlatformUserId: string;
  purpose: keyof typeof OtpDto.OtpPurposeDataMap;
  mode: OtpDto.EnumOtpMode;
  email?: string;
  digits?: number;
  // templateInput: TemplateInputDto;
}
