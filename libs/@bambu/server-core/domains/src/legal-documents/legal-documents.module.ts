import {
  BlobRepositoryModule,
  CentralDbRepositoryModule,
} from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { LegalDocumentsService } from './legal-documents.service';
import { LegalDocumentsServiceBase } from './legal-documents.service.base';

@Module({
  imports: [CentralDbRepositoryModule, BlobRepositoryModule],
  providers: [
    {
      provide: LegalDocumentsServiceBase,
      useClass: LegalDocumentsService,
    },
  ],
  exports: [LegalDocumentsServiceBase],
})
export class LegalDocumentsModule {}
