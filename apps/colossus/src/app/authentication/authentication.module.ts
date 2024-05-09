import { Module } from '@nestjs/common';

import { DomainsModule } from '@bambu/server-core/domains';

import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [DomainsModule],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
