import {
  getDefaultServerConfiguration,
  getKeycloakConfiguration,
  getKeycloakFusionAuthSwitchoverConfiguration,
} from '@bambu/server-core/configuration';
import { CentralDbPrismaModule } from '@bambu/server-core/db/central-db';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IamAdminRepositoryServiceBase } from './iam-admin-repository.service.base';
import { IamClientRepositoryServiceBase } from './iam-client-repository.service.base';
import { KeycloakIamAdminRepositoryService } from './keycloak-iam-admin-repository-with-initialization.service';
import { KeycloakIamClientRepositoryService } from './keycloak-iam-client-repository.service';

@Module({
  imports: [
    ConfigModule.forFeature(getDefaultServerConfiguration),
    ConfigModule.forFeature(getKeycloakConfiguration),
    ConfigModule.forFeature(getKeycloakFusionAuthSwitchoverConfiguration),
    HttpModule,
    CentralDbPrismaModule,
  ],
  providers: [
    {
      provide: IamAdminRepositoryServiceBase,
      useClass: KeycloakIamAdminRepositoryService,
    },
    {
      provide: IamClientRepositoryServiceBase,
      useClass: KeycloakIamClientRepositoryService,
    },
  ],
  exports: [IamAdminRepositoryServiceBase, IamClientRepositoryServiceBase],
})
export class IamRepositoryModule {}
