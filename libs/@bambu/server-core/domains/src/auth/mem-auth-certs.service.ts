import { Injectable, Logger } from '@nestjs/common';
import { IamClientRepositoryServiceBase } from '@bambu/server-core/repositories';
import { AuthCertsService } from './auth-certs.service';
import { importJWK, KeyLike } from 'jose';

const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

@Injectable()
export class MemAuthCertsService extends AuthCertsService {
  readonly #logger = new Logger(MemAuthCertsService.name);
  readonly #cache = new Map<string, [number, [string, KeyLike | Uint8Array]]>();

  constructor(iamClientRepository: IamClientRepositoryServiceBase) {
    super(iamClientRepository);
  }

  async GetSigningKeyForRealm(
    realmId: string
  ): Promise<[string, KeyLike | Uint8Array]> {
    const logPrefix = `${this.GetSigningKeyForRealm.name} -`;
    const cached = this.#cache.get(realmId);
    if (cached && cached[0] < Date.now()) {
      return cached[1];
    }
    const key = await super.GetSigningKeyForRealm(realmId);
    this.#cache.set(realmId, [Date.now() + CACHE_TTL_MS, key]);
    return key;
  }
}
