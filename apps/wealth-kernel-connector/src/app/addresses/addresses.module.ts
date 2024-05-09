import { BrokerageIntegrationPartiesModule } from '@bambu/server-core/domains';
import { Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';

@Module({
  imports: [BrokerageIntegrationPartiesModule],
  controllers: [AddressesController],
})
export class AddressesModule {}
