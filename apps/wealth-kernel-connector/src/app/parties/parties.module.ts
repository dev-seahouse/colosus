import {
  BrokerageIntegrationAccountsModule,
  BrokerageIntegrationPartiesModule,
  BrokerageIntegrationPortfoliosDomainModule,
  BrokerageIntegrationValuationsDomainModule,
} from '@bambu/server-core/domains';
import { Module } from '@nestjs/common';
import { PartiesController } from './parties.controller';

@Module({
  imports: [
    BrokerageIntegrationPartiesModule,
    BrokerageIntegrationAccountsModule,
    BrokerageIntegrationPortfoliosDomainModule,
    BrokerageIntegrationValuationsDomainModule,
  ],
  controllers: [PartiesController],
})
export class PartiesModule {}
