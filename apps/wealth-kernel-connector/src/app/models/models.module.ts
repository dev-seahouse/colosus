import { BrokerageIntegrationModelsDomainModule } from '@bambu/server-core/domains';
import { Module } from '@nestjs/common';
import { ModelsController } from './models.controller';

@Module({
  imports: [BrokerageIntegrationModelsDomainModule],
  controllers: [ModelsController],
})
export class ModelsModule {}
