import { RepositoriesModule } from '@bambu/server-core/repositories';
import { BambuEventEmitterModule } from '@bambu/server-core/utilities';
import { Module } from '@nestjs/common';
import { IamAdminModule } from '../iam';
import { OtpModule } from '../otp';
import { TenantService } from './tenant.service';
import { TenantServiceBase } from './tenant.service.base';

@Module({
  imports: [
    RepositoriesModule,
    OtpModule,
    IamAdminModule,
    BambuEventEmitterModule,
  ],
  providers: [
    {
      provide: TenantServiceBase,
      useClass: TenantService,
    },
  ],
  exports: [TenantServiceBase],
})
export class TenantModule {}
