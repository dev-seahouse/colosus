import { BrokerageIntegrationDirectDebitDomainModule } from '@bambu/server-core/domains';
import { Module } from '@nestjs/common';
import { DirectDebitController } from './direct-debit.controller';

@Module({
  imports: [BrokerageIntegrationDirectDebitDomainModule],
  controllers: [DirectDebitController],
})
export class DirectDebitModule {}
