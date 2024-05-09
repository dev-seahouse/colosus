import {
  CentralDbRepositoryModule,
  FusionAuthIamRepositoryModule,
  IamRepositoryModule,
} from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthCertsService } from './auth-certs.service';
import { AuthCertsServiceBase } from './auth-certs.service.base';
import { AuthenticationService } from './authentication.service';
import { AuthenticationServiceBase } from './authentication.service.base';
import { FusionAuthAuthorizationServiceBase } from './fusion-auth-authorization.service.base';
import { FusionAuthAuthorizationService } from './fusion-auth-authorization.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    IamRepositoryModule,
    CentralDbRepositoryModule,
    FusionAuthIamRepositoryModule,
    ConfigModule,
    HttpModule,
  ],
  providers: [
    {
      provide: AuthenticationServiceBase,
      useClass: AuthenticationService,
    },
    {
      provide: AuthCertsServiceBase,
      // For Connect, we don't expect many users for each realm, so we shouldn't cache the certs
      useClass: AuthCertsService,
    },
    {
      provide: FusionAuthAuthorizationServiceBase,
      useClass: FusionAuthAuthorizationService,
    },
  ],
  exports: [
    AuthenticationServiceBase,
    AuthCertsServiceBase,
    FusionAuthAuthorizationServiceBase,
  ],
})
export class AuthenticationModule {}
