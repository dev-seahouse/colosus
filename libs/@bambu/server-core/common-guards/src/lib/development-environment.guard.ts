import { IDefaultServerConfig } from '@bambu/server-core/configuration';
import { Injectable, CanActivate } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DevelopmentEnvironmentGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService<IDefaultServerConfig>
  ) {}

  canActivate(): boolean {
    const env = this.configService.get('env', { infer: true });
    return env === 'development';
  }
}
