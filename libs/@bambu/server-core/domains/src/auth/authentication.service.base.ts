export interface IAuthenticationLoginRequestDto {
  username: string;
  password: string;
  realmId?: string;
  applicationId?: string;
}
export interface IAuthenticationLoginResponseDto {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
}

export abstract class AuthenticationServiceBase {
  abstract GuestLogin(): Promise<IAuthenticationLoginResponseDto>;

  abstract Login(
    requestId: string,
    credentials: IAuthenticationLoginRequestDto
  ): Promise<IAuthenticationLoginResponseDto>;

  public abstract RefreshJwtToken(
    requestId: string,
    refreshToken: string,
    tenantId?: string
  ): Promise<IAuthenticationLoginResponseDto>;
}
