import { IConnectPortfolioSummaryDto } from './connect-portfolio-summary';
import { IGoalRecurringSavingsPlanDto } from './i-goal-recurring-savings-plan.dto';
import { IGoalDto } from './i-goal.dto';
import {
  IInvestorDto,
  IInvestorPlatformUserAccountDto,
  IInvestorPlatformUserDto,
} from './i-investor.dto';
import { IGetModelPortfolioByIdResponseDto } from './i-transact-model-portfolio.dto';
import { IRiskProfileDto } from './risk-profiling';

export interface IGoalDetailedConnectPortfolioSummaryDto
  extends Omit<IConnectPortfolioSummaryDto, 'riskProfileId'> {
  RiskProfile: IRiskProfileDto;
  TransactModelPortfolios?: IGetModelPortfolioByIdResponseDto[] | null;

  // random shit that needs fixing later
  risk_profile_id: string;
  tenantId: string;
  sortKey: number;
}

export interface IGoalDetailedDto extends IGoalDto {
  Investor: IInvestorDto & {
    InvestorPlatformUsers: Array<
      IInvestorPlatformUserDto & {
        InvestorPlatformUserAccounts: IInvestorPlatformUserAccountDto[];
      }
    >;
  };
  ConnectPortfolioSummary?: IGoalDetailedConnectPortfolioSummaryDto | null;
  GoalRecurringSavingsPlans?: IGoalRecurringSavingsPlanDto[] | null;
}
