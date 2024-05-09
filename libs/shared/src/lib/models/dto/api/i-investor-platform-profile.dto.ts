import { IGoalDetailedConnectPortfolioSummaryDto } from './i-goal-detailed.dto';
import { IGoalRecurringSavingsPlanDto } from './i-goal-recurring-savings-plan.dto';
import { IGoalDto } from './i-goal.dto';
import {
  IInvestorDto,
  IInvestorPlatformUserAccountDto,
  IInvestorPlatformUserDto,
} from './i-investor.dto';

export interface IInvestorPlatformProfileGoalDto extends IGoalDto {
  GoalRecurringSavingsPlans: IGoalRecurringSavingsPlanDto[];
  ConnectPortfolioSummary: IGoalDetailedConnectPortfolioSummaryDto | null;
  portfolioValue?: number | null;
  portfolioValueCurrency?: string | null;
  portfolioValueDate?: string | null;
  portfolioCumulativeReturn?: number | null;
  portfolioCumulativeReturnDate?: string | null;
}

export interface IInvestorPlatformProfileInvestmentPlatformUsersDto
  extends IInvestorPlatformUserDto {
  InvestorPlatformUserAccounts: IInvestorPlatformUserAccountDto[];
}

export interface IInvestorPlatformProfileDto extends IInvestorDto {
  Goals: IInvestorPlatformProfileGoalDto[];
  InvestorPlatformUsers: IInvestorPlatformProfileInvestmentPlatformUsersDto[];
}
