import { Injectable } from '@nestjs/common';
import { CentralDbPrismaService } from '@bambu/server-core/db/central-db';
import { Prisma } from '@bambu/server-core/db/central-db';
import { PrismaRepository, IPrismaRepositoryMapTypeDto } from '../base-classes';

class OtpMapType implements IPrismaRepositoryMapTypeDto {
  aggregate!: Prisma.OtpAggregateArgs;
  count!: Prisma.OtpCountArgs;
  create!: Prisma.OtpCreateArgs;
  delete!: Prisma.OtpDeleteArgs;
  deleteMany!: Prisma.OtpDeleteManyArgs;
  findFirst!: Prisma.OtpFindFirstArgs;
  findMany!: Prisma.OtpFindManyArgs;
  findUnique!: Prisma.OtpFindUniqueArgs;
  update!: Prisma.OtpUpdateArgs;
  updateMany!: Prisma.OtpUpdateManyArgs;
  upsert!: Prisma.OtpUpsertArgs;
}

@Injectable()
export class OtpCentralDbRepositoryService extends PrismaRepository<
  Prisma.OtpDelegate<Prisma.RejectPerOperation>,
  OtpMapType
> {
  constructor(private readonly prisma: CentralDbPrismaService) {
    super(prisma.otp);
  }
}
