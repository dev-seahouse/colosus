import { getInvestorClientConfiguration } from '@bambu/server-core/configuration';
import { TransactInvestorModule as TransactInvestorDomainModule } from '@bambu/server-core/domains';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactInvestorController } from './transact-investor.controller';

/**
 * Note: every endpoint tailored to the Connect advisor onboarding process falls under this controller,
 * even if the backend domain is nots strictly speaking a Connect _advisor_ domain.
 */
@Module({
  imports: [
    // ExtractOriginGuard Dependencies - Start
    ConfigModule.forFeature(getInvestorClientConfiguration),
    // ExtractOriginGuard Dependencies - End
    TransactInvestorDomainModule,
  ],
  controllers: [TransactInvestorController],
})
export class TransactInvestorModule {}
