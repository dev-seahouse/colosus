// authentication
import { authenticationApiHandlers } from '../lib/Authentication/mocks/handlers';

// api library integration
import { bambuApiLibraryIntegrationCountryMetadataApiHandlers } from '../lib/BambuApiLibraryIntegration/CountryMetadata/mocks/handlers';
import { bambuApiLibraryIntegrationEducationApiHandlers } from '../lib/BambuApiLibraryIntegration/Education/mocks/handlers';
import { bambuApiLibraryIntegrationGraphApiHandlers } from '../lib/BambuApiLibraryIntegration/Graph/mocks/handlers';
import { bambuApiLibraryIntegrationHouseApiHandlers } from '../lib/BambuApiLibraryIntegration/House/mocks/handlers';
import { bambuApiLibraryIntegrationRetirementApiHandlers } from '../lib/BambuApiLibraryIntegration/Retirement/mocks/handlers';

// connect advisor
import { connectAdvisorAuthApiHandlers } from '../lib/ConnectAdvisor/Auth/mocks/handlers';
import { connectAdvisorBrandAndSubdomainApiHandlers } from '../lib/ConnectAdvisor/BrandAndSubdomain/mocks/handlers';
import { connectAdvisorBrandingApiHandlers } from '../lib/ConnectAdvisor/Branding/mocks/handlers';
import { connectAdvisorContactMeApiHandlers } from '../lib/ConnectAdvisor/ContactMe/mocks/handlers';
import { connectAdvisorGoalTypesApiHandlers } from '../lib/ConnectAdvisor/GoalTypes/mocks/handlers';
import { connectAdvisorLegalDocumentApiHandler } from '../lib/ConnectAdvisor/LegalDocument/mocks/handlers';
import { connectAdvisorPortfolioSummaryApiHandlers } from '../lib/ConnectAdvisor/PortfolioSummary/mocks/handlers';
import { connectAdvisorProfileApiHandlers } from '../lib/ConnectAdvisor/Profile/mocks/handlers';
import { connectAdvisorProfileBioApiHandlers } from '../lib/ConnectAdvisor/ProfileBio/mocks/handlers';
import { connectAdvisorTopLevelOptionsApiHandlers } from '../lib/ConnectAdvisor/TopLevelOptions/mocks/handlers';
import { connectAdvisorPreferencesApiHandler } from './../lib/ConnectAdvisor/Preferences/mocks/handlers';
import { connectAdvisorRiskProfilingApiHandlers } from '../lib/ConnectAdvisor/RiskProfiling/mocks/handlers';

// connect investor
import { connectInvestorAdvisorProfileApiHandlers } from '../lib/ConnectInvestor/AdvisorProfile/mocks/handlers';
import { connectInvestorGoalTypesApiHandlers } from '../lib/ConnectInvestor/GoalTypes/mocks/handlers';
import { connectInvestorLeadsApiHandler } from '../lib/ConnectInvestor/Leads/mocks/handlers';
import { connectInvestorLegalDocumentApiHandler } from '../lib/ConnectInvestor/LegalDocument/mocks/handlers';
import { connectInvestorModelPortfoliosApiHandlers } from '../lib/ConnectInvestor/ModelPortfolios/mocks/handlers';
import { connectInvestorModelPortfolioDetailsApiHandlers } from '../lib/ConnectInvestor/InvestorPortfolios/mocks/handlers';

// transact investor
import { transactInvestorAuthApiHandlers } from '../lib/TransactInvestor/Auth/mocks/handlers';
// stripe-integration
import { stripeIntegrationAdvisorSubscriptionsApiHandlers } from '../lib/StripeIntegration/AdvisorSubscriptions/mocks/handlers';
import { stripeIntegrationBillingPortalApiHandlers } from '../lib/StripeIntegration/BillingPortal/mocks/handlers';
import { stripeIntegrationPricesApiHandlers } from '../lib/StripeIntegration/Prices/mocks/handlers';

