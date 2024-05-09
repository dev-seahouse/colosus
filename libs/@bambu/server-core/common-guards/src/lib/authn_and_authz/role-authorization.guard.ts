// import { IDefaultServerConfig } from '@bambu/server-core/configuration';
import { IServerCoreIamClaimsDto } from '@bambu/server-core/dto';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ALLOW_EMAIL_UNVERIFIED_KEY } from './allow-unverified-email.decorator';
import { AUTHENTICATED_KEY } from './authenticated.decorator';
import { PUBLIC_KEY } from './public.decorator';
import { ROLES_KEY } from './roles.decorator';

// This guard inspects the `request.claims` field as well as the
@Injectable()
export class RoleAuthorizationGuard implements CanActivate {
  readonly #logger = new Logger(RoleAuthorizationGuard.name);
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const logPrefix = `${this.canActivate.name} -`;
    // Note: we may need to further genericize this logic if we intend to start using RPC for microservice calls w/ authorization, and use this guard alongside it.
    const request = context.switchToHttp().getRequest<Request>();
    this.#logger.debug(`${logPrefix} - ${JSON.stringify(request['claims'])}`);
    // TODO: write a schema for roles' location in the tokens
    const claims: IServerCoreIamClaimsDto | undefined = request['claims'];
    const roles: string[] | undefined = claims?.roles;
    const contextHandler = context.getHandler();
    const contextClass = context.getClass();
    const forceEmailIsVerified =
      (Boolean(claims) &&
        this.reflector.get<boolean>(
          ALLOW_EMAIL_UNVERIFIED_KEY,
          contextHandler
        )) ||
      this.reflector.get<boolean>(ALLOW_EMAIL_UNVERIFIED_KEY, contextClass);
    const email_verified: boolean | undefined =
      forceEmailIsVerified || claims?.email_verified;
    this.#logger.debug(`${logPrefix} roles: ${roles}`);
    const checkRoles = (anyRequiredRole: string[]) => {
      if (!roles) {
        return false;
      }
      return anyRequiredRole.some((requiredRole) =>
        roles.includes(requiredRole)
      );
    };

    // Handle @Roles
    const anyRequiredRoleHandler = this.reflector.get<string[] | undefined>(
      ROLES_KEY,
      context.getHandler()
    );
    if (anyRequiredRoleHandler) {
      return checkRoles(anyRequiredRoleHandler) && email_verified;
    }
    if (this.reflector.get(AUTHENTICATED_KEY, contextHandler)) {
      return email_verified;
    }
    if (this.reflector.get(PUBLIC_KEY, contextHandler)) {
      return true;
    }
    const anyRequiredRoleClass = this.reflector.get<string[] | undefined>(
      ROLES_KEY,
      contextClass
    );
    if (anyRequiredRoleClass) {
      return checkRoles(anyRequiredRoleClass) && email_verified;
    }
    if (this.reflector.get(AUTHENTICATED_KEY, contextClass)) {
      return email_verified;
    }
    if (this.reflector.get(PUBLIC_KEY, contextClass)) {
      return true;
    }

    this.#logger.debug(
      `${logPrefix} handler ${context.getHandler().name} of ${
        context.getClass().name
      } is not annotated with @Roles(...), @Authenticated(), or @Public(). This attempt to access the resource is rejected by default.`
    );
    return false;
  }
}
