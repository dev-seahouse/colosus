import { BrokerageIntegrationAccountsModule } from '@bambu/server-core/domains';
import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';

@Module({
  imports: [BrokerageIntegrationAccountsModule],
  controllers: [AccountsController],
})
export class AccountsModule {}
