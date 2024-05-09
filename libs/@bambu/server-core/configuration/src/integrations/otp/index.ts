import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';

export interface IOtpConfigInternalDto {
  secret: string;
  connectAdvisorBaseUrl: string;
  otpEnabled: boolean;
  stubbedOtp: string | null;
}

export interface IOtpConfigDto {
  otp: IOtpConfigInternalDto;
}

export function getOtpConfiguration(): IOtpConfigDto {
  const secret = EnvironmentVariables.getEnvVariableAsString({
    fieldName: 'OTP_SECRET',
    defaultValue: 'i-am-colossus',
  });
  const connectAdvisorBaseUrl = EnvironmentVariables.getEnvVariableAsString({
    fieldName: 'CONNECT_ADVISOR_BASE_URL',
    defaultValue: 'http://127.0.0.1:4200',
  });
  const otpEnabled = EnvironmentVariables.getEnvVariableAsBoolean({
    fieldName: 'OTP_ENABLED',
    defaultValue: 1,
  });

  const otp: IOtpConfigInternalDto = {
    secret,
    otpEnabled,
    connectAdvisorBaseUrl,
    stubbedOtp: process.env.OTP_STUB ?? null,
  };

  return {
    otp,
  } as IOtpConfigDto;
}
