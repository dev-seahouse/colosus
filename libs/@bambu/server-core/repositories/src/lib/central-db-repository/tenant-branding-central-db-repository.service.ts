import {
  CentralDbPrismaService,
  Prisma,
} from '@bambu/server-core/db/central-db';
import { TenantBrandingDto } from '@bambu/shared';
import { Injectable } from '@nestjs/common';
import { IPrismaRepositoryMapTypeDto, PrismaRepository } from '../base-classes';

class TenantBrandingMapType implements IPrismaRepositoryMapTypeDto {
  aggregate!: Prisma.TenantBrandingAggregateArgs;
  count!: Prisma.TenantBrandingCountArgs;
  create!: Prisma.TenantBrandingCreateArgs;
  delete!: Prisma.TenantBrandingDeleteArgs;
  deleteMany!: Prisma.TenantBrandingDeleteArgs;
  findFirst!: Prisma.TenantBrandingFindFirstArgs;
  findMany!: Prisma.TenantBrandingFindManyArgs;
  findUnique!: Prisma.TenantBrandingFindUniqueArgs;
  update!: Prisma.TenantBrandingUpdateArgs;
  updateMany!: Prisma.TenantBrandingUpdateManyArgs;
  upsert!: Prisma.TenantBrandingUpsertArgs;
}

@Injectable()
export class TenantBrandingCentralDbRepositoryService extends PrismaRepository<
  Prisma.TenantBrandingDelegate<Prisma.RejectPerOperation>,
  TenantBrandingMapType
> {
  constructor(private readonly prisma: CentralDbPrismaService) {
    super(prisma.tenantBranding);
  }

  public async SetTenantBranding(
    params: TenantBrandingDto.ITenantBrandingScalarsDto & {
      tenantId: string;
      userId?: string;
    }
  ): Promise<void> {
    const { tenantId, userId, ...data } = params;

    const res = await this.prisma.tenantBranding.findUnique({
      where: { tenantId },
    });
    const branding =
      typeof res?.branding === 'object' && !Array.isArray(res.branding)
        ? res.branding
        : {};

    const createdBy: string = userId ?? super.dbRepoConfig.serviceUser;
    const updatedBy: string = createdBy;

    const timeStamp: string = new Date().toISOString();
    const createdAt: string = timeStamp;
    const updatedAt: string = timeStamp;

    await this.prisma.tenantBranding.upsert({
      where: {
        tenantId,
      },
      update: {
        branding: {
          ...branding,
          ...data,
          updatedBy,
          updatedAt,
        },
      },
      create: {
        Tenant: { connect: { id: tenantId } },
        branding: {
          logoUrl: null,
          ...data,
        },
        createdBy,
        updatedBy,
        createdAt,
        updatedAt,
      },
    });
  }

  public async SetTenantBrandingWithLogoUrl(
    params: TenantBrandingDto.ITenantBrandingScalarsDto & {
      tenantId: string;
      logoUrl: string | null;
    }
  ): Promise<void> {
    const { tenantId, ...branding } = params;
    await this.prisma.tenantBranding.upsert({
      where: {
        tenantId,
      },
      update: {
        branding,
      },
      create: {
        Tenant: { connect: { id: tenantId } },
        branding,
        createdBy: super.dbRepoConfig.serviceUser,
        updatedBy: super.dbRepoConfig.serviceUser,
      },
    });
  }

  public async GetTenantBranding({
    tenantId,
  }: {
    tenantId: string;
  }): Promise<TenantBrandingDto.ITenantBrandingDto | null> {
    const result = await this.prisma.tenantBranding.findUnique({
      where: { tenantId },
    });

    return (result?.branding ??
      null) as unknown as TenantBrandingDto.ITenantBrandingDto | null;
  }

  public async InitializeTenantBranding({
    tenantId,
  }: {
    tenantId: string;
  }): Promise<void> {
    await this.prisma.tenantBranding.create({
      data: {
        Tenant: { connect: { id: tenantId } },
        branding: {
          logoUrl: null,
          headerBgColor: '#ffffff',
          brandColor: '#00876A',
          tradeName: '',
        },
        createdBy: super.dbRepoConfig.serviceUser,
        updatedBy: super.dbRepoConfig.serviceUser,
      },
    });
  }
}
