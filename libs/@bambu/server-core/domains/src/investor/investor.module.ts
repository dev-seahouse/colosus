import {
  CentralDbRepositoryModule,
  FusionAuthIamRepositoryModule,
} from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { InvestorService } from './investor.service';
import { InvestorServiceBase } from './investor.service.base';

@Module({
  imports: [FusionAuthIamRepositoryModule, CentralDbRepositoryModule],
  providers: [
    {
      provide: InvestorServiceBase,
      useClass: InvestorService,
    },
  ],
  exports: [InvestorServiceBase],
})
export class InvestorModule {}
