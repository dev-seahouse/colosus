import { getWealthKernelConfiguration } from '@bambu/server-core/configuration';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  WealthKernelConnectorApisService,
  WealthKernelConnectorApisServiceBase,
} from './wealth-kernel-connector-apis.service';

@Module({
  imports: [ConfigModule.forFeature(getWealthKernelConfiguration), HttpModule],
  providers: [
    {
      provide: WealthKernelConnectorApisServiceBase,
      useClass: WealthKernelConnectorApisService,
    },
  ],
  exports: [WealthKernelConnectorApisServiceBase],
})
export class ApisModule {}
