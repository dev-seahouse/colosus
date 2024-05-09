import { Injectable } from '@nestjs/common';
import {
  CentralDbPrismaService,
  PrismaModel,
} from '@bambu/server-core/db/central-db';
import { Prisma } from '@bambu/server-core/db/central-db';
import { PrismaRepository, IPrismaRepositoryMapTypeDto } from '../base-classes';
import {} from '@bambu/shared';

class GoalTypeMapType implements IPrismaRepositoryMapTypeDto {
  aggregate!: Prisma.GoalTypeAggregateArgs;
  count!: Prisma.GoalTypeCountArgs;
  create!: Prisma.GoalTypeCreateArgs;
  delete!: Prisma.GoalTypeDeleteArgs;
  deleteMany!: Prisma.GoalTypeDeleteManyArgs;
  findFirst!: Prisma.GoalTypeFindFirstArgs;
  findMany!: Prisma.GoalTypeFindManyArgs;
  findUnique!: Prisma.GoalTypeFindUniqueArgs;
  update!: Prisma.GoalTypeUpdateArgs;
  updateMany!: Prisma.GoalTypeUpdateManyArgs;
  upsert!: Prisma.GoalTypeUpsertArgs;
}

@Injectable()
export class GoalTypeCentralDbRepositoryService extends PrismaRepository<
  Prisma.GoalTypeDelegate<Prisma.RejectPerOperation>,
  GoalTypeMapType
> {
  constructor(private readonly prisma: CentralDbPrismaService) {
    super(prisma.goalType);
  }

  public async GetAll(): Promise<PrismaModel.GoalType[]> {
    const result = await this.prisma.goalType.findMany({
      orderBy: { sortKey: 'asc' },
    });
    return result;
  }
}
