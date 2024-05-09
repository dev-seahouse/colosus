import {
  BlobRepositoryModule,
  CentralDbRepositoryModule,
} from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { IamAdminModule } from '../iam';
import { OtpModule } from '../otp';
import { TenantBrandingService } from './tenant-branding.service';
import { TenantBrandingServiceBase } from './tenant-branding.service.base';

@Module({
  imports: [
    CentralDbRepositoryModule,
    OtpModule,
    IamAdminModule,
    BlobRepositoryModule,
  ],
  providers: [
    {
      provide: TenantBrandingServiceBase,
      useClass: TenantBrandingService,
    },
  ],
  exports: [TenantBrandingServiceBase],
})
export class TenantBrandingModule {}
