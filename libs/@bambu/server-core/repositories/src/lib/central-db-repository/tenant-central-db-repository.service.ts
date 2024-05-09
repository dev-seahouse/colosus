import {
  CentralDbPrismaService,
  Prisma,
  PrismaModel,
} from '@bambu/server-core/db/central-db';
import { IColossusTrackingDto } from '@bambu/server-core/dto';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import {
  ConnectAdvisorDto,
  ITenantTransactBrokerageDto,
  SharedEnums,
} from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import { IPrismaRepositoryMapTypeDto, PrismaRepository } from '../base-classes';

class TenantMapType implements IPrismaRepositoryMapTypeDto {
  aggregate!: Prisma.TenantAggregateArgs;
  count!: Prisma.TenantCountArgs;
  create!: Prisma.TenantCreateArgs;
  delete!: Prisma.TenantDeleteArgs;
  deleteMany!: Prisma.TenantDeleteArgs;
  findFirst!: Prisma.TenantFindFirstArgs;
  findMany!: Prisma.TenantFindManyArgs;
  findUnique!: Prisma.TenantFindUniqueArgs;
  update!: Prisma.TenantUpdateArgs;
  updateMany!: Prisma.TenantUpdateManyArgs;
  upsert!: Prisma.TenantUpsertArgs;
}

export interface IFindActiveTenantsForBrokerageParamsDto {
  pageIndex: number;
  pageSize: number;
  brokerage: SharedEnums.SupportedBrokerageIntegrationEnum;
}

@Injectable()
export class TenantCentralDbRepositoryService extends PrismaRepository<
  Prisma.TenantDelegate<Prisma.RejectPerOperation>,
  TenantMapType
