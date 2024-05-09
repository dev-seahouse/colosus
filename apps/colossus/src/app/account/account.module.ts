import { Module } from '@nestjs/common';

import { DomainsModule } from '@bambu/server-core/domains';

import { AccountController } from './account.controller';

@Module({
  imports: [DomainsModule],
  controllers: [AccountController],
})
export class AccountModule {}
