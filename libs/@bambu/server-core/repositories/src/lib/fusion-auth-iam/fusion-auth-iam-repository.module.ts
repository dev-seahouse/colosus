import { getFusionAuthConfiguration } from '@bambu/server-core/configuration';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  FusionAuthIamApplicationRepositoryService,
  FusionAuthIamApplicationRepositoryServiceBase,
} from './fusion-auth-iam-application-repository.service';
import {
  FusionAuthIamGroupRepositoryService,
  FusionAuthIamGroupRepositoryServiceBase,
} from './fusion-auth-iam-group-repository.service';
import {
  FusionAuthIamLoginRepositoryService,
  FusionAuthIamLoginRepositoryServiceBase,
} from './fusion-auth-iam-login-repository.service';
import {
  FusionAuthIamTenantRepositoryService,
  FusionAuthIamTenantRepositoryServiceBase,
} from './fusion-auth-iam-tenant-repository.service';
import {
  FusionAuthIamUserRepositoryService,
  FusionAuthIamUserRepositoryServiceBase,
} from './fusion-auth-iam-user-repository.service';
import {
  FusionAuthIamVerifyRepositoryServiceBase,
  FusionAuthIamVerifyRepositoryService,
} from './fusion-auth-iam-verify-repository.service';

@Module({
  imports: [ConfigModule.forFeature(getFusionAuthConfiguration), HttpModule],
  providers: [
    {
      provide: FusionAuthIamTenantRepositoryServiceBase,
      useClass: FusionAuthIamTenantRepositoryService,
    },
    {
      provide: FusionAuthIamApplicationRepositoryServiceBase,
      useClass: FusionAuthIamApplicationRepositoryService,
    },
    {
      provide: FusionAuthIamGroupRepositoryServiceBase,
      useClass: FusionAuthIamGroupRepositoryService,
    },
    {
      provide: FusionAuthIamUserRepositoryServiceBase,
      useClass: FusionAuthIamUserRepositoryService,
    },
    {
      provide: FusionAuthIamLoginRepositoryServiceBase,
      useClass: FusionAuthIamLoginRepositoryService,
    },
    {
      provide: FusionAuthIamVerifyRepositoryServiceBase,
      useClass: FusionAuthIamVerifyRepositoryService,
    },
    {
      provide: FusionAuthIamVerifyRepositoryService,
      useClass: FusionAuthIamVerifyRepositoryService,
    },
  ],
  exports: [
    FusionAuthIamTenantRepositoryServiceBase,
    FusionAuthIamApplicationRepositoryServiceBase,
    FusionAuthIamGroupRepositoryServiceBase,
    FusionAuthIamUserRepositoryServiceBase,
    FusionAuthIamLoginRepositoryServiceBase,
    FusionAuthIamVerifyRepositoryServiceBase,
    FusionAuthIamVerifyRepositoryService,
  ],
})
export class FusionAuthIamRepositoryModule {}
