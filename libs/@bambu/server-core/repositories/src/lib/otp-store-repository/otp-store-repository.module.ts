import { Module } from '@nestjs/common';
import { CentralDbRepositoryModule } from '../central-db-repository';
import { OtpStoreRepositoryService } from './otp-store-repository.service';
import { OtpStoreRepositoryServiceBase } from './otp-store-repository.service.base';

// This module encapsulates repositories that keep track of the state of OTPs that are generated and issued.
@Module({
  imports: [CentralDbRepositoryModule],
  providers: [
    {
      provide: OtpStoreRepositoryServiceBase,
      useClass: OtpStoreRepositoryService,
    },
  ],
  exports: [OtpStoreRepositoryServiceBase],
})
export class OtpStoreRepositoryModule {}
