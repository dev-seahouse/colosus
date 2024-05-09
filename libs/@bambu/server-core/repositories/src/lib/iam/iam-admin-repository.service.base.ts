import { IColossusTrackingDto } from '@bambu/server-core/dto';
import { IamDto } from '@bambu/shared';

export interface IChangePasswordByIdParams {
  realmId: string;
  userId: string;
  newPassword: string;
  tracking: IColossusTrackingDto;
}

export interface ISetUserPersonalNamesParams {
  realmId: string;
  userId: string;
  firstName: string;
  lastName: string;
}

// This repository models interactions with an IAM solution that are global.
//   Examples: Obtaining a list of multiple users, creating a new user, etc..
// This repository interacts with the Keycloak Admin REST API as an `admin` user of the `master` realm.
export abstract class IamAdminRepositoryServiceBase {
  // TODO: enforce contract that realmName is alphanumeric or '-' or '_' only, and must start with alphabet character.
  abstract CreateTenantRealm(realmId: string): Promise<void>;

  abstract CreateUser(
    realmId: string,
    user: IamDto.IIamAdminCreateUserDto
  ): Promise<void>;

  abstract GetRealmUser(
    realmId: string,
    userId: string
  ): Promise<IamDto.IIamUserInformationDto | undefined>;

  abstract GetRealmUserByUsername(
    requestId: string,
    realmId: string,
    username: string
  ): Promise<IamDto.IIamUserInformationDto | undefined>;

  abstract VerifyUserEmailById(realmId: string, userId: string): Promise<void>;

  abstract ChangePasswordById(params: IChangePasswordByIdParams): Promise<void>;

  // TODO: the following methods and their uses should be migrated to (using) IamClientRepositoryServiceBase as the action of an authenticated user on their own info if possible, which interacts with IAMs with fewer permissions.
  abstract SetUserPersonalNames(
    params: ISetUserPersonalNamesParams
  ): Promise<void>;

  public abstract AcquireAppropriateRealmId(realmId: string): Promise<string>;
}
