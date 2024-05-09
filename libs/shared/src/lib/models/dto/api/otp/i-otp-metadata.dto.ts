export enum EnumOtpMode {
  EMAIL = 'EMAIL',
}

/**
 * OtpPurposeDataMap is a map from purpose for sending an OTP to an object
 *   whose keys are the valid transports (e.g. email, sms, etc.)
 *   for that purpose and whose values are default additional parameters
 *   for generating/verifying an OTP for that (purpose, transport) combination.
 */
export const OtpPurposeDataMap = {
  INITIAL_EMAIL_VERIFICATION: {
    [EnumOtpMode.EMAIL]: {},
  },
  CHANGE_PASSWORD: {
    [EnumOtpMode.EMAIL]: { digits: 20 },
  },
  INVESTOR_TEMP_LOGIN: {
    [EnumOtpMode.EMAIL]: {},
  },
  INVESTOR_RESET_PASSWORD: {
    [EnumOtpMode.EMAIL]: {},
  },
  INVESTOR_UPDATE_DETAILS: {
    [EnumOtpMode.EMAIL]: {},
  },
  INVESTOR_SUBMIT_KYC: {
    [EnumOtpMode.EMAIL]: {},
  },
  INVESTOR_CHANGE_PHONE_NUMBER: {
    [EnumOtpMode.EMAIL]: {},
  },
  INVESTOR_CHANGE_EMAIL: {
    [EnumOtpMode.EMAIL]: {},
  },
  INVESTOR_CHANGE_PASSWORD: {
    [EnumOtpMode.EMAIL]: {},
  },
  INVESTOR_EMAIL_VERIFICATION: {
    [EnumOtpMode.EMAIL]: {},
  },
} as const;

export interface IOtpMetadataDto {
  tenantId: string;
  userId: string;
  purpose: keyof typeof OtpPurposeDataMap;
  mode: EnumOtpMode;
  ttlInSeconds: number;
  digits?: number;
}
