import { AuthenticationDto, ICertsResponseDto } from '@bambu/shared';

// This repository models interactions with an IAM solution that are limited to the administration of a user's own identity.
//   Examples: exchanging credentials, changing one's own password, changing or obtaining one's own personal information, etc..
export abstract class IamClientRepositoryServiceBase {
  abstract PredictRealmIdFromIssuer(issuer: string): string;
  abstract GuestLogin(): Promise<AuthenticationDto.IAuthenticationLoginResponseDto>;
  abstract Login(
    requestId: string,
    credentials: AuthenticationDto.IAuthenticationLoginRequestDto
  ): Promise<AuthenticationDto.IAuthenticationLoginResponseDto>;
  abstract Refresh(
    refreshToken: string
  ): Promise<AuthenticationDto.IAuthenticationLoginResponseDto>;
  abstract GetCerts(realmId: string): Promise<ICertsResponseDto>;
}
