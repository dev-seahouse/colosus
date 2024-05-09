import type { AuthenticationDto, ConnectAdvisorDto } from '@bambu/shared';

import createBambuAxiosInstance from '../../utils/createBambuAxiosInstance/createBambuAxiosInstance';
import refreshToken from '../../utils/refreshToken/refreshToken';

export type ConnectAdvisorLoginRequestDto =
  ConnectAdvisorDto.IConnectAdvisorLoginRequestDto;
export type ConnectAdvisorLoginResponseDto =
  AuthenticationDto.IAuthenticationLoginResponseDto;
export type ConnectAdvisorCreateAccountRequestDto =
  ConnectAdvisorDto.IConnectAdvisorCreateRequestDto;
export type ConnectAdvisorVerifyEmailRequestDto =
  ConnectAdvisorDto.IConnectAdvisorAccountInitialEmailVerificationRequestDto;

export type ConnectAdvisorResendOtpRequestDto = {
  email: string;
};

export type ConnectAdvisorSendResetPasswordEmailRequestDto =
  ConnectAdvisorDto.IConnectAdvisorSendResetPasswordEmailOtpRequestDto;

export type ConnectAdvisorChangePasswordRequestDto =
  ConnectAdvisorDto.IConnectAdvisorResetPasswordRequestDto;

export class ConnectAdvisorAuthApi {
  constructor(
    private readonly axios = createBambuAxiosInstance({
      extendedURL: '/api/v1/connect/advisor',
    })
  ) {}

  /**
   * Logs an advisor in on the Connect platform. It should perform the same action as the core /login endpoint, but with an inferred realmId.
   * - {@link http://localhost:9000/openapi#/Connect/Login}.
   */
  public async login(req: ConnectAdvisorLoginRequestDto) {
    return await this.axios.post<ConnectAdvisorLoginResponseDto>('/Login', req);
  }

  /**
   * Creates an advisor on the Connect platform.
   * In doing so, returns an access token and a refresh token, and sends an OTP to the advisor's email address.
   * The advisor must then verify their email address by calling the verify-email-initial endpoint before being given access to most endpoints.
   * - {@link http://localhost:9000/openapi#/Connect/Create}.
   */
  public async createAccount(req: ConnectAdvisorCreateAccountRequestDto) {
    return await this.axios.post<ConnectAdvisorLoginResponseDto>('', req);
  }

  /**
   * Enables a user account with an OTP that should have been sent to their email upon account creation.
   * If a refresh token is provided, and email is verified at the end of OTP verification, then new tokens will be returned.
   * - {@link http://localhost:9000/openapi#/Connect/VerifyEmailInitial}.
   */
  public async verifyEmailInitial(req: ConnectAdvisorVerifyEmailRequestDto) {
    const res = await this.axios.post('/verify-email-initial', req);
    // refresh token after email verification
    await refreshToken();
    return res;
  }

  /**
   * Resend an new OTP to the advisor's email address.
   * -{@link http://localhost:9000/openapi#/Connect%20Advisor/ConnectAdvisorController_ResendInitialVerificationOtp}
   */

  public async resendOtp(req: ConnectAdvisorResendOtpRequestDto) {
    const res = await this.axios.post('/initial-verification/resend-otp', req);
    return res;
  }

  /**
   * Sends an email to the given address (if an account exists with such an address) containing an link with token that is used to change the account's password.
   * -{@link http://localhost:9000/openapi#/Connect%20Advisor/SendChangePasswordEmailLink}
   */
  public async sendResetPasswordEmail({
    email,
  }: ConnectAdvisorSendResetPasswordEmailRequestDto) {
    return await this.axios.post('/change-password/send-link', { email });
  }

  /**
   * Changes the password of an advisor.
   * -{@link http://localhost:9000/openapi#/Connect%20Advisor/ChangePassword}
   */
  public async changePassword(req: ConnectAdvisorChangePasswordRequestDto) {
    return await this.axios.post('/change-password', req);
  }
}

export default ConnectAdvisorAuthApi;
