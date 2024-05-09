import {
  CentralDbPrismaService,
  Prisma,
} from '@bambu/server-core/db/central-db';
import { IColossusTrackingDto } from '@bambu/server-core/dto';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import {
  ConnectLeadsDto,
  ConnectPortfolioSummaryDto,
  GoalRecurringSavingsPlanFrequencyEnum,
  GoalRecurringSavingsPlanStatusEnum,
  GoalStatusEnum,
  IGoalDto,
  IGoalRecurringSavingsPlanDto,
  IInvestorDto,
  IInvestorPlatformProfileDto,
  IInvestorPlatformUserAccountDto,
  IInvestorPlatformUserAccountMutableDto,
  IInvestorPlatformUserDto,
  IInvestorPlatformUserMutableDto,
  InvestorTypeEnum,
  SharedEnums,
} from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import * as Luxon from 'luxon';
import {
  getDbRepositoryConfig,
  IDbRepositoryConfig,
} from '../base-classes/prisma-repository/prisma-db.config';

export interface IGetInvestorLeadsPagedResponseDataDto extends IInvestorDto {
  Goals: Array<
    IGoalDto & { GoalRecurringDepositPlans: IGoalRecurringSavingsPlanDto[] }
  >;
}

export interface IGetInvestorLeadsPagedResponseDto {
  data: IGetInvestorLeadsPagedResponseDataDto[];
  pageCount: number;
  filteredCount: number;
  allTotalCount: number;
  qualifiedTotalCount: number;
  transactTotalCount: number;
}

export abstract class InvestorCentralDbRepositoryServiceBase {
  public abstract UpsertInvestorLead(
    requestId: string,
    tenantId: string,
    investorLead: ConnectLeadsDto.IConnectLeadsItemDto,
    additionalData?: Record<string, unknown>
  ): Promise<IInvestorDto>;

  public abstract GetInvestorLeadsPaged(
    requestId: string,
    input: ConnectLeadsDto.IConnectAdvisorRetrieveDbLeadsParamsDto
  ): Promise<IGetInvestorLeadsPagedResponseDto>;

  public abstract GetInvestorLeadById(
    requestId: string,
    id: string
  ): Promise<IGetInvestorLeadsPagedResponseDataDto | null>;

  public abstract GetInvestorLeadByTenantIdAndEmail(
    requestId: string,
    tenantId: string,
    email: string
  ): Promise<IGetInvestorLeadsPagedResponseDataDto | null>;

  public abstract UpdateLeadInvestorReviewStatusByInvestorId(
    requestId: string,
    input: {
      id: string;
      updatedBy: string | null;
      tenantId: string;
      status: SharedEnums.LeadsEnums.EnumLeadStatus;
    }
  ): Promise<number>;

  public abstract UpdateLeadInvestorTypeAndWipePii(params: {
    tracking: IColossusTrackingDto;
    tenantId: string;
    id: string;
    updatedBy?: string;
  }): Promise<number>;

  public abstract UpsertInvestorPlatformUser(
    requestId: string,
    params: IInvestorPlatformUserMutableDto
  ): Promise<IInvestorPlatformUserDto>;

  public abstract GetInvestorProfile(
    requestId: string,
    id: string,
    tenantId: string
  ): Promise<IInvestorPlatformProfileDto | null>;

  public abstract UpdateInvestorPlatformUser(
    requestId: string,
    id: string,
    payload: Partial<IInvestorPlatformUserMutableDto>,
    updatedBy?: string
  ): Promise<IInvestorPlatformUserDto>;

  public abstract UpsertInvestorPlatformUserAccount(
    requestId: string,
    payload: IInvestorPlatformUserAccountMutableDto,
    updateMaker?: string
  ): Promise<IInvestorPlatformUserAccountDto>;

  public abstract GetInvestorPlatformUserAccounts(
    requestId: string,
    investorPlatformUserId: string
  ): Promise<IInvestorPlatformUserAccountDto[]>;

