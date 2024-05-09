import { BrokerageIntegrationPortfoliosDomainModule } from '@bambu/server-core/domains';
import { Module } from '@nestjs/common';
import { PortfoliosController } from './portfolios.controller';

@Module({
  imports: [BrokerageIntegrationPortfoliosDomainModule],
  controllers: [PortfoliosController],
})
export class PortfoliosModule {}
