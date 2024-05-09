export abstract class IamAccountServiceBase {
  abstract ChangePassword(accountToken: string): Promise<void>;
}
