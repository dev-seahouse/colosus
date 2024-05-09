import type { AuthenticationDto } from '@bambu/shared';
import createBambuAxiosInstance from '../../utils/createBambuAxiosInstance/createBambuAxiosInstance';

export type CommonRefreshTokenRequestDto =
  AuthenticationDto.IAuthenticationRefreshRequestDto;

export class CommonAuthApi {
  private static axios = createBambuAxiosInstance({
    extendedURL: '/api/v1/auth',
  });

  public static async refreshToken(req: CommonRefreshTokenRequestDto) {
    return this.axios.post<AuthenticationDto.IAuthenticationLoginResponseDto>(
      '/refresh',
      req
    );
  }
}

export default CommonAuthApi;
