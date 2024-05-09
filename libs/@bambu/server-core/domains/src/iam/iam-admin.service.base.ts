import { IColossusTrackingDto } from '@bambu/server-core/dto';

export type IRoles = 'Vendor-Admin' | 'Vendee-Admin' | 'Advisor' | 'Investor';

export interface IIamAdminCreateUserDto {
  username: string;
  email: string;
  password: string;
  groups: IRoles[];
}
export interface IIamUserInformationDto {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  emailVerified: boolean;
  enabled: boolean;
}

export interface IChangePasswordByIdParams {
  realmId: string;
  userId: string;
  newPassword: string;
  tracking: IColossusTrackingDto;
  username: string;
}

// Note: implementations should expect an admin token primarily used to authorize realm admin operations, and use its own admin account to perform the operation if necessary.
export abstract class IamAdminServiceBase {
  // TODO

  abstract GetRealmUsers(): Promise<void>;

  abstract CreateInvestor(): Promise<void>;

  abstract CreateTenantRealmWithInitialUser(
    realmId: string,
    initialUser: Omit<IIamAdminCreateUserDto, 'groups'>
  ): Promise<void>;

  abstract GetRealmUser(
    realmId: string,
    userId: string
  ): Promise<IIamUserInformationDto>;

  abstract GetRealmUserByUsername(
    requestId: string,
    realmId: string,
    username: string
  ): Promise<IIamUserInformationDto>;

  // Note: this has to be in IamAdminService since we are externally verifying the user's email address
  abstract VerifyUserEmailById(
    requestId: string,
    realmId: string,
    userId: string
  ): Promise<void>;

  // Note: this has to be in IamAdminService since we are externally verifying the user's email address
  abstract ChangePasswordById(params: IChangePasswordByIdParams): Promise<void>;

  // TODO: the following methods and their uses should be replaced by corresponding methods in the IamAccountServiceBase that use the user's token to authorize the operation
  abstract SetUserPersonalNames(
    requestId: string,
    params: {
      realmId: string;
      userId: string;
      firstName: string;
      lastName: string;
    }
  ): Promise<void>;
}
