import {
  CentralDbPrismaService,
  Prisma,
} from '@bambu/server-core/db/central-db';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import {
  ConnectLeadsDto,
  ConnectPortfolioSummaryDto,
  GoalRecurringSavingsPlanFrequencyEnum,
  GoalRecurringSavingsPlanStatusEnum,
  GoalStatusEnum,
  IGoalDetailedDto,
  IGoalDto,
  IGoalRecurringSavingsPlanDto,
  IInvestorPlatformProfileGoalDto,
  InvestorTypeEnum,
  SharedEnums,
} from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import {
  getDbRepositoryConfig,
  IDbRepositoryConfig,
} from '../base-classes/prisma-repository/prisma-db.config';

export abstract class GoalCentralDbRepositoryServiceBase {
  public abstract UpsertLeadGoal(
    requestId: string,
    tenantId: string,
    investorLead: ConnectLeadsDto.IConnectLeadsItemDto,
    additionalData?: Record<string, unknown>
  ): Promise<
    IGoalDto & {
      GoalRecurringDepositPlans: IGoalRecurringSavingsPlanDto[];
    }
  >;

  public abstract GetGoalsForActiveWealthKernelAccounts(
    requestId: string,
    tenantId: string,
    partnerModelIds: string[],
    pageIndex: number,
    pageSize: number
  ): Promise<IGoalDetailedDto[]>;

  public abstract UpdateGoalStatus(
    requestId: string,
    goalId: string,
    status: GoalStatusEnum
  ): Promise<number>;

  public abstract GetGoalForTenantInvestor(
    requestId: string,
    tenantId: string,
    goalId: string,
    investorId: string
  ): Promise<IInvestorPlatformProfileGoalDto | null>;

  public abstract GetGoalsForTenantInvestor(
    requestId: string,
    tenantId: string,
    pageIndex: number,
    pageSize: number,
    investorId: string
  ): Promise<IInvestorPlatformProfileGoalDto[]>;

  public abstract GetCountOfGoalsForTenantInvestor(
    requestId: string,
    tenantId: string,
    investorId: string
  ): Promise<number>;
}

