import { CentralDbPrismaModule } from '@bambu/server-core/db/central-db';
import { Module } from '@nestjs/common';
import { ConnectAdvisorCentralDbRepositoryService } from './connect-advisor-central-db-repository.service';
import {
  ConnectAdvisorPreferencesCentralDbRepositoryService,
  ConnectAdvisorPreferencesCentralDbRepositoryServiceBase,
} from './connect-advisor-preferences-central-db-repository.service';
import { ConnectPortfolioSummaryCentralDbRepositoryService } from './connect-portfolio-summary-central-db-repository.service';
import { ConnectTenantCentralDbRepositoryService } from './connect-tenant-central-db-repository.service';
import { ConnectTenantGoalTypeCentralDbRepositoryService } from './connect-tenant-goal-type-central-db-repository.service';
import {
  GoalCentralDbRepositoryService,
  GoalCentralDbRepositoryServiceBase,
} from './goal-central-db-repository.service';
import { GoalTypeCentralDbRepositoryService } from './goal-type-central-db-repository.service';
import {
  InstrumentsCentralDbRepositoryService,
  InstrumentsCentralDbRepositoryServiceBase,
} from './instruments-central-db-repository.service';
import {
  InvestorCentralDbRepositoryService,
  InvestorCentralDbRepositoryServiceBase,
} from './investor-central-db-repository.service';
import { LeadsCentralDbRepositoryService } from './leads-central-db-repository';
import { LegalDocumentSetCentralDbRepositoryService } from './legal-document-set-central-db-repository.service';
import { OtpCentralDbRepositoryService } from './otp-central-db-repository.service';
import { RiskProfilingCentralDbService } from './risk-profiling-db-repository.service';
import { TenantApiKeyCentralDbRepository } from './tenant-api-key-central-db-repository.service';
import { TenantBrandingCentralDbRepositoryService } from './tenant-branding-central-db-repository.service';
import { TenantCentralDbRepositoryService } from './tenant-central-db-repository.service';
import { TenantSubscriptionsCentralDbRepositoryService } from './tenant-subscriptions-central-db-repository.service';
import {
  TransactModelPortfolioCentralDbRepositoryService,
  TransactModelPortfolioCentralDbRepositoryServiceBase,
} from './transact-model-portfolio-central-db-repository.service';
import { UserCentralDbRepositoryService } from './user-central-db-repository.service';
import {
  TransactAdvisorCentralDbRepositoryService,
  TransactAdvisorCentralDbRepositoryServiceBase,
} from './transact-advisor-central-db-repository.service';

/**
 * Note: consider making this module a dynamic module,
 * and configurable with a forFeature(...), so that it defines product-specific repositories like
 * ConnectAdvisorCentralDbRepositoryService only if the product is enabled.
 */
@Module({
  imports: [CentralDbPrismaModule],
  providers: [
    {
      provide: TransactModelPortfolioCentralDbRepositoryServiceBase,
      useClass: TransactModelPortfolioCentralDbRepositoryService,
    },
    TenantCentralDbRepositoryService,
    OtpCentralDbRepositoryService,
    ConnectAdvisorCentralDbRepositoryService,
    UserCentralDbRepositoryService,
    TenantSubscriptionsCentralDbRepositoryService,
    TenantApiKeyCentralDbRepository,
    TenantBrandingCentralDbRepositoryService,
    ConnectTenantGoalTypeCentralDbRepositoryService,
    GoalTypeCentralDbRepositoryService,
    ConnectPortfolioSummaryCentralDbRepositoryService,
    LegalDocumentSetCentralDbRepositoryService,
    LeadsCentralDbRepositoryService,
    ConnectTenantCentralDbRepositoryService,
    RiskProfilingCentralDbService,
    {
      provide: ConnectAdvisorPreferencesCentralDbRepositoryServiceBase,
      useClass: ConnectAdvisorPreferencesCentralDbRepositoryService,
    },
    {
      provide: InvestorCentralDbRepositoryServiceBase,
      useClass: InvestorCentralDbRepositoryService,
    },
    {
      provide: GoalCentralDbRepositoryServiceBase,
      useClass: GoalCentralDbRepositoryService,
    },
    {
      provide: InstrumentsCentralDbRepositoryServiceBase,
      useClass: InstrumentsCentralDbRepositoryService,
    },
    {
      provide: TransactAdvisorCentralDbRepositoryServiceBase,
      useClass: TransactAdvisorCentralDbRepositoryService,
    },
  ],
  exports: [
    TenantCentralDbRepositoryService,
    OtpCentralDbRepositoryService,
    ConnectAdvisorCentralDbRepositoryService,
    UserCentralDbRepositoryService,
    TenantSubscriptionsCentralDbRepositoryService,
    TenantApiKeyCentralDbRepository,
    TenantBrandingCentralDbRepositoryService,
    ConnectTenantGoalTypeCentralDbRepositoryService,
    GoalTypeCentralDbRepositoryService,
    ConnectPortfolioSummaryCentralDbRepositoryService,
    LegalDocumentSetCentralDbRepositoryService,
    LeadsCentralDbRepositoryService,
    ConnectTenantCentralDbRepositoryService,
    ConnectAdvisorPreferencesCentralDbRepositoryServiceBase,
    RiskProfilingCentralDbService,
    InvestorCentralDbRepositoryServiceBase,
    GoalCentralDbRepositoryServiceBase,
    InstrumentsCentralDbRepositoryServiceBase,
    TransactModelPortfolioCentralDbRepositoryServiceBase,
    TransactAdvisorCentralDbRepositoryServiceBase,
  ],
})
export class CentralDbRepositoryModule {}
