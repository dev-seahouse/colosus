/**
 * TODO:
 * We really should move this somewhere else.
 *
 * This will cause circular dependencies at some point.
 *
 * Will do this later due to time constraints.
 */

import {
  CentralDbRepositoryModule,
  FusionAuthIamRepositoryModule,
  WealthKernelConnectorModule,
} from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../auth';
import { InvestorModule } from '../investor';
import { OtpModule } from '../otp';
import { TransactInvestorService } from './investor.service';
import { TransactInvestorServiceBase } from './investor.service.base';

@Module({
  imports: [
    InvestorModule,
    FusionAuthIamRepositoryModule,
    CentralDbRepositoryModule,
    AuthenticationModule,
    OtpModule,
    WealthKernelConnectorModule,
  ],
  providers: [
    {
      provide: TransactInvestorServiceBase,
      useClass: TransactInvestorService,
    },
  ],
  exports: [TransactInvestorServiceBase],
})
export class TransactInvestorModule {}
