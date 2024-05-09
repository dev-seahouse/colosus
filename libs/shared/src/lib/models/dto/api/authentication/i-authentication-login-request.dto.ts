export interface IAuthenticationLoginRequestDto {
  username: string;
  password: string;
  realmId?: string;
  applicationId?: string;
}
