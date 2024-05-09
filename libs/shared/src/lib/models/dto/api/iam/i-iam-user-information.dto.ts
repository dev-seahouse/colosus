export interface IIamUserInformationDto {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  emailVerified: boolean;
  enabled: boolean;
}
