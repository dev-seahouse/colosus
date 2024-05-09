import { BrokerageIntegrationTransactionsDomainModule } from '@bambu/server-core/domains';
import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [BrokerageIntegrationTransactionsDomainModule],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
