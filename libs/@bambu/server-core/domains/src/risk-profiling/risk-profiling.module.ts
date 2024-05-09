import { Module } from '@nestjs/common';
import { RiskProfilingDomainService } from './risk-profiling.service';
import { RiskProfilingDomainServiceBase } from './risk-profiling.service.base';
import { CentralDbRepositoryModule } from '@bambu/server-core/repositories';

@Module({
  imports: [CentralDbRepositoryModule],
  providers: [
    {
      provide: RiskProfilingDomainServiceBase,
      useClass: RiskProfilingDomainService,
    },
  ],
  exports: [RiskProfilingDomainServiceBase],
})
export class RiskProfilingDomainModule {}
