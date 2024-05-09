import { KeyLike } from 'jose';

export abstract class AuthCertsServiceBase {
  abstract GetSigningKeyForRealm(
    realmId: string
  ): Promise<[string, KeyLike | Uint8Array]>;
}