> {
  readonly #logger: Logger = new Logger(TenantCentralDbRepositoryService.name);

  constructor(private readonly prisma: CentralDbPrismaService) {
    super(prisma.tenant);
  }

  /**
   * Find active tenants for a brokerage.
   *
   * Currently, does not really filter until we have markers in place.
   * Once markers are in place, we need to limit what comes back.
   * @param requestId
   * @param input
   * @constructor
   */
  public async FindActiveTenantsForBrokerage(
    requestId: string,
    input: IFindActiveTenantsForBrokerageParamsDto
  ): Promise<PrismaModel.Tenant[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.FindActiveTenantsForBrokerage.name,
      requestId
    );

    this.#logger.debug(
      `${logPrefix} Finding active tenants for brokerage. Input: ${JsonUtils.Stringify(
        input
      )}.`
    );

    try {
      const skip = input.pageIndex * input.pageSize;

      const result = await this.prisma.tenant.findMany({
        orderBy: {
          createdAt: 'asc',
        },
        skip,
        take: input.pageSize,
      });

      return result as PrismaModel.Tenant[];
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error finding active tenants for brokerage. Input: ${JsonUtils.Stringify(
          input
        )}. Error: ${JsonUtils.Stringify(error)}.`
      );
      throw error;
    }
  }

  public async FindTenantByRealm(realm: string): Promise<
    | (PrismaModel.Tenant & {
        apiKeys: PrismaModel.TenantApiKey[];
        httpUrls: PrismaModel.TenantHttpUrl[] | null;
        branding: PrismaModel.TenantBranding | null;
        connectAdvisors: PrismaModel.ConnectAdvisor[];
        tenantSubscriptions: PrismaModel.TenantSubscription[];
      })
    | null
  > {
    const result = await this.prisma.tenant.findFirst({
      where: {
        realm,
      },
      include: {
        httpUrls: true,
        apiKeys: true,
        branding: true,
        connectAdvisors: true,
        tenantSubscriptions: true,
      },
    });

    return result as
      | (PrismaModel.Tenant & {
          apiKeys: PrismaModel.TenantApiKey[];
          httpUrls: PrismaModel.TenantHttpUrl[] | null;
          branding: PrismaModel.TenantBranding | null;
          connectAdvisors: PrismaModel.ConnectAdvisor[];
          tenantSubscriptions: PrismaModel.TenantSubscription[];
        })
      | null;
  }

  public async FindTenantById(tenantId: string): Promise<
    | (PrismaModel.Tenant & {
        apiKeys: PrismaModel.TenantApiKey[];
        httpUrls: PrismaModel.TenantHttpUrl[] | null;
        branding: PrismaModel.TenantBranding | null;
        connectAdvisors: PrismaModel.ConnectAdvisor[];
        tenantSubscriptions: PrismaModel.TenantSubscription[];
      })
    | null
  > {
    const result = await this.prisma.tenant.findFirst({
      where: {
        id: tenantId,
      },
      include: {
        httpUrls: true,
        apiKeys: true,
        branding: true,
        connectAdvisors: true,
        tenantSubscriptions: true,
      },
    });

    return result as
      | (PrismaModel.Tenant & {
          apiKeys: PrismaModel.TenantApiKey[];
          httpUrls: PrismaModel.TenantHttpUrl[] | null;
          branding: PrismaModel.TenantBranding | null;
          connectAdvisors: PrismaModel.ConnectAdvisor[];
          tenantSubscriptions: PrismaModel.TenantSubscription[];
        })
      | null;
  }

  public async CreateTenant({
    realm,
    tracking,
    linkedToKeyCloak = false,
    usesIdInsteadOfRealm = false,
    createdBy,
    updatedBy,
    id,
    linkedToFusionAuth,
  }: {
    realm: string;
    tracking: IColossusTrackingDto;
    linkedToKeyCloak?: boolean;
    usesIdInsteadOfRealm?: boolean;
    createdBy?: string;
    updatedBy?: string;
    id?: string;
    linkedToFusionAuth?: boolean;
  }): Promise<PrismaModel.Tenant> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.CreateTenant.name,
      tracking.requestId
    );
    const inputForLogging = {
      realm,
      requestId: tracking.requestId,
      linkedToKeyCloak,
      usesIdInsteadOfRealm,
      createdBy,
      updatedBy,
      id,
      linkedToFusionAuth,
    };
    try {
      this.#logger.log(
        `${logPrefix} Creating tenant. Input: ${JsonUtils.Stringify(
          inputForLogging
        )}.`
      );

      const timeStamp = new Date().toISOString();

      const payload = {
        data: {
          realm,
          linkedToKeyCloak,
          usesIdInsteadOfRealm,
          createdAt: timeStamp,
          updatedAt: timeStamp,
          id,
          linkedToFusionAuth,
        },
      };

      if (!payload.data.id) {
        delete payload.data.id;
      }

      if (!payload.data.linkedToFusionAuth) {
        delete payload.data.linkedToFusionAuth;
      }

      const { serviceUser } = super.dbRepoConfig;

      super.ensureCreateByAttributesInPlace(
        payload,
        !createdBy ? serviceUser : createdBy
      );
      super.ensureUpdateAttributesInPlace(
        payload,
        !updatedBy ? serviceUser : updatedBy
      );

      const result = await this.prisma.tenant.create(payload);

      this.#logger.debug(
        `${logPrefix} Created tenant. Result: ${JsonUtils.Stringify(result)}.`
      );

      return result;
    } catch (error) {
      const errorMessage: string = [
        `${logPrefix} Error creating tenant.`,
        `Input: ${JsonUtils.Stringify(inputForLogging)}.`,
        `Error: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.#logger.error(errorMessage);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ErrorUtils.ColossusError(
            'Unable to create tenant, tenant already exists on platform database.',
            tracking.requestId,
            { error },
            409,
            SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_ALREADY_EXISTS
          );
        }
      }
      throw error;
    }
  }

  public async UpdateTenant(
    requestId: string,
    id: string,
    tenantPayload: Partial<
      Omit<
        PrismaModel.Tenant,
        | 'id'
        | 'createdBy'
        | 'createdAt'
        | 'apiKeys'
        | 'httpUrls'
        | 'users'
        | 'otps'
        | 'connectAdvisors'
        | 'tenantSubscriptions'
      >
    >
  ): Promise<PrismaModel.Tenant> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.UpdateTenant.name,
      requestId
    );
    const inputForLogging = {
      requestId,
      id,
      tenantPayload,
    };
    try {
      this.#logger.log(
        `${logPrefix} Updating tenant. Input: ${JsonUtils.Stringify(
          inputForLogging
        )}.`
      );

      const timeStamp = new Date().toISOString();

      const payload: Prisma.TenantUpdateArgs = {
        where: {
          id,
        },
        data: {
          ...tenantPayload,
          updatedAt: !tenantPayload.updatedAt
            ? timeStamp
            : tenantPayload.updatedAt.toISOString(),
        },
      };

      const { serviceUser } = super.dbRepoConfig;

      super.ensureUpdateAttributesInPlace(payload, serviceUser);

      const result = await this.prisma.tenant.update(payload);

      this.#logger.debug(
        `${logPrefix} Updated tenant. Result: ${JsonUtils.Stringify(result)}.`
      );

      return result;
    } catch (error) {
      const errorMessage: string = [
        `${logPrefix} Error updating tenant.`,
        `Input: ${JsonUtils.Stringify(inputForLogging)}.`,
        `Error: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.#logger.error(errorMessage);

      throw error;
    }
  }

  public async CreateTenantRealmWithAssociatedData(
    tenantName: string,
    iamUserIdOfInitialUserOfTenant: string
  ): Promise<
    | (PrismaModel.Tenant & {
        apiKeys: PrismaModel.TenantApiKey[];
        httpUrls: PrismaModel.TenantHttpUrl[];
      })
    | null
  > {
    const payload = {
      data: {
        realm: tenantName,
        users: {
          create: {
            id: iamUserIdOfInitialUserOfTenant,
          },
        },
      },
      include: {
        httpUrls: true,
        apiKeys: true,
      },
    };

    const user: string = super.dbRepoConfig.serviceUser;
    super.ensureCreateByAttributesInPlace(payload, user);
    super.ensureUpdateAttributesInPlace(payload, user);

    const result = await this.prisma.tenant.create(payload);

    return result as
      | (PrismaModel.Tenant & {
          apiKeys: PrismaModel.TenantApiKey[];
          httpUrls: PrismaModel.TenantHttpUrl[];
        })
      | null;
  }

  public async SetTenantHttpUrl(
    tenantId: string,
    httpUrl: string,
    updateUser?: string
  ): Promise<void> {
    const user = !updateUser ? super.dbRepoConfig.serviceUser : updateUser;

    const result = await this.prisma.tenantHttpUrl.updateMany({
      where: {
        tenantId,
      },
      data: {
        tenantId,
        url: httpUrl,
        type: 'TENANT',
        createdBy: user,
        updatedBy: user,
      },
    });
    if (result.count === 0) {
      await this.prisma.tenantHttpUrl.create({
        data: {
          tenantId,
          url: httpUrl,
          type: 'TENANT',
          createdBy: user,
          updatedBy: user,
        },
      });
    }
  }

  public async GetTenantHttpUrl(
    httpUrl: string
  ): Promise<PrismaModel.TenantHttpUrl | null> {
    const httpEntry = await this.prisma.tenantHttpUrl.findFirst({
      where: {
        url: httpUrl,
      },
    });

    if (!httpEntry || !httpEntry.tenantId) {
      return null;
    }

    return httpEntry;
  }

  // TODO: Move this to properly connect tenant repo or consolidate tenant repo here?
  public async InitializeConnectTenant({
    tenantId,
  }: {
    tenantId: string;
  }): Promise<void> {
    const defaultSetupState: ConnectAdvisorDto.IConnectAdvisorProfileInformationSetupStateDto =
      {
        hasUpdatedContent: false,
        hasUpdatedBranding: false,
        hasUpdatedGoals: false,
        hasUpdatedLeadSettings: false,
        hasUpdatedPortfolios: false,
      };

    await this.prisma.connectTenant.create({
      data: {
        tenantId,
        incomeThreshold: 100000,
        retireeSavingsThreshold: 200000,
        createdBy: super.dbRepoConfig.serviceUser,
        updatedBy: super.dbRepoConfig.serviceUser,
        setupState: {
          ...defaultSetupState,
        },
      },
    });
  }

  public async GetTenantTransactBrokerageMetadata(
    requestId: string,
    input: { tenantId: string }
  ): Promise<ITenantTransactBrokerageDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetTenantTransactBrokerageMetadata.name,
      requestId
    );
    try {
      const dbRows = await this.prisma.tenantTransactBrokerages.findMany({
        where: {
          tenantId: input.tenantId,
        },
      });

      return dbRows as ITenantTransactBrokerageDto[];
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error finding active tenants for brokerage. Input: ${JsonUtils.Stringify(
          input
        )}. Error: ${JsonUtils.Stringify(error)}.`
      );
      throw error;
    }
  }
}

export { HttpUrlTypeEnum } from '@bambu/server-core/db/central-db';
