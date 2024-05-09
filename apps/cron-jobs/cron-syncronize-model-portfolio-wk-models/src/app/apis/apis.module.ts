import { getWealthKernelConfiguration } from '@bambu/server-core/configuration';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApisService, ApisServiceBase } from './apis.service';

@Module({
  imports: [ConfigModule.forFeature(getWealthKernelConfiguration), HttpModule],
  providers: [
    {
      provide: ApisServiceBase,
      useClass: ApisService,
    },
  ],
  exports: [ApisServiceBase],
})
export class ApisModule {}
