import { Module } from '@nestjs/common';
import { CentralDbPrismaService } from './central-db-prisma.service';

@Module({
  providers: [CentralDbPrismaService],
  exports: [CentralDbPrismaService],
})
export class CentralDbPrismaModule {}
