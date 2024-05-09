import { ConnectInvestorDomainModule } from '@bambu/server-connect/domains';
import {
  getInvestorClientConfiguration,
  getTransactInvestorSwitchoverConfiguration,
} from '@bambu/server-core/configuration';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConnectInvestorController } from './connect-investor.controller';

/**
 * Note: every endpoint tailored to the Connect advisor onboarding process falls under this controller,
 * even if the backend domain is nots strictly speaking a Connect _advisor_ domain.
 */
@Module({
  imports: [
    // ExtractOriginGuard Dependencies - Start
    ConfigModule.forFeature(getInvestorClientConfiguration),
    // ExtractOriginGuard Dependencies - End
    ConnectInvestorDomainModule,
    ConfigModule.forFeature(getTransactInvestorSwitchoverConfiguration),
  ],
  controllers: [ConnectInvestorController],
})
export class ConnectInvestorModule {}
