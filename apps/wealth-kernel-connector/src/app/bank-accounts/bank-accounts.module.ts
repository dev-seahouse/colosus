import { BrokerageIntegrationPartiesModule } from '@bambu/server-core/domains';
import { Module } from '@nestjs/common';
import { BankAccountsController } from './bank-accounts.controller';

@Module({
  imports: [BrokerageIntegrationPartiesModule],
  controllers: [BankAccountsController],
})
export class BankAccountsModule {}
