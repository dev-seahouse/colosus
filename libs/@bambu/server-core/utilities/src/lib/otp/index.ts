import { totp } from 'otplib';

import { OtpDto } from '@bambu/shared';

export const generateOtp = (
  {
    tenantId,
    userId,
    purpose,
    mode,
    ttlInSeconds,
    digits,
  }: OtpDto.IOtpMetadataDto,
  secret: string
) => {
  // authenticator should be deterministic given the same options
  totp.options = {
    step: 30,
    window: Math.ceil(ttlInSeconds / 30),
    digits: digits ?? 6,
  };
  const secretKey = `${tenantId}:${userId}:${purpose}:${mode}:${secret}`;
  return totp.generate(secretKey);
};

export const verifyOtp = (
  {
    tenantId,
    userId,
    purpose,
    mode,
    ttlInSeconds,
    otp,
    digits,
  }: OtpDto.IOtpDto,
  secret: string
) => {
  totp.options = {
    step: 30,
    window: Math.ceil(ttlInSeconds / 30),
    digits: digits ?? 6,
  };
  const secretKey = `${tenantId}:${userId}:${purpose}:${mode}:${secret}`;
  return totp.check(otp, secretKey);
};
