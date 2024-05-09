import { HeartbeatModule } from '@bambu/server-core/common-rest-endpoints';
import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { AddressesModule } from './addresses/addresses.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { DirectDebitModule } from './direct-debit/direct-debit.module';
import { ModelsModule } from './models/models.module';
import { PartiesModule } from './parties/parties.module';
import { PerformanceModule } from './performance/performance.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ValuationsModule } from './valuations/valuations.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';

@Module({
  imports: [
    WithdrawalsModule,
    PerformanceModule,
    DirectDebitModule,
    HeartbeatModule,
    AuthenticationModule,
    PartiesModule,
    AddressesModule,
    BankAccountsModule,
    AccountsModule,
    PortfoliosModule,
    ValuationsModule,
    ModelsModule,
    TransactionsModule,
  ],
})
export class AppModule {}
