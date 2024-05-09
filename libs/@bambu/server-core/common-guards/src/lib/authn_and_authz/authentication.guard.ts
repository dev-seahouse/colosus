// import { IDefaultServerConfig } from '@bambu/server-core/configuration';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { JoseUtils, IamUtils } from '@bambu/server-core/utilities';
import { IamClientRepositoryServiceBase } from '@bambu/server-core/repositories';
import {
  AuthCertsServiceBase,
  FusionAuthAuthorizationServiceBase,
} from '@bambu/server-core/domains';
import type { Request } from 'express';

import { JWTPayload, jwtVerify, KeyLike } from 'jose';

type ColossusRequest = Request & {
  claims?: JWTPayload;
  claimsHeader?: Record<string, unknown>;
};

// import { ConfigService } from '@nestjs/config';

// This guard extracts a JWT bearer token if available and valid,
//   and allows only requests without a bearer field or with a valid JWT bearer token
//   hence, viz., bearer fields that are not JWT tokens, are improperly signed, are expired, are issued in the future, have a wrong issuer are rejected
@Injectable()
export class AuthenticationGuard implements CanActivate {
  readonly #logger = new Logger(AuthenticationGuard.name);
  constructor(
    private readonly fusionAuthAuthorizationService: FusionAuthAuthorizationServiceBase,
    private readonly iamClientRepository: IamClientRepositoryServiceBase,
    private readonly authCertsService: AuthCertsServiceBase
  ) {}

  async canActivate(context: ExecutionContext) {
    const logPrefix = `${this.canActivate.name} -`;
    // Note: we may need to further genericize this logic if we intend to start using RPC for microservice calls w/ authorization, and use this guard alongside it.
    const request = context.switchToHttp().getRequest<ColossusRequest>();

    const authorization = request.headers['authorization'] as
      | string
      | undefined;
    if (!authorization) {
      this.#logger.debug(`${logPrefix} - no bearer token provided.`);
      return true;
    }
    let claims: JWTPayload;
    let token: string;
    try {
      token = authorization.slice('Bearer '.length);
      claims = JoseUtils.parseArbitraryJWT(token);
    } catch (e) {
      this.#logger.debug(
        `${logPrefix} error parsing bearer token: '${authorization}, error: ${e}'`
      );
      return false;
    }
    if (!claims || !claims.iss) {
      return false;
    }
    let keycloakRealmId: string | undefined;
    try {
      keycloakRealmId = this.iamClientRepository.PredictRealmIdFromIssuer(
        claims.iss
      ); // may throw before assignment
    } catch (error) {
      if (error instanceof IamUtils.IamRealmUtilityProcessingError) {
        this.#logger.warn(`${logPrefix} - Error: ${error.message}.`);
      }
    }
    if (!keycloakRealmId) {
      this.#logger.debug(
        `${logPrefix} - detected fusion auth token ${JSON.stringify(claims)}.`
      );
      const valid = await this.fusionAuthAuthorizationService.Verify(token);
      if (!valid) {
        return false;
      }
      request.claims = claims;
      request.claims.realm = claims.applicationId;
      return true;
    }

    this.#logger.debug(
      `${logPrefix} - detected keycloak token ${JSON.stringify(claims)}.`
    );
    // This is a Keycloak token, and we verify it.
    let alg: string;
    let key: KeyLike | Uint8Array;
    try {
      keycloakRealmId = this.iamClientRepository.PredictRealmIdFromIssuer(
        claims.iss
      );
      [alg, key] = await this.authCertsService.GetSigningKeyForRealm(
        keycloakRealmId
      );
      if (!key) {
        this.#logger.debug(
          `${logPrefix} no signing key found for realm '${keycloakRealmId}'`
        );
        return false;
      }
    } catch (e) {
      this.#logger.debug(
        `${logPrefix} error trying to retrieve an appropriate key: ${e}`
      );
      return false;
    }

    try {
      const { protectedHeader, payload } = await jwtVerify(token, key, {
        algorithms: [alg],
      });
      request.claims = payload;
      request.claims.realm = keycloakRealmId;
      request.claims.roles =
        payload.roles || (payload.realm_access as { roles: unknown }).roles;
      request.claimsHeader = protectedHeader;
    } catch (e) {
      this.#logger.debug(
        `${logPrefix} token ${token} failed verification: ${e}`
      );
      return false;
    }
    return true;
  }
}
