import {
  CentralDbPrismaService,
  Prisma,
} from '@bambu/server-core/db/central-db';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
  UuidUtils,
} from '@bambu/server-core/utilities';
import { ConnectPortfolioSummaryDto, SharedEnums } from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import { IPrismaRepositoryMapTypeDto, PrismaRepository } from '../base-classes';

class ConnectPortfolioSummaryMapType implements IPrismaRepositoryMapTypeDto {
  aggregate!: Prisma.ConnectPortfolioSummaryAggregateArgs;
  count!: Prisma.ConnectPortfolioSummaryCountArgs;
  create!: Prisma.ConnectPortfolioSummaryCreateArgs;
  delete!: Prisma.ConnectPortfolioSummaryDeleteArgs;
  deleteMany!: Prisma.ConnectPortfolioSummaryDeleteManyArgs;
  findFirst!: Prisma.ConnectPortfolioSummaryFindFirstArgs;
  findMany!: Prisma.ConnectPortfolioSummaryFindManyArgs;
  findUnique!: Prisma.ConnectPortfolioSummaryFindUniqueArgs;
  update!: Prisma.ConnectPortfolioSummaryUpdateArgs;
  updateMany!: Prisma.ConnectPortfolioSummaryUpdateManyArgs;
  upsert!: Prisma.ConnectPortfolioSummaryUpsertArgs;
}

@Injectable()
export class ConnectPortfolioSummaryCentralDbRepositoryService extends PrismaRepository<
  Prisma.ConnectPortfolioSummaryDelegate<Prisma.RejectPerOperation>,
  ConnectPortfolioSummaryMapType
