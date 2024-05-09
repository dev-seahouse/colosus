import { Module } from '@nestjs/common';
import { ApisModule } from './apis/apis.module';
import { WealthKernelTokenRenewalService } from './wealth-kernel-token-renewal.service';

@Module({
  imports: [ApisModule],
  controllers: [],
  providers: [WealthKernelTokenRenewalService],
})
export class AppModule {}