  public abstract GetInvestorPlatformUserAccountsForTenant(
    requestId: string,
    tenantId: string,
    pageIndex: number,
    pageSize: number
  ): Promise<IInvestorPlatformUserAccountDto[]>;

  public abstract UpdateInvestorPlatformUserAccountStatusForTenant(
    requestId: string,
    tenantId: string,
    id: string,
    partnerAccountStatus: string
  ): Promise<number>;
}

@Injectable()
export class InvestorCentralDbRepositoryService
  implements InvestorCentralDbRepositoryServiceBase
{
  private readonly logger = new Logger(InvestorCentralDbRepositoryService.name);
  private readonly dbRepoConfig: IDbRepositoryConfig;

  constructor(private readonly prisma: CentralDbPrismaService) {
    this.dbRepoConfig = getDbRepositoryConfig();
  }

  public async UpsertInvestorLead(
    requestId: string,
    tenantId: string,
    investorLead: ConnectLeadsDto.IConnectLeadsItemDto,
    additionalData?: Record<string, unknown>
  ): Promise<IInvestorDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpsertInvestorLead.name,
      requestId
    );
    const loggingInput = {
      tenantId,
      investorLead,
      additionalData: !additionalData ? null : additionalData,
    };
    this.logger.debug(
      `${logPrefix} Start upsert investor lead. Payload: ${JsonUtils.Stringify(
        loggingInput
      )}.`
    );
    try {
      const {
        name,
        email,
        phoneNumber: rawPhoneNumber,
        zipCode,
        age,
        incomePerAnnum,
        currentSavings,
        isRetired,
        monthlySavings,
        status,
      } = investorLead;
      const createdBy = this.dbRepoConfig.serviceUser;
      const updatedBy = this.dbRepoConfig.serviceUser;
      const phoneNumber = rawPhoneNumber ? rawPhoneNumber : '-';
      const isEmployed = incomePerAnnum !== null;
      const data = !additionalData
        ? Prisma.JsonNull
        : (additionalData as Prisma.InputJsonValue);
      const leadReviewStatus = !status
        ? SharedEnums.LeadsEnums.EnumLeadStatus.NEW
        : status;

      const investor = await this.prisma.investors.upsert({
        where: {
          email_tenantId: {
            email,
            tenantId,
          },
          type: InvestorTypeEnum.LEAD,
        },
        create: {
          createdBy,
          updatedBy,
          email,
          age,
          name,
          phoneNumber,
          zipCode,
          tenantId,
          currentSavings,
          isRetired,
          incomePerAnnum,
          monthlySavings,
          isEmployed,
          data,
          leadReviewStatus,
        },
        update: {
          updatedBy,
          updatedAt: Luxon.DateTime.utc().toJSDate(),
          isEmployed,
          age,
          name,
          phoneNumber,
          zipCode,
          tenantId,
          currentSavings,
          isRetired,
          incomePerAnnum,
          monthlySavings,
          leadReviewStatus,
        },
      });
      this.logger.debug(
        `${logPrefix} Successfully upsert investor lead. Payload: ${JsonUtils.Stringify(
          investor
        )}.`
      );
      return {
        ...investor,
        monthlySavings: investor.monthlySavings
          ? investor.monthlySavings.toNumber()
          : 0,
      } as IInvestorDto;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error while creating/updating record.`,
          `Error details: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      this.logger.debug(
        `${logPrefix} Rethrowing error. Input: ${JsonUtils.Stringify(
          loggingInput
        )}`
      );
      throw error;
    }
  }

  public async GetInvestorLeadsPaged(
    requestId: string,
    input: ConnectLeadsDto.IConnectAdvisorRetrieveDbLeadsParamsDto
  ): Promise<IGetInvestorLeadsPagedResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetInvestorLeadsPaged.name,
      requestId
    );
    this.logger.debug(`${logPrefix} ${JsonUtils.Stringify(input)})`);
    try {
      const { tenantId, nameFilter } = input;
      let whereClause: Prisma.InvestorsFindManyArgs['where'] = {
        tenantId,
      };
      const baseWhereClause: Prisma.InvestorsFindManyArgs['where'] =
        _.cloneDeep<Prisma.InvestorsFindManyArgs['where']>(whereClause);
      if (nameFilter !== undefined && nameFilter !== null) {
        whereClause.name = { contains: nameFilter, mode: 'insensitive' };
      }
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
      const { qualifiedFilter } = input;
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
      const orderBy: Prisma.InvestorsFindManyArgs['orderBy'] = [
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
        this.prisma.investors.findMany({
          where: whereClause,
          skip: pageSize * pageIndex,
          take: pageSize,
          orderBy,
          include: {
            Goals: {
              include: {
                GoalRecurringSavingsPlans: true,
              },
            },
            // Goals: {
            //   include: {
            //     GoalRecurringDepositPlans: true,
            //     ConnectPortfolioSummary: true,
            //   },
            // },
          },
        }),
        this.prisma.investors.count({
          where: baseWhereClause,
        }),
        this.prisma.investors.count({
          where: {
            ...baseWhereClause,
            ...isQualifiedFilter,
          },
        }),
        this.prisma.investors.count({
          where: {
            ...baseWhereClause,
            ...isTransactFilter,
          },
        }),
        this.prisma.investors.count({
          where: whereClause,
        }),
      ]);
      const pageCount = Math.ceil(filteredCount / pageSize);
      return {
        data: data.map((investor) => {
          return {
            ...investor,
            data: (investor.data as unknown as Record<string, unknown>) || null,
            monthlySavings: investor.monthlySavings
              ? investor.monthlySavings.toNumber()
              : 0,
            type: investor.type as InvestorTypeEnum,
            Goals: investor.Goals.map((goal) => {
              return {
                ...goal,
                goalValue: goal.goalValue.toNumber(),
                initialInvestment: goal.initialInvestment.toNumber(),
                status: goal.status as GoalStatusEnum,
                data: (goal.data as unknown as Record<string, unknown>) || null,
                computedRiskProfile:
                  goal.computedRiskProfile as unknown as Record<
                    string,
                    unknown
                  >,
                recommendedMonthlyContribution:
                  goal.recommendedMonthlyContribution.toNumber(),
                GoalRecurringDepositPlans: goal.GoalRecurringSavingsPlans.map(
                  (plan) => {
                    return {
                      ...plan,
                      amount: plan.amount.toNumber(),
                      frequency:
                        plan.frequency as GoalRecurringSavingsPlanFrequencyEnum,
                      status: plan.status as GoalRecurringSavingsPlanStatusEnum,
                      data:
                        (goal.data as unknown as Record<string, unknown>) ||
                        null,
                    };
                  }
                ),
              };
            }),
          };
        }),
        pageCount,
        filteredCount,
        allTotalCount,
        qualifiedTotalCount,
        transactTotalCount,
      };
    } catch (error) {
      this.logger.error(`${logPrefix} ${JsonUtils.Stringify(error)}`);
      this.logger.debug(
        `${logPrefix} Rethrowing error. Input: ${JsonUtils.Stringify(input)}`
      );
      throw error;
    }
  }

  public async GetInvestorLeadById(
    requestId: string,
    id: string
  ): Promise<IGetInvestorLeadsPagedResponseDataDto | null> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetInvestorLeadById.name,
      requestId
    );
    const loggingInput = { id };
    try {
      this.logger.debug(
        `${logPrefix} Start get investor lead by id. Payload: ${JsonUtils.Stringify(
          loggingInput
        )}.`
      );
      const investor = await this.prisma.investors.findUnique({
        where: {
          id,
        },
        include: {
          Goals: {
            include: {
              GoalRecurringSavingsPlans: true,
            },
          },
        },
      });
      if (!investor) {
        this.logger.debug(`${logPrefix} Investor not found.`);
        return null;
      }
      this.logger.debug(
        `${logPrefix} Successfully get investor lead by id. Payload: ${JsonUtils.Stringify(
          investor
        )}.`
      );
      return {
        ...investor,
        data: (investor.data as unknown as Record<string, unknown>) || null,
        monthlySavings: investor.monthlySavings
          ? investor.monthlySavings.toNumber()
          : 0,
        type: investor.type as InvestorTypeEnum,
        Goals: investor.Goals.map((goal) => {
          return {
            ...goal,
            goalValue: goal.goalValue.toNumber(),
            initialInvestment: goal.initialInvestment.toNumber(),
            status: goal.status as GoalStatusEnum,
            data: (goal.data as unknown as Record<string, unknown>) || null,
            recommendedMonthlyContribution: goal.recommendedMonthlyContribution
              ? goal.recommendedMonthlyContribution.toNumber()
              : 0,
            computedRiskProfile: goal.computedRiskProfile as unknown as Record<
              string,
              unknown
            >,
            GoalRecurringDepositPlans: goal.GoalRecurringSavingsPlans.map(
              (plan) => {
                return {
                  ...plan,
                  amount: plan.amount.toNumber(),
                  frequency:
                    plan.frequency as GoalRecurringSavingsPlanFrequencyEnum,
                  status: plan.status as GoalRecurringSavingsPlanStatusEnum,
                  data:
                    (goal.data as unknown as Record<string, unknown>) || null,
                };
              }
            ),
          };
        }),
      };
    } catch (error) {
      this.logger.error(`${logPrefix} ${JsonUtils.Stringify(error)}`);
      this.logger.debug(
        `${logPrefix} Rethrowing error. Input: ${JsonUtils.Stringify(
          loggingInput
        )}`
      );
      throw error;
    }
  }

  public async GetInvestorLeadByTenantIdAndEmail(
    requestId: string,
    tenantId: string,
    email: string
  ): Promise<IGetInvestorLeadsPagedResponseDataDto | null> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetInvestorLeadById.name,
      requestId
    );
    const loggingInput = { tenantId, email };
    try {
      this.logger.debug(
        `${logPrefix} Start get investor lead by id. Payload: ${JsonUtils.Stringify(
          loggingInput
        )}.`
      );
      const investor = await this.prisma.investors.findUnique({
        where: {
          email_tenantId: {
            email,
            tenantId,
          },
        },
        include: {
          Goals: {
            include: {
              GoalRecurringSavingsPlans: true,
            },
          },
        },
      });
      if (!investor) {
        this.logger.debug(`${logPrefix} Investor not found.`);
        return null;
      }
      this.logger.debug(
        `${logPrefix} Successfully get investor lead by id. Payload: ${JsonUtils.Stringify(
          investor
        )}.`
      );
      return {
        ...investor,
        data: (investor.data as unknown as Record<string, unknown>) || null,
        monthlySavings: investor.monthlySavings
          ? investor.monthlySavings.toNumber()
          : 0,
        type: investor.type as InvestorTypeEnum,
        Goals: investor.Goals.map((goal) => {
          return {
            ...goal,
            goalValue: goal.goalValue.toNumber(),
            initialInvestment: goal.initialInvestment.toNumber(),
            recommendedMonthlyContribution:
              goal.recommendedMonthlyContribution.toNumber(),
            status: goal.status as GoalStatusEnum,
            data: (goal.data as unknown as Record<string, unknown>) || null,
            computedRiskProfile: goal.computedRiskProfile as unknown as Record<
              string,
              unknown
            >,
            GoalRecurringDepositPlans: goal.GoalRecurringSavingsPlans.map(
              (plan) => {
                return {
                  ...plan,
                  amount: plan.amount.toNumber(),
                  frequency:
                    plan.frequency as GoalRecurringSavingsPlanFrequencyEnum,
                  status: plan.status as GoalRecurringSavingsPlanStatusEnum,
                  data:
                    (goal.data as unknown as Record<string, unknown>) || null,
                };
              }
            ),
          };
        }),
      };
    } catch (error) {
      this.logger.error(`${logPrefix} ${JsonUtils.Stringify(error)}`);
      this.logger.debug(
        `${logPrefix} Rethrowing error. Input: ${JsonUtils.Stringify(
          loggingInput
        )}`
      );
      throw error;
    }
  }

  public async UpdateLeadInvestorReviewStatusByInvestorId(
    requestId: string,
    input: {
      id: string;
      updatedBy: string | null;
      tenantId: string;
      status: SharedEnums.LeadsEnums.EnumLeadStatus;
    }
  ): Promise<number> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateLeadInvestorReviewStatusByInvestorId.name,
      requestId
    );
    this.logger.debug(`${logPrefix} Inputs: ${JsonUtils.Stringify(input)}.`);
    try {
      const updatedBy: string =
        input.updatedBy || this.dbRepoConfig.serviceUser;
      const { id, tenantId, status } = input;
      const updateResponse = await this.prisma.investors.updateMany({
        where: {
          id,
          tenantId,
        },
        data: {
          leadReviewStatus: status,
          updatedBy,
        },
      });
      return updateResponse.count;
    } catch (error) {
      const logMessage = [
        `${logPrefix} Error while updating lead investor review status.`,
        `Input: ${JsonUtils.Stringify(input)}.`,
        `Error details: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.logger.error(logMessage);
      throw error;
    }
  }

  // Presently, only email and phoneNumber are candidates for wiping
  public async UpdateLeadInvestorTypeAndWipePii(params: {
    tracking: IColossusTrackingDto;
    tenantId: string;
    id: string;
    updatedBy?: string;
  }): Promise<number> {
    const { tracking, tenantId, id } = params;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateLeadInvestorReviewStatusByInvestorId.name,
      tracking.requestId
    );
    this.logger.debug(`${logPrefix} Inputs: ${id}.`);
    try {
      const updatedBy = params.updatedBy || this.dbRepoConfig.serviceUser;
      const updateResponse = await this.prisma.investors.updateMany({
        where: {
          id,
          tenantId,
          type: InvestorTypeEnum.LEAD,
        },
        data: {
          type: InvestorTypeEnum.PLATFORM_USER,
          updatedBy,
        },
      });
      return updateResponse.count;
    } catch (error) {
      const logMessage = [
        `${logPrefix} Error while updating lead investor status and wiping PII.`,
        `Input: ${JsonUtils.Stringify(params)}.`,
        `Error details: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.logger.error(logMessage);
      throw error;
    }
  }

  public async UpsertInvestorPlatformUser(
    requestId: string,
    params: IInvestorPlatformUserMutableDto
  ): Promise<IInvestorPlatformUserDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpsertInvestorPlatformUser.name,
      requestId
    );
    try {
      this.logger.debug(`${logPrefix} Inputs: ${JsonUtils.Stringify(params)}.`);
      const createdBy: string = this.dbRepoConfig.serviceUser;
      const updatedBy: string = this.dbRepoConfig.serviceUser;
      const timeStamp = new Date();
      const createdAt: Date = timeStamp;
      const updatedAt: Date = timeStamp;
      const id: string = params.investorId;
      const upsertResult = await this.prisma.investorPlatformUsers.upsert({
        where: {
          id,
        },
        create: {
          ...params,
          data: !params.data
            ? Prisma.JsonNull
            : (params.data as Prisma.InputJsonValue),
          createdAt,
          createdBy,
          updatedBy,
          updatedAt,
          id,
        },
        update: {
          ...params,
          data: !params.data
            ? Prisma.JsonNull
            : (params.data as Prisma.InputJsonValue),
          updatedBy,
          updatedAt,
        },
      });
      return {
        ...upsertResult,
        data: (upsertResult.data as unknown as Record<string, unknown>) || null,
      };
    } catch (error) {
      const logMessage = [
        `${logPrefix} Error encountered.`,
        `Input: ${JsonUtils.Stringify(params)}.`,
        `Error details: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.logger.error(logMessage);
      throw error;
    }
  }

  public async GetInvestorProfile(
    requestId: string,
    id: string,
    tenantId: string
  ): Promise<IInvestorPlatformProfileDto | null> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetInvestorProfile.name,
      requestId
    );
    const inputForLogging = { id, tenantId };
    this.logger.debug(
      `${logPrefix} Inputs: ${JSON.stringify(inputForLogging)}.`
    );
    try {
      const dbResponse = await this.prisma.investors.findUnique({
        where: {
          id,
        },
        include: {
          Goals: {
            include: {
              GoalRecurringSavingsPlans: true,
              ConnectPortfolioSummary: {
                include: {
                  RiskProfile: true,
                  TransactModelPortfolios: {
                    include: {
                      TransactModelPortfolioInstruments: {
                        include: {
                          Instrument: {
                            include: {
                              InstrumentCurrency: true,
                              InstrumentExchange: true,
                              InstrumentFactSheets: true,
                              InstrumentAssetClass: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          InvestorPlatformUsers: {
            include: {
              InvestorPlatformUserAccounts: true,
            },
          },
        },
      });
      if (!dbResponse) {
        return null;
      }
      return {
        ...dbResponse,
        data: (dbResponse.data as unknown as Record<string, unknown>) || null,
        monthlySavings: dbResponse.monthlySavings
          ? dbResponse.monthlySavings.toNumber()
          : 0,
        type: dbResponse.type as InvestorTypeEnum,
        Goals: dbResponse.Goals.map((goal) => {
          const {
            id,
            status,
            data,
            updatedAt,
            goalValue,
            GoalRecurringSavingsPlans,
            investorId,
            createdAt,
            createdBy,
            updatedBy,
            goalDescription,
            goalName,
            computedRiskProfile,
            initialInvestment,
            connectPortfolioSummaryId,
            goalEndDate,
            goalTimeframe,
            goalStartDate,
            sendLeadAppointmentEmail,
            sendLeadGoalProjectionEmail,
          } = goal;
          return {
            id,
            updatedAt,
            investorId,
            createdAt,
            createdBy,
            updatedBy,
            goalDescription,
            goalName,
            connectPortfolioSummaryId,
            goalEndDate,
            goalTimeframe,
            goalStartDate,
            sendLeadAppointmentEmail,
            sendLeadGoalProjectionEmail,
            goalValue: goalValue.toNumber(),
            initialInvestment: initialInvestment.toNumber(),
            status: status as GoalStatusEnum,
            data: (data as unknown as Record<string, unknown>) || null,
            computedRiskProfile: computedRiskProfile as unknown as Record<
              string,
              unknown
            >,
            GoalRecurringSavingsPlans: GoalRecurringSavingsPlans.map((plan) => {
              return {
                ...plan,
                amount: plan.amount.toNumber(),
                frequency:
                  plan.frequency as GoalRecurringSavingsPlanFrequencyEnum,
                status: plan.status as GoalRecurringSavingsPlanStatusEnum,
                data: (goal.data as unknown as Record<string, unknown>) || null,
              };
            }),
            ConnectPortfolioSummary: {
              ...goal.ConnectPortfolioSummary,
              assetClassAllocation: goal.ConnectPortfolioSummary
                .assetClassAllocation as unknown as ConnectPortfolioSummaryDto.IConnectPortfolioSummaryAssetClassAllocationItemDto[],
              expectedReturnPercent:
                goal.ConnectPortfolioSummary.expectedReturnPercent.toString(),
              expectedVolatilityPercent:
                goal.ConnectPortfolioSummary.expectedVolatilityPercent.toString(),
              RiskProfile: {
                ...goal.ConnectPortfolioSummary.RiskProfile,
                upperLimit:
                  goal.ConnectPortfolioSummary.RiskProfile.upperLimit.toString(),
                lowerLimit:
                  goal.ConnectPortfolioSummary.RiskProfile.lowerLimit.toString(),
              },
              TransactModelPortfolios:
                goal.ConnectPortfolioSummary.TransactModelPortfolios.map(
                  (modelPortfolio) => {
                    return {
                      ...modelPortfolio,
                      expectedAnnualReturn:
                        modelPortfolio.expectedAnnualReturn?.toNumber() || null,
                      expectedAnnualVolatility:
                        modelPortfolio.expectedAnnualVolatility?.toNumber() ||
                        null,
                      rebalancingThreshold:
                        modelPortfolio.rebalancingThreshold?.toNumber() || null,
                      TransactModelPortfolioInstruments:
                        modelPortfolio.TransactModelPortfolioInstruments.map(
                          (instrumentDistribution) => {
                            return {
                              ...instrumentDistribution,
                              weightage:
                                instrumentDistribution.weightage.toNumber(),
                            };
                          }
                        ),
                    };
                  }
                ),
            },
          };
        }),
        InvestorPlatformUsers: dbResponse.InvestorPlatformUsers.map((user) => {
          return {
            ...user,
            data: (user.data as unknown as Record<string, unknown>) || null,
            InvestorPlatformUserAccounts: user.InvestorPlatformUserAccounts.map(
              (account) => {
                return {
                  ...account,
                  brokerage:
                    account.brokerage as SharedEnums.SupportedBrokerageIntegrationEnum,
                  data:
                    (account.data as unknown as Record<string, unknown>) ||
                    null,
                };
              }
            ),
          };
        }),
      };
    } catch (error) {
      const logMessage = [
        `${logPrefix} Error encountered.`,
        `Error details: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.logger.error(logMessage);
      throw error;
    }
  }

  public async UpdateInvestorPlatformUser(
    requestId: string,
    id: string,
    payload: Partial<IInvestorPlatformUserMutableDto>,
    updatedBy?: string
  ): Promise<IInvestorPlatformUserDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateInvestorPlatformUser.name,
      requestId
    );
    if (!updatedBy) {
      updatedBy = this.dbRepoConfig.serviceUser;
    }
    const loggingPayload = {
      id,
      payload,
      updatedBy,
    };
    this.logger.debug(
      `${logPrefix} Inputs: ${JsonUtils.Stringify(loggingPayload)}.`
    );
    try {
      const updatePayload: Record<string, unknown> = {
        ...payload,
      };
      if (payload.data !== undefined) {
        updatePayload.data = payload.data
          ? (payload.data as Prisma.InputJsonValue)
          : Prisma.JsonNull;
      }
      const result = await this.prisma.investorPlatformUsers.update({
        where: {
          id,
        },
        data: {
          updatedBy,
          updatedAt: new Date(),
          ...updatePayload,
        },
      });
      return {
        ...result,
        data: (result.data as Record<string, unknown>) || null,
      };
    } catch (error) {
      const logMessage = [
        `${logPrefix} Error encountered.`,
        `Error details: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.logger.error(logMessage);
      throw error;
    }
  }

  public async GetInvestorPlatformUserAccounts(
    requestId: string,
    investorPlatformUserId: string
  ): Promise<IInvestorPlatformUserAccountDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetInvestorPlatformUserAccounts.name,
      requestId
    );
    try {
      const result = await this.prisma.investorPlatformUserAccounts.findMany({
        where: {
          investorPlatformUserId,
        },
      });
      return result.map((item) => {
        return {
          ...item,
          data: item.data ? (item.data as Record<string, unknown>) : null,
          brokerage:
            item.brokerage as SharedEnums.SupportedBrokerageIntegrationEnum,
        };
      });
    } catch (error) {
      const logMessage = [
        `${logPrefix} Error encountered.`,
        `Error details: ${JsonUtils.Stringify({
          error,
          investorPlatformUserId,
        })}.`,
      ].join(' ');
      this.logger.error(logMessage);
      throw error;
    }
  }

  public async UpsertInvestorPlatformUserAccount(
    requestId: string,
    payload: IInvestorPlatformUserAccountMutableDto,
    updateMaker?: string
  ): Promise<IInvestorPlatformUserAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpsertInvestorPlatformUserAccount.name,
      requestId
    );
    try {
      updateMaker = updateMaker || this.dbRepoConfig.serviceUser;
      const updatedBy: string = updateMaker;
      const createdBy: string = updateMaker;
      const upsertRow: Record<string, unknown> = {
        updatedBy,
      };
      Object.keys(payload).forEach((key) => {
        if (key === 'data') {
          upsertRow.data = payload.data
            ? (payload.data as Prisma.InputJsonValue)
            : Prisma.JsonNull;
        } else {
          upsertRow[key] = (payload as unknown as Record<string, unknown>)[key];
        }
      });
      const result = await this.prisma.investorPlatformUserAccounts.upsert({
        where: {
          brokerage_partnerAccountId_partnerAccountNumber_partnerAccountType: {
            brokerage: payload.brokerage,
            partnerAccountId: payload.partnerAccountId,
            partnerAccountNumber: payload.partnerAccountNumber,
            partnerAccountType: payload.partnerAccountType,
          },
        },
        create: {
          ...(upsertRow as unknown as Prisma.InvestorPlatformUserAccountsCreateInput),
          createdBy,
        },
        update: {
          ...(upsertRow as unknown as Prisma.InvestorPlatformUserAccountsCreateInput),
        },
      });
      return {
        ...result,
        data: result.data ? (result.data as Record<string, unknown>) : null,
        brokerage:
          result.brokerage as SharedEnums.SupportedBrokerageIntegrationEnum,
      };
    } catch (error) {
      const logMessage = [
        `${logPrefix} Error encountered.`,
        `Error details: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.logger.error(logMessage);
      throw error;
    }
  }

  public async GetInvestorPlatformUserAccountsForTenant(
    requestId: string,
    tenantId: string,
    pageIndex: number,
    pageSize: number
  ): Promise<IInvestorPlatformUserAccountDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetInvestorPlatformUserAccountsForTenant.name,
      requestId
    );
    const loggingInput = { tenantId };
    try {
      this.logger.debug(
        `${logPrefix} Inputs: ${JsonUtils.Stringify(loggingInput)}.`
      );
      const result = await this.prisma.investorPlatformUserAccounts.findMany({
        where: {
          InvestorPlatformUser: {
            Investor: {
              tenantId,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: pageSize,
        skip: pageIndex * pageSize,
      });
      this.logger.debug(`${logPrefix} Result: ${JsonUtils.Stringify(result)}.`);
      return result.map((item) => {
        return {
          ...item,
          data: item.data ? (item.data as Record<string, unknown>) : null,
          brokerage:
            item.brokerage as SharedEnums.SupportedBrokerageIntegrationEnum,
        };
      });
    } catch (error) {
      const logMessage = [
        `${logPrefix} Error encountered.`,
        `Error details: ${JsonUtils.Stringify(error)}.`,
        `Input: ${JsonUtils.Stringify(loggingInput)}.`,
      ].join(' ');
      this.logger.error(logMessage);
      throw error;
    }
  }

  public async UpdateInvestorPlatformUserAccountStatusForTenant(
    requestId: string,
    tenantId: string,
    id: string,
    partnerAccountStatus: string
  ): Promise<number> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateInvestorPlatformUserAccountStatusForTenant.name,
      requestId
    );
    const loggingInput = { tenantId, id };
    try {
      const result = await this.prisma.investorPlatformUserAccounts.updateMany({
        where: {
          AND: [
            {
              InvestorPlatformUser: {
                Investor: {
                  tenantId,
                },
              },
            },
            {
              id,
            },
          ],
        },
        data: {
          partnerAccountStatus,
        },
      });
      this.logger.debug(`${logPrefix} Result: ${JsonUtils.Stringify(result)}.`);
      return result.count;
    } catch (error) {
      const logMessage = [
        `${logPrefix} Error encountered.`,
        `Error details: ${JsonUtils.Stringify(error)}.`,
        `Input: ${JsonUtils.Stringify(loggingInput)}.`,
      ].join(' ');
      this.logger.error(logMessage);
      throw error;
    }
  }
}
