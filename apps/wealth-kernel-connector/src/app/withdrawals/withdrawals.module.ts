import { BrokerageIntegrationWithdrawalsDomainModule } from '@bambu/server-core/domains';
import { Module } from '@nestjs/common';
import { WithdrawalsController } from './withdrawals.controller';

@Module({
  imports: [BrokerageIntegrationWithdrawalsDomainModule],
  controllers: [WithdrawalsController],
})
export class WithdrawalsModule {}
