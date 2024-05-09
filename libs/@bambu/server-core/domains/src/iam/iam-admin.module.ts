import { Module } from '@nestjs/common';

import { RepositoriesModule } from '@bambu/server-core/repositories';
import { IamAdminServiceBase } from './iam-admin.service.base';
import { IamAdminService } from './iam-admin.service';

@Module({
  imports: [RepositoriesModule],
  providers: [
    {
      provide: IamAdminServiceBase,
      useClass: IamAdminService,
    },
  ],
  exports: [IamAdminServiceBase],
})
export class IamAdminModule {}