> {
  readonly #logger: Logger = new Logger(
    ConnectPortfolioSummaryCentralDbRepositoryService.name
  );

  constructor(private readonly prisma: CentralDbPrismaService) {
    super(prisma.connectPortfolioSummary);
  }

  public async InitializeTenantPortfolioSummaries({
    tenantRealm,
  }: {
    tenantRealm: string;
  }): Promise<void> {
    const tenantIdRes = await this.prisma.tenant.findUnique({
      where: { realm: tenantRealm },
    });
    if (!tenantIdRes) {
      throw new Error('Tenant not found');
    }
    const tenantId: string = tenantIdRes.id;
    const timeStamp = new Date();

    const riskProfiles = await this.prisma.riskProfile.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        lowerLimit: 'asc',
      },
    });

    await this.prisma.connectPortfolioSummary.createMany({
      data: [
        {
          risk_profile_id: riskProfiles[0].id,
          key: SharedEnums.PortfolioEnums.PortfolioKeyEnum.CONSERVATIVE,
          name: 'Conservative Portfolio',
          description:
            'This portfolio is suitable for investors who want to preserve their capital, who are OK with low returns and/or who are investing with a short term time horizon.',
          expectedReturnPercent: '3',
          expectedVolatilityPercent: '4',
          reviewed: false,
          showSummaryStatistics: true,
          sortKey: 10,
          tenantId,
          assetClassAllocation: [
            { assetClass: 'Equity', percentOfPortfolio: '0', included: true },
            { assetClass: 'Bonds', percentOfPortfolio: '100', included: true },
            { assetClass: 'Other', percentOfPortfolio: '0', included: true },
            {
              assetClass: 'Cash',
              percentOfPortfolio: '0',
              included: true,
            },
          ],
          createdAt: timeStamp,
          createdBy: super.dbRepoConfig.serviceUser,
          updatedAt: timeStamp,
          updatedBy: super.dbRepoConfig.serviceUser,
        },
        {
          risk_profile_id: riskProfiles[1].id,
          key: SharedEnums.PortfolioEnums.PortfolioKeyEnum.MODERATE,
          name: 'Moderate Portfolio',
          description:
            'This portfolio is suitable for investors who are willing to take on a little bit of risk to increase marginally their returns. It has a mid to long-term investment time horizon.',
          expectedReturnPercent: '4',
          expectedVolatilityPercent: '7.5',
          reviewed: false,
          showSummaryStatistics: true,
          sortKey: 20,
          tenantId,
          assetClassAllocation: [
            { assetClass: 'Equity', percentOfPortfolio: '25', included: true },
            { assetClass: 'Bonds', percentOfPortfolio: '75', included: true },
            { assetClass: 'Other', percentOfPortfolio: '0', included: true },
            {
              assetClass: 'Cash',
              percentOfPortfolio: '0',
              included: true,
            },
          ],
          createdAt: timeStamp,
          createdBy: super.dbRepoConfig.serviceUser,
          updatedAt: timeStamp,
          updatedBy: super.dbRepoConfig.serviceUser,
        },
        {
          risk_profile_id: riskProfiles[2].id,
          key: SharedEnums.PortfolioEnums.PortfolioKeyEnum.BALANCED,
          name: 'Balanced Portfolio',
          description:
            'This portfolio is suitable for investors who are seeking average returns and are ready to tolerate some price fluctuations. It has a mid to long-term investment time horizon.',
          expectedReturnPercent: '5',
          expectedVolatilityPercent: '11',
          reviewed: false,
          showSummaryStatistics: true,
          sortKey: 30,
          tenantId,
          assetClassAllocation: [
            { assetClass: 'Equity', percentOfPortfolio: '50', included: true },
            { assetClass: 'Bonds', percentOfPortfolio: '50', included: true },
            { assetClass: 'Other', percentOfPortfolio: '0', included: true },
            {
              assetClass: 'Cash',
              percentOfPortfolio: '0',
              included: true,
            },
          ],
          createdAt: timeStamp,
          createdBy: super.dbRepoConfig.serviceUser,
          updatedAt: timeStamp,
          updatedBy: super.dbRepoConfig.serviceUser,
        },
        {
          risk_profile_id: riskProfiles[3].id,
          key: SharedEnums.PortfolioEnums.PortfolioKeyEnum.GROWTH,
          name: 'Growth Portfolio',
          description:
            'This portfolio is suitable for investors seeking growth and who are willing to take on higher risk. It has a long-term investment time horizon.',
          expectedReturnPercent: '6.5',
          expectedVolatilityPercent: '14.5',
          reviewed: false,
          showSummaryStatistics: true,
          sortKey: 40,
          tenantId,
          assetClassAllocation: [
            { assetClass: 'Equity', percentOfPortfolio: '75', included: true },
            { assetClass: 'Bonds', percentOfPortfolio: '25', included: true },
            { assetClass: 'Other', percentOfPortfolio: '0', included: true },
            {
              assetClass: 'Cash',
              percentOfPortfolio: '0',
              included: true,
            },
          ],
          createdAt: timeStamp,
          createdBy: super.dbRepoConfig.serviceUser,
          updatedAt: timeStamp,
          updatedBy: super.dbRepoConfig.serviceUser,
        },
        {
          risk_profile_id: riskProfiles[4].id,
          key: SharedEnums.PortfolioEnums.PortfolioKeyEnum.AGGRESSIVE,
          name: 'Aggressive Portfolio',
          description:
            'This portfolio is suitable for investors seeking high returns and who are willing to take on high risk. It has a long-term investment time horizon.',
          expectedReturnPercent: '8',
          expectedVolatilityPercent: '18',
          reviewed: false,
          showSummaryStatistics: true,
          sortKey: 50,
          tenantId,
          assetClassAllocation: [
            { assetClass: 'Equity', percentOfPortfolio: '100', included: true },
            { assetClass: 'Bonds', percentOfPortfolio: '0', included: true },
            { assetClass: 'Other', percentOfPortfolio: '0', included: true },
            {
              assetClass: 'Cash',
              percentOfPortfolio: '0',
              included: true,
            },
          ],
          createdAt: timeStamp,
          createdBy: super.dbRepoConfig.serviceUser,
          updatedAt: timeStamp,
          updatedBy: super.dbRepoConfig.serviceUser,
        },
      ],
    });
  }

  public async GetConnectPortfolioSummaries({
    tenantRealm,
    requestId,
  }: {
    tenantRealm: string;
    requestId: string;
  }): Promise<ConnectPortfolioSummaryDto.IConnectPortfolioSummaryDto[]> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.GetConnectPortfolioSummaries.name,
      requestId
    );

    this.#logger.log(
      `${logPrefix} Getting portfolio summaries for tenantRealm (${tenantRealm}).`
    );

    /**
     * Workaround.
     *
     * We are moving towards using UUIDs for tenant realms, but we still have some legacy code that uses tenant names.
     */
    const targetTenantRealm: string = await this.#getRealmNameFromRealmId(
      requestId,
      tenantRealm
    );

    const prismaRes = await this.prisma.connectPortfolioSummary.findMany({
      where: { Tenant: { realm: targetTenantRealm } },
      orderBy: { sortKey: 'asc' },
    });
    const payload: ConnectPortfolioSummaryDto.IConnectPortfolioSummaryDto[] =
      [];

    for (const {
      id,
      key,
      name,
      description,
      expectedReturnPercent,
      expectedVolatilityPercent,
      reviewed,
      showSummaryStatistics,
      assetClassAllocation,
      risk_profile_id,
    } of prismaRes) {
      payload.push({
        id,
        key,
        name,
        description,
        expectedReturnPercent: expectedReturnPercent.toString(),
        expectedVolatilityPercent: expectedVolatilityPercent.toString(),
        reviewed,
        showSummaryStatistics,
        assetClassAllocation:
          assetClassAllocation as unknown as ConnectPortfolioSummaryDto.IConnectPortfolioSummaryAssetClassAllocationItemDto[],
        riskProfileId: risk_profile_id,
      });
    }

    return payload;
  }

  async #getRealmNameFromRealmId(
    requestId: string,
    targetTenantRealm: string
  ): Promise<string> {
    /**
     * Workaround.
     *
     * We are moving towards using UUIDs for tenant realms, but we still have some legacy code that uses tenant names.
     */
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.#getRealmNameFromRealmId.name,
      requestId
    );

    if (!UuidUtils.isStringUuid(targetTenantRealm)) {
      return targetTenantRealm;
    }

    const tenant = await this.prisma.tenant.findFirst({
      where: {
        id: targetTenantRealm,
      },
    });

    if (!tenant) {
      const missingTenantError = this.#getTenantMissingColossusError(
        requestId,
        targetTenantRealm
      );

      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          missingTenantError
        )}.`
      );

      throw missingTenantError;
    }

    return tenant.realm;
  }

  #getTenantMissingColossusError(requestId: string, targetTenantRealm: string) {
    return ErrorUtils.getDefaultMissingTenantInDbError({
      requestId,
      metadata: {
        targetTenantRealm,
      },
    });
  }

  public async SetConnectPortfolioSummary({
    tenantRealm,
    requestId,
    connectPortfolioSummaryDto,
    requesterId,
  }: {
    tenantRealm: string;
    requestId: string;
    connectPortfolioSummaryDto: Omit<
      ConnectPortfolioSummaryDto.IConnectPortfolioSummaryDto,
      'sortKey' | 'reviewed'
    >;
    requesterId?: string;
  }): Promise<void> {
    /**
     * Workaround.
     *
     * We are moving towards using UUIDs for tenant realms, but we still have some legacy code that uses tenant names.
     */
    const targetTenantRealm: string = await this.#getRealmNameFromRealmId(
      requestId,
      tenantRealm
    );

    const tenantIdRes = await this.prisma.tenant.findUnique({
      where: { realm: targetTenantRealm },
    });
    if (!tenantIdRes) {
      throw this.#getTenantMissingColossusError(requestId, targetTenantRealm);
    }
    const tenantId = tenantIdRes.id;
    const {
      key,
      name,
      description,
      expectedReturnPercent,
      expectedVolatilityPercent,
      showSummaryStatistics,
      assetClassAllocation,
    } = connectPortfolioSummaryDto;
    const timeStamp = new Date();

    await this.prisma.connectPortfolioSummary.update({
      where: { tenantId_key: { tenantId, key } },
      data: {
        name,
        description,
        expectedReturnPercent,
        expectedVolatilityPercent,
        reviewed: true,
        showSummaryStatistics,
        assetClassAllocation:
          assetClassAllocation as unknown as Prisma.InputJsonObject,
        updatedAt: timeStamp,
        updatedBy: requesterId ? requesterId : tenantId,
      },
    });
  }

  public async GetConnectModelPortfolio(
    requestId: string,
    tenantId: string,
    riskProfile: string
  ): Promise<ConnectPortfolioSummaryDto.IConnectPortfolioSummaryDto | null> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetConnectModelPortfolio.name,
      requestId
    );
    this.#logger.log(`${logPrefix} Getting Connect Model Portfolio`);

    try {
      const prismaResult = await this.prisma.connectPortfolioSummary.findFirst({
        where: {
          risk_profile_id: riskProfile,
          tenantId: tenantId,
        },
      });

      if (!prismaResult) {
        return null;
      }

      const result: ConnectPortfolioSummaryDto.IConnectPortfolioSummaryDto = {
        id: prismaResult.id,
        key: prismaResult.key,
        name: prismaResult.name,
        description: prismaResult.description,
        expectedReturnPercent: prismaResult.expectedReturnPercent.toString(),
        expectedVolatilityPercent:
          prismaResult.expectedVolatilityPercent.toString(),
        reviewed: prismaResult.reviewed,
        showSummaryStatistics: prismaResult.showSummaryStatistics,
        assetClassAllocation:
          prismaResult.assetClassAllocation as unknown as ConnectPortfolioSummaryDto.IConnectPortfolioSummaryAssetClassAllocationItemDto[],
        riskProfileId: prismaResult.risk_profile_id,
      };

      this.#logger.debug(
        `${logPrefix} Result: ${JsonUtils.Stringify(result)}.`
      );

      return result;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while getting Connect model portfolio ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }
}
