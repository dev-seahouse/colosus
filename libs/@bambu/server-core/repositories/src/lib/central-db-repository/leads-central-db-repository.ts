import {
  CentralDbPrismaService,
  Prisma,
  PrismaModel,
} from '@bambu/server-core/db/central-db';
import { IColossusTrackingDto } from '@bambu/server-core/dto';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { ConnectLeadsDto, SharedEnums } from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import { IPrismaRepositoryMapTypeDto, PrismaRepository } from '../base-classes';

class LeadsMapType implements IPrismaRepositoryMapTypeDto {
  aggregate!: Prisma.LeadsAggregateArgs;
  count!: Prisma.LeadsCountArgs;
  create!: Prisma.LeadsCreateArgs;
  delete!: Prisma.LeadsDeleteArgs;
  deleteMany!: Prisma.LeadsDeleteManyArgs;
  findFirst!: Prisma.LeadsFindFirstArgs;
  findMany!: Prisma.LeadsFindManyArgs;
  findUnique!: Prisma.LeadsFindUniqueArgs;
  update!: Prisma.LeadsUpdateArgs;
  updateMany!: Prisma.LeadsUpdateManyArgs;
  upsert!: Prisma.LeadsUpsertArgs;
}

export interface IGetLeadByIdParamsDto {
  id: string;
  tenantId: string;
}

@Injectable()
export class LeadsCentralDbRepositoryService extends PrismaRepository<
  Prisma.LeadsDelegate<Prisma.RejectPerOperation>,
  LeadsMapType
