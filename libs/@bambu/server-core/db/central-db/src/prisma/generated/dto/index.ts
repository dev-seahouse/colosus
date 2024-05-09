import { ConnectAdvisorPreferences as _ConnectAdvisorPreferences } from './connect-advisor-preferences';
import {
  ConnectPortfolioSummary as _ConnectPortfolioSummary,
  ConnectPortfolioSummaryMutable as _ConnectPortfolioSummaryMutable,
} from './connect-portfolio-summary';
import { ConnectTenant as _ConnectTenant } from './connect-tenant';
import { ConnectAdvisor as _ConnectAdvisor } from './connect_advisor';
import { GoalType as _GoalType } from './goal_type';
import { Lead as _Lead, LeadMutable as _LeadMutable } from './lead';
import { Otp as _Otp } from './otp';
import { Tenant as _Tenant } from './tenant';
import { TenantApiKey as _TenantApiKey } from './tenant_api_key';
import { TenantBranding as _TenantBranding } from './tenant_branding';
import { TenantHttpUrl as _TenantHttpUrl } from './tenant_http_url';
import { TenantSubscription as _TenantSubscription } from './tenant_subscription';
import { User as _User } from './user';
import { RiskProfiles as _RiskProfiles } from './risk-profiles';

export namespace PrismaModel {
  export class Lead extends _Lead {}

  export class LeadMutable extends _LeadMutable {}

  export class ConnectTenant extends _ConnectTenant {}

  export class Tenant extends _Tenant {}

  export class TenantSubscription extends _TenantSubscription {}

  export class TenantApiKey extends _TenantApiKey {}

  export class TenantBranding extends _TenantBranding {}

  export class TenantHttpUrl extends _TenantHttpUrl {}

  export class User extends _User {}

  export class ConnectAdvisor extends _ConnectAdvisor {}

  export class GoalType extends _GoalType {}

  export class Otp extends _Otp {}

  export class ConnectAdvisorPreferences extends _ConnectAdvisorPreferences {}

  export class ConnectPortfolioSummary extends _ConnectPortfolioSummary {}

  export class ConnectPortfolioSummaryMutable extends _ConnectPortfolioSummaryMutable {}

  export class RiskProfiles extends _RiskProfiles {}

  export const extraModels = [
    Tenant,
    TenantSubscription,
    TenantApiKey,
    TenantBranding,
    TenantHttpUrl,
    User,
    ConnectAdvisor,
    Otp,
    GoalType,
    ConnectAdvisorPreferences,
    ConnectPortfolioSummary,
    ConnectPortfolioSummaryMutable,
  ];
}
