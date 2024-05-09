import { BrokerageIntegrationAuthenticationModule } from '@bambu/server-core/domains';
import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [BrokerageIntegrationAuthenticationModule],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
