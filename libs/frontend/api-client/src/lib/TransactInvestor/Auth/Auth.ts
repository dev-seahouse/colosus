import type { AuthenticationDto } from '@bambu/shared';

import createBambuAxiosInstance from '../../utils/createBambuAxiosInstance/createBambuAxiosInstance';
/**
 ---- Pending BE ----
 * TransactInvestorVerifyEmailRequestDto
 * TransactInvestorResendOtpRequestDto
 * TransactInvestorSendResetPasswordEmailRequestDto
 * TransactInvestorChangePasswordRequestDto
 */

export type TransactInvestorLoginRequestDto =
  AuthenticationDto.IAuthenticationLoginRequestDto;
export type TransactInvestorLoginResponseDto =
  AuthenticationDto.IAuthenticationLoginResponseDto;

export interface TransactInvestorCreateAccountRequestDto {
  email: string;
  password: string;
}

export interface TransactInvestorValidateAccountRequestDto {
  otp: string;
  username: string;
}

export interface TransactInvestorResendOtpRequestDto {
  email: string;
}

export class TransactInvestorAuthApi {
  constructor(
    private readonly axios = createBambuAxiosInstance({
      extendedURL: '/api/v1/transact/investor',
    })
  ) {}

  /**
   * Logs an investor in on the Transact platform. It should perform the same action as the core /login endpoint, but with an inferred realmId.
   * - {@link http://localhost:9000/openapi#/Draft%20Transact%20Investor/Login}.
   */
  public async login(req: TransactInvestorLoginRequestDto) {
    return await this.axios.post<TransactInvestorLoginResponseDto>(
      '/Login',
      req
    );
  }

  /**
   * Convert lead to a platform user
   * - {@link http://localhost:9000/openapi#/Draft%20Transact%20Investor/TransactInvestorController_ConvertLeadToPlatformUser}.
   */
  public async createAccount(req: TransactInvestorCreateAccountRequestDto) {
    return await this.axios.post<TransactInvestorLoginResponseDto>(
      '/convert-to-platform-user',
      req
    );
  }

  /**
   * Validate the OTP for lead conversion
   * - {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_VerifyInvestorPlatformUserVerificationOtp}.
   */
  public async verifyAccount(req: TransactInvestorValidateAccountRequestDto) {
    return await this.axios.post<TransactInvestorValidateAccountRequestDto>(
      '/validate-conversion-otp',
      req
    );
  }

  /**
   * Resend OTP for lead conversion
   * - {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_ResendVerificationOtp}.
   */
  public async resendOtp(req: TransactInvestorResendOtpRequestDto) {
    return await this.axios.post<TransactInvestorResendOtpRequestDto>(
      '/resend-conversion-otp',
      req
    );
  }
}

export default TransactInvestorAuthApi;
