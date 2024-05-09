import { BrokerageIntegrationValuationsDomainModule } from '@bambu/server-core/domains';
import { Module } from '@nestjs/common';
import { ValuationsController } from './valuations.controller';

@Module({
  imports: [BrokerageIntegrationValuationsDomainModule],
  controllers: [ValuationsController],
})
export class ValuationsModule {}
