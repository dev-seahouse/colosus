import { Injectable } from '@nestjs/common';
import { CentralDbPrismaService } from '@bambu/server-core/db/central-db';
import { Prisma } from '@bambu/server-core/db/central-db';
import { PrismaRepository, IPrismaRepositoryMapTypeDto } from '../base-classes';
import { IColossusTrackingDto } from '@bambu/server-core/dto';

class LegalDocumentSetMapType implements IPrismaRepositoryMapTypeDto {
  aggregate!: Prisma.LegalDocumentSetAggregateArgs;
  count!: Prisma.LegalDocumentSetCountArgs;
  create!: Prisma.LegalDocumentSetCreateArgs;
  delete!: Prisma.LegalDocumentSetDeleteArgs;
  deleteMany!: Prisma.LegalDocumentSetDeleteArgs;
  findFirst!: Prisma.LegalDocumentSetFindFirstArgs;
  findMany!: Prisma.LegalDocumentSetFindManyArgs;
  findUnique!: Prisma.LegalDocumentSetFindUniqueArgs;
  update!: Prisma.LegalDocumentSetUpdateArgs;
  updateMany!: Prisma.LegalDocumentSetUpdateManyArgs;
  upsert!: Prisma.LegalDocumentSetUpsertArgs;
}

@Injectable()
export class LegalDocumentSetCentralDbRepositoryService extends PrismaRepository<
  Prisma.LegalDocumentSetDelegate<Prisma.RejectPerOperation>,
  LegalDocumentSetMapType
> {
  constructor(private readonly prisma: CentralDbPrismaService) {
    super(prisma.legalDocumentSet);
  }

  public async AppendLegalDocumentSet({
    tenantId,
    documentUrls,
    tracking,
  }: {
    tenantId: string;
    documentUrls: Record<string, string>;
    tracking?: IColossusTrackingDto;
  }): Promise<void> {
    await this.prisma.legalDocumentSet.create({
      data: {
        Tenant: { connect: { id: tenantId } },
        documentUrls,
        createdBy: tracking?.requesterId ?? this.dbRepoConfig.serviceUser,
        updatedBy: tracking?.requesterId ?? this.dbRepoConfig.serviceUser,
      },
    });
  }

  public async GetLegalDocumentSet({
    tenantId,
  }: {
    tenantId: string;
  }): Promise<Record<string, string> | null> {
    const result = await this.prisma.legalDocumentSet.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return (result?.documentUrls ?? null) as unknown as Record<
      string,
      string
    > | null;
  }
}
