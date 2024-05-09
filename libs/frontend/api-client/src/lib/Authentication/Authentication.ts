import type { AuthenticationDto } from '@bambu/shared';
import createBambuAxiosInstance from '../utils/createBambuAxiosInstance/createBambuAxiosInstance';

export type AuthenticationRefreshTokenRequestDto =
  AuthenticationDto.IAuthenticationRefreshRequestDto;
export type AuthenticationRefreshTokenResponseDto =
  AuthenticationDto.IAuthenticationLoginResponseDto;

export class AuthenticationApi {
  constructor(
    private readonly axios = createBambuAxiosInstance({
      extendedURL: '/api/v1/auth',
    })
  ) {}

  public async refreshToken(req: AuthenticationRefreshTokenRequestDto) {
    return this.axios.post<AuthenticationRefreshTokenResponseDto>(
      '/refresh',
      req
    );
  }
}

export default AuthenticationApi;
