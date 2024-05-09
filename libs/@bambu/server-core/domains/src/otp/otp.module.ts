import { Module } from '@nestjs/common';

import { RepositoriesModule } from '@bambu/server-core/repositories';
import { OtpServiceBase } from './otp.service.base';
import { OtpService } from './otp.service';
import { ConfigModule } from '@nestjs/config';
import { getOtpConfiguration } from '@bambu/server-core/configuration';

@Module({
  imports: [RepositoriesModule, ConfigModule.forFeature(getOtpConfiguration)],
  providers: [
    {
      provide: OtpServiceBase,
      useClass: OtpService,
    },
  ],
  exports: [OtpServiceBase],
})
export class OtpModule {}
