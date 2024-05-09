import { Injectable } from '@nestjs/common';
import {
  CentralDbPrismaService,
  Prisma,
  PrismaModel,
} from '@bambu/server-core/db/central-db';
import { IPrismaRepositoryMapTypeDto, PrismaRepository } from '../base-classes';
import { ConnectTenantDto, SharedEnums } from '@bambu/shared';
import { ErrorUtils, UuidUtils } from '@bambu/server-core/utilities';

class ConnectTenantGoalTypeMapType implements IPrismaRepositoryMapTypeDto {
  aggregate!: Prisma.ConnectTenantGoalTypeAggregateArgs;
  count!: Prisma.ConnectTenantGoalTypeCountArgs;
  create!: Prisma.ConnectTenantGoalTypeCreateArgs;
  delete!: Prisma.ConnectTenantGoalTypeDeleteArgs;
  deleteMany!: Prisma.ConnectTenantGoalTypeDeleteManyArgs;
  findFirst!: Prisma.ConnectTenantGoalTypeFindFirstArgs;
  findMany!: Prisma.ConnectTenantGoalTypeFindManyArgs;
  findUnique!: Prisma.ConnectTenantGoalTypeFindUniqueArgs;
  update!: Prisma.ConnectTenantGoalTypeUpdateArgs;
  updateMany!: Prisma.ConnectTenantGoalTypeUpdateManyArgs;
  upsert!: Prisma.ConnectTenantGoalTypeUpsertArgs;
}

@Injectable()
export class ConnectTenantGoalTypeCentralDbRepositoryService extends PrismaRepository<
  Prisma.ConnectTenantGoalTypeDelegate<Prisma.RejectPerOperation>,
  ConnectTenantGoalTypeMapType
> {
  constructor(private readonly prisma: CentralDbPrismaService) {
    super(prisma.connectTenantGoalType);
  }

  public async GetTenantGoalTypesForTenant({
    tenantRealm,
  }: {
    tenantRealm: string;
  }): Promise<ConnectTenantDto.IConnectTenantGoalTypeForTenantDto[]> {
    const allGoalTypes = await this.prisma.goalType.findMany({
      orderBy: { sortKey: 'asc' },
    });
    const goalTypeMap = new Map<string, PrismaModel.GoalType>();
    for (const goal of allGoalTypes) {
      goalTypeMap.set(goal.id, goal);
    }

    /**
     * Workaround.
     *
     * We are moving towards using UUIDs for tenant realms, but we still have some legacy code that uses tenant names.
     */
    let targetRealmName = tenantRealm;
    if (UuidUtils.isStringUuid(tenantRealm)) {
      const tenant = await this.prisma.tenant.findFirst({
        where: { id: tenantRealm },
        select: { realm: true },
      });

      if (!tenant) {
        throw new Error(`Unable to find tenant with id ${tenantRealm}`);
      }

      targetRealmName = tenant.realm;
    }

    const tenantGoals = await this.prisma.connectTenantGoalType.findMany({
      where: { Tenant: { realm: targetRealmName } },
      orderBy: { sortKey: 'asc' },
    });
    const result: ConnectTenantDto.IConnectTenantGoalTypeForTenantDto[] =
      tenantGoals
        .map(({ goalTypeId }) => goalTypeMap.get(goalTypeId))
        .filter((x): x is PrismaModel.GoalType => Boolean(x))
        .map(({ id, name, description }) => ({
          id,
          name,
          description,
          enabled: true,
        }));
    for (const goalType of allGoalTypes.filter(
      ({ id }) => !tenantGoals.some(({ goalTypeId }) => goalTypeId === id)
    )) {
      const { id, name, description } = goalType;
      result.push({ id, name, description, enabled: false });
    }
    return result;
  }

  public async GetTenantGoalTypesFromId({
    tenantId,
  }: {
    tenantId: string;
  }): Promise<ConnectTenantDto.IConnectTenantGoalTypeDto[]> {
    const prismaRes = await this.prisma.connectTenantGoalType.findMany({
      where: { tenantId },
      orderBy: { sortKey: 'asc' },
      include: { GoalType: true },
    });
    const res = prismaRes.map(({ GoalType: { id, name, description } }) => ({
      id,
      name,
      description,
    }));
    return res;
  }

  public async GetTenantFromUrl(
    url: string,
    requestId?: string
  ): Promise<PrismaModel.Tenant> {
    if (!url) {
      throw new ErrorUtils.ColossusError(
        'unable to find tenant since url argument is not provided.',
        requestId ?? '',
        {},
        404,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_NOT_FOUND
      );
    }
    const tenant = (await this.prisma.tenant.findFirst({
      where: {
        httpUrls: {
          some: { url },
        },
      },
    })) as PrismaModel.Tenant | null;
    if (!tenant) {
      throw new ErrorUtils.ColossusError(
        `unable to find tenant corresponding to url ${url}.`,
        requestId ?? '',
        {},
        404,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_NOT_FOUND
      );
    }

    return tenant;
  }

  public async GetTenantGoalTypesFromRealm({
    tenantRealm,
  }: {
    tenantRealm: string;
  }): Promise<ConnectTenantDto.IConnectTenantGoalTypeDto[]> {
    const prismaRes = await this.prisma.connectTenantGoalType.findMany({
      where: { Tenant: { realm: tenantRealm } },
      orderBy: { sortKey: 'asc' },
      include: { GoalType: true },
    });
    const res = prismaRes.map(({ GoalType: { id, name, description } }) => ({
      id,
      name,
      description,
    }));
    return res;
  }

  public async SetTenantGoalTypes(
    tenantRealm: string,
    goalTypeIds: string[],
    userIdForLogging?: string
  ): Promise<void> {
    if (userIdForLogging === undefined || userIdForLogging === null) {
      userIdForLogging = super.dbRepoConfig.serviceUser;
    }

    const tenantIdRes = await this.prisma.tenant.findUnique({
      where: { realm: tenantRealm },
    });
    if (!tenantIdRes) {
      throw new Error('Tenant not found');
    }
    const tenantId = tenantIdRes.id;
    await this.prisma.connectTenantGoalType.deleteMany({
      where: { tenantId },
    });

    const timeStamp = new Date().toISOString();

    await this.prisma.connectTenantGoalType.createMany({
      data: goalTypeIds.map((goalTypeId, index) => ({
        goalTypeId,
        tenantId,
        sortKey: index * 10,
        createdBy: userIdForLogging,
        createdAt: timeStamp,
        updatedBy: userIdForLogging,
        updatedAt: timeStamp,
      })),
    });
  }
}