> {
  constructor(private readonly prisma: CentralDbPrismaService) {
    super(prisma.leads);
  }

  readonly #logger = new Logger(LeadsCentralDbRepositoryService.name);

  public async GetLeadsByTenantIdPaginated(
    requestId: string,
    input: ConnectLeadsDto.IConnectAdvisorRetrieveDbLeadsParamsDto
  ): Promise<ConnectLeadsDto.IConnectLeadsDto> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetLeadsByTenantIdPaginated.name,
      requestId
    );

    this.#logger.debug(`${logPrefix} ${JsonUtils.Stringify(input)})`);

    try {
      const { tenantId, nameFilter, qualifiedFilter } = input;

      let whereClause: Prisma.LeadsFindManyArgs['where'] = {
        Tenant: { id: tenantId },
      };
      const baseWhereClause: Prisma.LeadsFindManyArgs['where'] =
        _.cloneDeep<Prisma.LeadsFindManyArgs['where']>(whereClause);

      if (nameFilter !== undefined && nameFilter !== null) {
        whereClause.name = { contains: nameFilter, mode: 'insensitive' };
      }

      const isQualifiedFilter =
        this.#generateGetLeadsByTenantIdPaginatedIsQualifiedFilter(
          requestId,
          input
        );

      const isTransactFilter =
        this.#generateGetLeadsByTenantIdPaginatedIsTransactFilter(
          requestId,
          input
        );

      if (
        qualifiedFilter ===
        SharedEnums.LeadsEnums.EnumLeadsQualifiedFilter.QUALIFIED
      ) {
        whereClause = {
          ...whereClause,
          ...isQualifiedFilter,
        };
      } else if (
        qualifiedFilter ===
        SharedEnums.LeadsEnums.EnumLeadsQualifiedFilter.TRANSACT
      ) {
        whereClause = {
          ...whereClause,
          ...isTransactFilter,
        };
      }

      const { pageSize, pageIndex, sortOrder } = input;

      const orderBy: Prisma.LeadsFindManyArgs['orderBy'] = [
        { updatedAt: 'desc' },
      ];

      if (Array.isArray(sortOrder) && sortOrder.length > 0) {
        orderBy.length = 0;
        sortOrder.forEach((item) => {
          orderBy.push({
            [item.columnName]: item.sortOrder,
          });
        });
      }

      const [
        data,
        allTotalCount,
        qualifiedTotalCount,
        transactTotalCount,
        filteredCount,
      ] = await Promise.all([
        this.prisma.leads.findMany({
          where: whereClause,
          skip: pageSize * pageIndex,
          take: pageSize,
          // orderBy: { updatedAt: 'desc' },
          orderBy,
        }),
        this.prisma.leads.count({
          where: baseWhereClause,
        }),
        this.prisma.leads.count({
          where: {
            ...baseWhereClause,
            ...isQualifiedFilter,
          },
        }),
        this.prisma.leads.count({
          where: {
            ...baseWhereClause,
            ...isTransactFilter,
          },
        }),
        this.prisma.leads.count({
          where: whereClause,
        }),
      ]);

      const pageCount = Math.ceil(filteredCount / pageSize);

      return {
        data: this.#remapLeadToDto(data),
        pageCount,
        filteredCount,
        allTotalCount,
        qualifiedTotalCount,
        transactTotalCount,
      };
    } catch (error) {
      this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(error)}`);
      throw error;
    }
  }

  #generateGetLeadsByTenantIdPaginatedIsQualifiedFilter(
    requestId: string,
    input: ConnectLeadsDto.IConnectAdvisorRetrieveDbLeadsParamsDto
  ) {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#generateGetLeadsByTenantIdPaginatedIsQualifiedFilter.name,
      requestId
    );
    const { minimumSavings, minimumIncome } = input;

    const isQualifiedFilter = {
      OR: [
        {
          isRetired: false,
          incomePerAnnum: { gte: Number.parseInt(minimumIncome.toFixed(0)) },
        },
        {
          isRetired: true,
          currentSavings: { gte: Number.parseInt(minimumSavings.toFixed(0)) },
        },
      ],
    };

    this.#logger.debug(
      `${logPrefix} ${JsonUtils.Stringify(isQualifiedFilter)}`
    );

    return isQualifiedFilter;
  }

  #generateGetLeadsByTenantIdPaginatedIsTransactFilter(
    requestId: string,
    input: ConnectLeadsDto.IConnectAdvisorRetrieveDbLeadsParamsDto
  ) {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#generateGetLeadsByTenantIdPaginatedIsTransactFilter.name,
      requestId
    );
    const { minimumSavings, minimumIncome } = input;

    const isTransactFilter = {
      OR: [
        {
          incomePerAnnum: { lt: Number.parseInt(minimumIncome.toFixed(0)) },
          isRetired: false,
        },
        {
          isRetired: true,
          currentSavings: { lt: Number.parseInt(minimumSavings.toFixed(0)) },
        },
      ],
    };

    this.#logger.debug(`${logPrefix} ${JsonUtils.Stringify(isTransactFilter)}`);

    return isTransactFilter;
  }

  #remapLeadToDto(
    input: Prisma.LeadsGetPayload<Prisma.LeadsArgs>[]
  ): ConnectLeadsDto.IConnectLeadsAdvisorDto[] {
    return input.map((x) => {
      return {
        ...x,
        initialInvestment: x.initialInvestment.toNumber(),
        monthlyContribution: x.monthlyContribution.toNumber(),
        projectedReturns:
          x.projectedReturns as unknown as ConnectLeadsDto.IConnectLeadsProjectedReturnsDto,
        computedRiskProfile: x.computedRiskProfile as unknown as Record<
          string,
          unknown
        >,
        status: x.status as unknown as SharedEnums.LeadsEnums.EnumLeadStatus,
        monthlySavings: x.monthlySavings ? x.monthlySavings.toNumber() : null,
        zipCode: x.zipCode ? x.zipCode : null,
      };
    });
  }

  public async GetLeadById(
    requestId: string,
    input: IGetLeadByIdParamsDto
  ): Promise<ConnectLeadsDto.IConnectLeadsAdvisorDto | null> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetLeadById.name,
      requestId
    );
    this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(input)}.`);

    try {
      const { id, tenantId } = input;

      const dbRow = await this.prisma.leads.findFirst({
        where: {
          id,
          tenantId,
        },
      });

      if (dbRow) {
        this.#logger.debug(`${logPrefix} Found lead.`);
        this.#logger.debug(
          `${logPrefix} Raw Output: ${JsonUtils.Stringify(dbRow)}.`
        );

        const remappedData = this.#remapLeadToDto([dbRow]);

        this.#logger.debug(
          `${logPrefix} Output: ${JsonUtils.Stringify(remappedData)}.`
        );

        return remappedData[0];
      }

      this.#logger.debug(`${logPrefix} Lead not found.`);

      return null;
    } catch (error) {
      this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async GetLeadByIdForSummary(
    requestId: string,
    input: IGetLeadByIdParamsDto
  ): Promise<
    | (ConnectLeadsDto.IConnectLeadsAdvisorDto & {
        ConnectPortfolioSummary: PrismaModel.ConnectPortfolioSummary;
      })
    | null
  > {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetLeadByIdForSummary.name,
      requestId
    );
    this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(input)}.`);

    try {
      const { id, tenantId } = input;

      const dbRow = await this.prisma.leads.findFirst({
        where: {
          id,
          tenantId,
        },
        include: {
          ConnectPortfolioSummary: true,
        },
      });

      if (dbRow) {
        this.#logger.debug(`${logPrefix} Found lead.`);
        this.#logger.debug(
          `${logPrefix} Raw Output: ${JsonUtils.Stringify(dbRow)}.`
        );

        const clonedDbRow = _.cloneDeep(dbRow);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (clonedDbRow as any).ConnectPortfolioSummary;

        const remappedData = this.#remapLeadToDto([dbRow]);

        // dbRow.ConnectPortfolioSummary

        return {
          ...remappedData[0],
          ConnectPortfolioSummary: {
            ...dbRow.ConnectPortfolioSummary,
            expectedReturnPercent:
              dbRow.ConnectPortfolioSummary.expectedReturnPercent.toNumber(),
            expectedVolatilityPercent:
              dbRow.ConnectPortfolioSummary.expectedVolatilityPercent.toNumber(),
          } as PrismaModel.ConnectPortfolioSummary,
        };
      }

      this.#logger.debug(`${logPrefix} Lead not found.`);

      return null;
    } catch (error) {
      this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(error)}.`);
      throw error;
    }
  }

  public async UpdateLeadById(
    requestId: string,
    id: string,
    updatedBy: string,
    tenantId: string,
    payload: Partial<
      Omit<PrismaModel.Lead, 'id' | 'createdBy' | 'createdAt' | 'tenantId'>
    >
  ): Promise<ConnectLeadsDto.IConnectLeadsAdvisorDto> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.UpdateLeadById.name,
      requestId
    );

    const loggingPayload = {
      payload,
      id,
      updatedBy,
    };

    this.#logger.debug(
      `${logPrefix} Input: ${JsonUtils.Stringify(loggingPayload)}.`
    );

    try {
      if ((payload as PrismaModel.Lead).createdBy) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (payload as any).createdBy;
      }

      if ((payload as PrismaModel.Lead).createdAt) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (payload as any).createdAt;
      }

      if ((payload as PrismaModel.Lead).id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (payload as any).id;
      }

      if ((payload as PrismaModel.Lead).tenantId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (payload as any).tenantId;
      }

      const data: Partial<Prisma.LeadsUncheckedCreateInput> = {
        updatedBy,
        updatedAt: new Date().toISOString(),
      };

      Object.keys(payload).forEach((key) => {
        // eslint-disable-next-line
        (data as any)[key] = (payload as any)[key];
      });

      const updatedRecord = await this.prisma.leads.update({
        where: {
          id,
          tenantId,
        },
        data: {
          ...data,
        },
      });

      const remappedData = this.#remapLeadToDto([updatedRecord]);

      return remappedData[0];
    } catch (error) {
      this.#logger.error(
        [
          `${logPrefix} Error: ${JsonUtils.Stringify(error)}.`,
          `Input: ${JsonUtils.Stringify(loggingPayload)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async UpsertLead({
    tenantId,
    lead,
    tracking,
  }: {
    tenantId: string;
    lead: ConnectLeadsDto.IConnectLeadsItemDto;
    tracking: IColossusTrackingDto;
  }): Promise<void> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.UpsertLead.name,
      tracking.requestId
    );

    const updatePayload: PrismaModel.LeadMutable = {
      ...lead,
      projectedReturns: lead.projectedReturns as unknown as Record<
        string,
        unknown
      >,

      computedRiskProfile: lead.computedRiskProfile as unknown as Record<
        string,
        unknown
      >,
    };

    try {
      const { serviceUser } = super.dbRepoConfig;
      const createdBy: string = serviceUser;
      const updatedBy: string = serviceUser;

      const timeStamp = new Date();
      const updatedAt: string = timeStamp.toISOString();

      await this.prisma.leads.upsert({
        where: {
          tenantId_email: {
            tenantId,
            email: lead.email,
          },
        },
        update: {
          updatedBy,
          updatedAt,
          ...updatePayload,
          projectedReturns: !updatePayload.projectedReturns
            ? {}
            : (updatePayload.projectedReturns as
                | Prisma.InputJsonValue
                | Prisma.JsonNullValueInput),
          computedRiskProfile: !updatePayload.computedRiskProfile
            ? {}
            : (updatePayload.computedRiskProfile as
                | Prisma.InputJsonValue
                | Prisma.JsonNullValueInput),
          phoneNumber: updatePayload.phoneNumber ?? '',
          notes: updatePayload.notes ?? '',
        },
        create: {
          createdBy,
          updatedBy,
          tenantId,
          ...updatePayload,
          projectedReturns: !updatePayload.projectedReturns
            ? {}
            : (updatePayload.projectedReturns as
                | Prisma.InputJsonValue
                | Prisma.JsonNullValueInput),
          computedRiskProfile: !updatePayload.computedRiskProfile
            ? {}
            : (updatePayload.computedRiskProfile as
                | Prisma.InputJsonValue
                | Prisma.JsonNullValueInput),
          phoneNumber: updatePayload.phoneNumber ?? '',
          notes: updatePayload.notes ?? '',
        },
      });
    } catch (error) {
      this.#logger.error(
        [
          `${logPrefix} Error while creating/updating leads record.`,
          `Error details: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      this.#logger.debug(
        `${logPrefix} Input: ${JsonUtils.Stringify({
          tenantId,
          lead,
          tracking,
        })}`
      );
      throw error;
    }
  }
}
