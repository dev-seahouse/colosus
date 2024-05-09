import { BrokerageIntegrationPerformanceDomainModule } from '@bambu/server-core/domains';
import { Module } from '@nestjs/common';
import { PerformanceController } from './performance.controller';

@Module({
  imports: [BrokerageIntegrationPerformanceDomainModule],
  controllers: [PerformanceController],
})
export class PerformanceModule {}
