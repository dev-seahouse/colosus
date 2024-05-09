import { IDefaultServerConfig } from '@bambu/server-core/configuration';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

/**
 * The ExtractOriginGuard abuses the power of guards to override the origin
 * header in development mode, if a certain query parameter is provided.
 */
@Injectable()
export class ExtractOriginGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService<IDefaultServerConfig>
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    request.headers['extracted-origin'] = request.headers['origin'];
    const env = this.configService.get('env', { infer: true });
    if (env === 'development' && request.headers['origin-override']) {
      request.headers['extracted-origin'] = request.headers['origin-override'];
    }
    return Boolean(request.headers['extracted-origin']);
  }
}
