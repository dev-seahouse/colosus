import {
  TransactAdvisorModule as TransactAdvisorDomainModule,
  TransactInvestorModule,
} from '@bambu/server-core/domains';
import { Module } from '@nestjs/common';
import { TransactAdvisorController } from './transact-advisor.controller';

@Module({
  imports: [
    TransactAdvisorDomainModule,
    /**
     * Doing this to reuse the instruments bit in TransactInvestorModule.
     *
     * Instruments need to be their own domain later at some point.
     */
    TransactInvestorModule,
  ],
  controllers: [TransactAdvisorController],
})
export class TransactAdvisorModule {}
