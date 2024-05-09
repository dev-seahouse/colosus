import { Injectable, Logger } from '@nestjs/common';
import { IamClientRepositoryServiceBase } from '@bambu/server-core/repositories';
import { AuthCertsServiceBase } from './auth-certs.service.base';
import { importJWK, KeyLike } from 'jose';

@Injectable()
export class AuthCertsService implements AuthCertsServiceBase {
  readonly #logger = new Logger(AuthCertsService.name);

  constructor(
    private readonly iamClientRepository: IamClientRepositoryServiceBase
  ) {}

  async GetSigningKeyForRealm(
    realmId: string
  ): Promise<[string, KeyLike | Uint8Array]> {
    const logPrefix = `${this.GetSigningKeyForRealm.name} -`;
    const { keys } = await this.iamClientRepository.GetCerts(realmId);
    const signingKeys = await Promise.all(
      keys
        .filter(({ use }) => use === 'sig')
        .map(
          async (jwk): Promise<[string, KeyLike | Uint8Array]> => [
            jwk.alg,
            await importJWK(jwk),
          ]
        )
    );
    if (signingKeys.length === 0) {
      this.#logger.error(
        `${logPrefix} No signing keys found for realm ${realmId}.`
      );
      throw new Error('No signing keys found');
    } else if (signingKeys.length > 1) {
      this.#logger.debug(
        `${logPrefix} Found ${signingKeys.length} signing keys for realm ${realmId} but returning only the first.`
      );
    }
    return signingKeys[0];
  }
}