// tenant
import { tenantBrandingApiHandlers } from '../lib/Tenant/Branding/mocks/handlers';
import { connectAdvisorLeadsApiHandlers } from '../lib/ConnectAdvisor/Leads/mocks/handlers';
import { connectInvestorRiskProfilingHandlers } from '../lib/ConnectInvestor/RiskProfiling/mocks/handlers';
import { transactInvestorAuthenticatedBrokerageMocksHandlers } from '../lib/TransactInvestor/Authenticated/Brokerage/mocks/handlers';
import { transactInvestorAuthenticatedProfileHandlers } from '../lib/TransactInvestor/Authenticated/Profile/mocks/handlers';
import { transactInvestorInstrumentsHandlers } from '../lib/TransactInvestor/Instruments/mocks/handlers';
import { transactInvestorAuthenticatedGoalsHandlers } from '../lib/TransactInvestor/Authenticated/Goals/mocks/handlers';
import { transactAdvisorInstrumentsHandlers } from '../lib/TransactAdvisor/Instruments/mocks/handlers';
import { transactAdvisorModelPortfolioHandlers } from '../lib/TransactAdvisor/ModelPortfolio/mocks/handlers';
import { transactInvestorModelPortfolioHandlers } from '../lib/TransactInvestor/ModelPortfolio/mocks/handlers';

import { transactAdvisorBankAccountApiHandlers } from '../lib/TransactAdvisor/AdvisorBankAccount/mocks/handlers';
import transactInvestorAuthenticatedBrokerageBankAccountsHandlersV2 from '../lib/TransactInvestor/Authenticated/Brokerage/BankAccounts/mocks/handlers';

// handler goes here
export const handlers = [
  ...authenticationApiHandlers,
  ...bambuApiLibraryIntegrationCountryMetadataApiHandlers,
  ...bambuApiLibraryIntegrationEducationApiHandlers,
  ...bambuApiLibraryIntegrationGraphApiHandlers,
  ...bambuApiLibraryIntegrationHouseApiHandlers,
  ...bambuApiLibraryIntegrationRetirementApiHandlers,
  ...connectAdvisorBrandAndSubdomainApiHandlers,
  ...connectAdvisorAuthApiHandlers,
  ...connectAdvisorBrandingApiHandlers,
  ...connectAdvisorContactMeApiHandlers,
  ...connectAdvisorGoalTypesApiHandlers,
  ...connectAdvisorLegalDocumentApiHandler,
  ...connectAdvisorPortfolioSummaryApiHandlers,
  ...connectAdvisorProfileApiHandlers,
  ...connectAdvisorLeadsApiHandlers,
  ...connectInvestorModelPortfolioDetailsApiHandlers,
  ...connectAdvisorPreferencesApiHandler,
  ...connectAdvisorProfileBioApiHandlers,
  ...connectAdvisorTopLevelOptionsApiHandlers,
  ...connectAdvisorRiskProfilingApiHandlers,
  ...connectInvestorAdvisorProfileApiHandlers,
  ...connectInvestorGoalTypesApiHandlers,
  ...connectInvestorLeadsApiHandler,
  ...connectInvestorLegalDocumentApiHandler,
  ...connectInvestorModelPortfoliosApiHandlers,
  ...connectInvestorRiskProfilingHandlers,
  ...transactInvestorAuthApiHandlers,
  ...transactInvestorAuthenticatedBrokerageMocksHandlers,
  ...transactInvestorAuthenticatedProfileHandlers,
  ...transactInvestorAuthenticatedGoalsHandlers,
  ...transactInvestorInstrumentsHandlers,
  ...transactInvestorAuthenticatedBrokerageBankAccountsHandlersV2,
  ...transactAdvisorInstrumentsHandlers,
  ...transactAdvisorBankAccountApiHandlers,
  ...transactAdvisorModelPortfolioHandlers,
  ...transactInvestorModelPortfolioHandlers,
  ...stripeIntegrationAdvisorSubscriptionsApiHandlers,
  ...stripeIntegrationBillingPortalApiHandlers,
  ...stripeIntegrationPricesApiHandlers,
  ...tenantBrandingApiHandlers,
];