@Injectable()
export class GoalCentralDbRepositoryService
  implements GoalCentralDbRepositoryServiceBase
{
  private readonly logger: Logger = new Logger(
    GoalCentralDbRepositoryService.name
  );
  private readonly dbRepoConfig: IDbRepositoryConfig;

  constructor(private readonly prisma: CentralDbPrismaService) {
    this.dbRepoConfig = getDbRepositoryConfig();
  }

  public async UpsertLeadGoal(
    requestId: string,
    tenantId: string,
    investorLead: ConnectLeadsDto.IConnectLeadsItemDto,
    additionalData?: Record<string, unknown>
  ): Promise<
    IGoalDto & {
      GoalRecurringDepositPlans: IGoalRecurringSavingsPlanDto[];
    }
  > {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpsertLeadGoal.name,
      requestId
    );
    const loggingInput = {
      tenantId,
      investorLead,
      additionalData: !additionalData ? null : additionalData,
    };
    this.logger.debug(
      `${logPrefix} Start upsert investor goal. Payload: ${JsonUtils.Stringify(
        loggingInput
      )}.`
    );
    try {
      const {
        email,
        goalName,
        goalDescription,
        goalValue,
        goalTimeframe,
        initialInvestment,
        computedRiskProfile,
        sendAppointmentEmail,
        sendGoalProjectionEmail,
        riskAppetite,
        monthlyContribution,
        recommendedMonthlyContribution,
        projectedReturns,
        riskProfileComplaince,
      } = investorLead;
      const createdBy = this.dbRepoConfig.serviceUser;
      const updatedBy = this.dbRepoConfig.serviceUser;
      const goalDataRaw: Record<string, unknown> = { projectedReturns };
      const riskProfileComplainceDataRaw: Record<string, unknown> = {
        riskProfileComplaince,
      };

      if (additionalData) {
        Object.keys(additionalData).forEach((key) => {
          goalDataRaw[key] = additionalData[key];
        });
      }

      const goalData = goalDataRaw as Prisma.InputJsonValue;
      const riskProfileComplainceData =
        riskProfileComplainceDataRaw as Prisma.InputJsonObject;

      const [investor, existingGoal] = await Promise.all([
        this.prisma.investors.findFirst({
          where: {
            email,
            tenantId,
          },
        }),
        this.prisma.goals.findFirst({
          where: {
            Investor: {
              email,
              tenantId,
            },
          },
        }),
      ]);
      if (!investor) {
        // noinspection ExceptionCaughtLocallyJS
        throw new ErrorUtils.ColossusError(
          'Investor not found.',
          requestId,
          null,
          500
        );
      }
      if (existingGoal) {
        const { id } = existingGoal;
        await this.prisma.goalRecurringSavingsPlans.deleteMany({
          where: {
            goalId: id,
          },
        });
        await this.prisma.goals.delete({ where: { id } });
      }
      const newGoal = await this.prisma.goals.create({
        include: {
          GoalRecurringSavingsPlans: true,
        },
        data: {
          goalName,
          goalDescription,
          goalValue,
          goalTimeframe,
          initialInvestment,
          goalStartDate: null,
          goalEndDate: null,
          status: GoalStatusEnum.PENDING,
          computedRiskProfile: computedRiskProfile as Prisma.InputJsonValue,
          sendLeadAppointmentEmail: sendAppointmentEmail,
          sendLeadGoalProjectionEmail: sendGoalProjectionEmail,
          investorId: investor.id,
          connectPortfolioSummaryId: riskAppetite,
          data: { goalData, riskProfileComplainceData },
          createdBy,
          updatedBy,
          GoalRecurringSavingsPlans: {
            create: {
              amount: monthlyContribution || 0,
              currency: 'GBP',
              frequency: GoalRecurringSavingsPlanFrequencyEnum.MONTHLY,
              status: GoalRecurringSavingsPlanStatusEnum.PENDING,
              data: Prisma.JsonNull,
              createdBy,
              updatedBy,
            },
          },
          recommendedMonthlyContribution: recommendedMonthlyContribution,
        },
      });
      return {
        ...newGoal,
        goalValue: newGoal.goalValue.toNumber(),
        recommendedMonthlyContribution:
          newGoal.recommendedMonthlyContribution.toNumber(),
        initialInvestment: newGoal.initialInvestment.toNumber(),
        status: newGoal.status as GoalStatusEnum,
        computedRiskProfile: newGoal.computedRiskProfile as Record<
          string,
          unknown
        >,
        data: (newGoal.data as Record<string, unknown>) || null,
        GoalRecurringDepositPlans: newGoal.GoalRecurringSavingsPlans.map(
          (plan) => {
            return {
              ...plan,
              data: (plan.data as Record<string, unknown>) || null,
              amount: plan.amount.toNumber(),
              frequency:
                plan.frequency as GoalRecurringSavingsPlanFrequencyEnum,
              status: plan.status as GoalRecurringSavingsPlanStatusEnum,
            };
          }
        ),
      };
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error while creating/updating record.`,
          `Error details: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async GetCountOfGoalsForTenant(
    requestId: string,
    tenantId: string
  ): Promise<number> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpsertLeadGoal.name,
      requestId
    );
    const loggingInput = {
      tenantId,
    };
    try {
      this.logger.debug(
        `${logPrefix} Payload: ${JsonUtils.Stringify(loggingInput)}.`
      );
      const result: number = await this.prisma.goals.count({
        where: {
          Investor: {
            tenantId,
          },
        },
      });
      this.logger.debug(
        `${logPrefix} End get count of goals for tenant. Results: ${JsonUtils.Stringify(
          result
        )}.`
      );
      return result;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error while creating/updating record.`,
          `Error details: ${JsonUtils.Stringify(error)}.`,
          `Input: ${JsonUtils.Stringify(loggingInput)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async GetGoalsForActiveWealthKernelAccounts(
    requestId: string,
    tenantId: string,
    partnerModelIds: string[],
    pageIndex: number,
    pageSize: number
  ): Promise<IGoalDetailedDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpsertLeadGoal.name,
      requestId
    );
    const loggingInput = {
      tenantId,
      pageIndex,
      pageSize,
      partnerModelIds,
    };
    try {
      this.logger.debug(`${logPrefix} Start get goals for tenant.`);
      this.logger.debug(
        `${logPrefix} Payload: ${JsonUtils.Stringify(loggingInput)}.`
      );
      const idList = await this.prisma.$queryRaw`SELECT DISTINCT goals.id
                                                 FROM goals
                                                          INNER JOIN connect_portfolio_summary
                                                                     ON goals.connect_portfolio_summary_id = connect_portfolio_summary.id
                                                          INNER JOIN transact_model_portfolios
                                                                     ON connect_portfolio_summary.id =
                                                                        transact_model_portfolios.connect_portfolio_summary_id
                                                          INNER JOIN investors ON goals.investor_id = investors.id
                                                          INNER JOIN investor_platform_users
                                                                     ON investors.id = investor_platform_users.investor_id
                                                          INNER JOIN investor_platform_user_accounts
                                                                     ON investor_platform_users.id =
                                                                        investor_platform_user_accounts.investor_platform_user_id
                                                 WHERE investor_platform_user_accounts.brokerage = 'WealthKernel'
                                                   AND investor_platform_user_accounts.partner_account_status = 'Active'
                                                   AND investors.tenant_id = ${tenantId}
                                                   AND transact_model_portfolios.partner_model_id = ANY (${partnerModelIds})
                                                 LIMIT ${pageSize} OFFSET ${
        pageIndex * pageSize
      };`;
      const results = await this.prisma.goals.findMany({
        where: {
          // ConnectPortfolioSummary: {
          //   TransactModelPortfolios: {
          //     every: {
          //       partnerModelId: {
          //         in: partnerModelIds,
          //       },
          //     },
          //   },
          // },
          // Investor: {
          //   tenantId,
          //   InvestorPlatformUsers: {
          //     every: {
          //       InvestorPlatformUserAccounts: {
          //         every: {
          //           brokerage: 'WealthKernel',
          //           partnerAccountStatus: 'Active',
          //         },
          //       },
          //     },
          //   },
          // },
          id: {
            in: (
              idList as {
                id: string;
              }[]
            ).map((item) => item.id),
          },
        },
        // take: pageSize,
        // skip: pageIndex * pageSize,
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          Investor: {
            include: {
              InvestorPlatformUsers: {
                include: {
                  InvestorPlatformUserAccounts: true,
                },
              },
            },
          },
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
      });
      this.logger.debug(
        `${logPrefix} End get goals for tenant. Results: ${JsonUtils.Stringify(
          results
        )}.`
      );
      return results.map((goal) => {
        return {
          ...goal,
          Investor: {
            ...goal.Investor,
            monthlySavings: goal.Investor?.monthlySavings
              ? goal.Investor?.monthlySavings.toNumber()
              : null,
            type: goal.Investor.type as unknown as InvestorTypeEnum,
            data: (goal.Investor.data as Record<string, unknown>) || null,
            InvestorPlatformUsers: goal.Investor.InvestorPlatformUsers.map(
              (user) => {
                return {
                  ...user,
                  data: (user.data as Record<string, unknown>) || null,
                  InvestorPlatformUserAccounts:
                    user.InvestorPlatformUserAccounts.map((account) => {
                      return {
                        ...account,
                        data: (account.data as Record<string, unknown>) || null,
                        brokerage:
                          account.brokerage as unknown as SharedEnums.SupportedBrokerageIntegrationEnum,
                      };
                    }),
                };
              }
            ),
          },
          goalValue: goal.goalValue.toNumber(),
          initialInvestment: goal.initialInvestment.toNumber(),
          status: goal.status as GoalStatusEnum,
          computedRiskProfile: goal.computedRiskProfile as Record<
            string,
            unknown
          >,
          recommendedMonthlyContribution:
            goal.recommendedMonthlyContribution.toNumber(),
          data: (goal.data as Record<string, unknown>) || null,
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
          GoalRecurringSavingsPlans: goal.GoalRecurringSavingsPlans.map(
            (plan) => {
              return {
                ...plan,
                data: (plan.data as Record<string, unknown>) || null,
                amount: plan.amount.toNumber(),
                frequency:
                  plan.frequency as GoalRecurringSavingsPlanFrequencyEnum,
                status: plan.status as GoalRecurringSavingsPlanStatusEnum,
              };
            }
          ),
        };
      });
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error while creating/updating record.`,
          `Error details: ${JsonUtils.Stringify(error)}.`,
          `Input: ${JsonUtils.Stringify(loggingInput)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async UpdateGoalStatus(
    requestId: string,
    goalId: string,
    status: GoalStatusEnum
  ): Promise<number> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateGoalStatus.name,
      requestId
    );
    const loggingInput = {
      goalId,
      status,
    };
    try {
      this.logger.debug(
        `${logPrefix} Start update goal status. Payload: ${JsonUtils.Stringify(
          loggingInput
        )}.`
      );
      const result = await this.prisma.goals.updateMany({
        where: {
          id: goalId,
        },
        data: {
          status,
        },
      });
      this.logger.debug(
        `${logPrefix} End update goal status. Results: ${JsonUtils.Stringify(
          result
        )}.`
      );
      return result.count;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error while updating record.`,
          `Error details: ${JsonUtils.Stringify(error)}.`,
          `Input: ${JsonUtils.Stringify(loggingInput)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async GetGoalsForTenantInvestor(
    requestId: string,
    tenantId: string,
    pageIndex: number,
    pageSize: number,
    investorId: string
  ): Promise<IInvestorPlatformProfileGoalDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetGoalsForTenantInvestor.name,
      requestId
    );
    const loggingInput = {
      tenantId,
      pageIndex,
      pageSize,
    };
    try {
      this.logger.debug(
        `${logPrefix} Start get goal for tenant. Input: ${JsonUtils.Stringify(
          loggingInput
        )}.`
      );
      const goalIds = await this.prisma.goals.findMany({
        where: {
          Investor: {
            tenantId,
          },
          investorId,
        },
        orderBy: {
          createdAt: 'asc',
        },
        skip: pageIndex * pageSize,
        take: pageSize,
        select: {
          id: true,
        },
      });
      const promises = goalIds.map((goal) => {
        const { id } = goal;
        return this.GetGoalForTenantInvestor(
          requestId,
          tenantId,
          id,
          investorId
        );
      });
      const dbRows = await Promise.all(promises);
      const results: IInvestorPlatformProfileGoalDto[] = [];
      dbRows.forEach((row) => {
        if (row !== undefined && row !== null) {
          results.push(row);
        }
      });
      return results;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error while updating record.`,
          `Error details: ${JsonUtils.Stringify(error)}.`,
          `Input: ${JsonUtils.Stringify(loggingInput)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async GetCountOfGoalsForTenantInvestor(
    requestId: string,
    tenantId: string,
    investorId: string
  ): Promise<number> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetCountOfGoalsForTenantInvestor.name,
      requestId
    );
    const loggingInput = {
      tenantId,
      investorId,
    };
    try {
      this.logger.debug(
        `${logPrefix} Start get goal for tenant. Input: ${JsonUtils.Stringify(
          loggingInput
        )}.`
      );
      const dbResult = await this.prisma.goals.count({
        where: {
          Investor: {
            tenantId,
          },
          investorId,
        },
      });
      this.logger.debug(
        `${logPrefix} End get goal for tenant. Results: ${dbResult}.`
      );
      return dbResult;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error while updating record.`,
          `Error details: ${JsonUtils.Stringify(error)}.`,
          `Input: ${JsonUtils.Stringify(loggingInput)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async GetGoalForTenantInvestor(
    requestId: string,
    tenantId: string,
    goalId: string,
    investorId: string
  ): Promise<IInvestorPlatformProfileGoalDto | null> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetGoalForTenantInvestor.name,
      requestId
    );
    const loggingInput = {
      tenantId,
      goalId,
    };
    try {
      this.logger.debug(
        `${logPrefix} Start get goal for tenant. Input: ${JsonUtils.Stringify(
          loggingInput
        )}.`
      );
      const goal = await this.prisma.goals.findFirst({
        where: {
          id: goalId,
          Investor: {
            tenantId,
          },
          investorId,
        },
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
      });
      if (!goal) {
        return null;
      }
      const {
        goalValue,
        initialInvestment,
        status,
        data,
        computedRiskProfile,
        GoalRecurringSavingsPlans,
      } = goal;
      return {
        ...goal,
        goalValue: goalValue.toNumber(),
        initialInvestment: initialInvestment.toNumber(),
        status: status as GoalStatusEnum,
        recommendedMonthlyContribution:
          goal.recommendedMonthlyContribution.toNumber(),
        data: (data as unknown as Record<string, unknown>) || null,
        computedRiskProfile: computedRiskProfile as unknown as Record<
          string,
          unknown
        >,
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
                    modelPortfolio.expectedAnnualVolatility?.toNumber() || null,
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
        GoalRecurringSavingsPlans: GoalRecurringSavingsPlans.map((plan) => {
          return {
            ...plan,
            amount: plan.amount.toNumber(),
            frequency: plan.frequency as GoalRecurringSavingsPlanFrequencyEnum,
            status: plan.status as GoalRecurringSavingsPlanStatusEnum,
            data: (goal.data as unknown as Record<string, unknown>) || null,
          };
        }),
      };
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error while updating record.`,
          `Error details: ${JsonUtils.Stringify(error)}.`,
          `Input: ${JsonUtils.Stringify(loggingInput)}.`,
        ].join(' ')
      );
      throw error;
    }
  }
}
