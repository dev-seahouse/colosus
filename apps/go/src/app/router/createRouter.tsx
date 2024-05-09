import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';
import {
  createBrowserRouter,
  createMemoryRouter,
  defer,
} from 'react-router-dom';

import {
  getAdvisorProfileLoader,
  getBankAccountsPagedLoader,
  getBrandingLoader,
  getBrokerageProfileForInvestorLoader,
  getCountriesLoader,
  getDirectDebitMandatesLoader,
  getDocumentsLoader,
  getGoalsForTenantInvestorLoader,
  getInvestmentStyleQuestionnaireLoader,
  getInvestorGoalDetailsLoader,
  getInvestorProfileLoader,
  getModelPortfoliosLoader,
  LayoutWithProgress,
  SetupBranding,
  SkeletonLoading,
} from '@bambu/go-core';
import {
  getContributionRecommendationLader,
  getCountryRateLoader,
  getGoalSettingsLoader,
  getInvestorRiskProfilesLoader,
  getOptimizedProjectionLoader,
  InsightLoader,
} from '@bambu/go-goal-settings-feature';
import { IntroductionPage } from '@bambu/go-onboarding-feature';
import {
  ErrorBoundaryFallback,
  PageNotFound,
  RouterLoaderProvider,
} from '@bambu/react-ui';

import { queryClient } from '../../queryClient';
import InvestorAuthenticatedRoute from '../InvestorAuthenticatedRoute/InvestorAuthenticatedRoute';
import Suspense from '../Suspense/Suspense';
import OpenInvestAccountLazy from './OpenInvestAccountLazy';
import VerifyTransactionPageLazy from './VerifyTransactionLazy';

const InvestorLoginPageLazy = lazy(() => import('./InvestorLoginPageLazy'));
const InvestorCreateAccountPageLazy = lazy(
  () => import('./InvestorCreateAccountPageLazy')
);
const InvestorVerifyAccountPageLazy = lazy(
  () => import('./InvestorVerifyAccountLazy')
);
const InvestorNameLazy = lazy(() => import('./InvestorNameLazy'));
const InvestorLocationLazy = lazy(() => import('./InvestorLocationLazy'));
const InvestorAgeLazy = lazy(() => import('./InvestorAgeLazy'));
const InvestorAnnualIncomeLazy = lazy(
  () => import('./InvestorAnnualIncomeLazy')
);
const InvestorCashSavingsLazy = lazy(() => import('./InvestorCashSavingsLazy'));
const InvestorInvestmentStyleLazy = lazy(
  () => import('./InvestorInvestmentStyleLazy')
);
const InvestorInvestmentQuestionOneLazy = lazy(
  () => import('./InvestorInvestmentQuestionOneLazy')
);
const InvestorInvestmentQuestionTwoLazy = lazy(
  () => import('./InvestorInvestmentQuestionTwoLazy')
);

const InvestorInvestmentQuestionThreeLazy = lazy(
  () => import('./InvestorInvestmentQuestionThreeLazy')
);

const InvestorInvestmentQuestionFourLazy = lazy(
  () => import('./InvestorInvestmentQuestionFourLazy')
);

const InvestorInvestmentStyleResultLazy = lazy(
  () => import('./InvestorInvestmentStyleResultLazy')
);

// Transact
const InvestorDashboardLazy = lazy(() => import('./InvestorDashboardLazy'));
const InvestorPaymentSettingsLazy = lazy(
  () => import('./InvestorPaymentSettingsLazy')
);
const DirectDebitMandateSetupLazy = lazy(
  () => import('./DirectDebitMandateSetupLazy')
);
const DirectDebitConfirmationLazy = lazy(
  () => import('./DirectDebitConfirmationLazy')
);
const GoalDetailsLazy = lazy(() => import('./GoalDetailsPageLazy'));
const DepositLazy = lazy(() => import('./DepositLazy'));
const WithdrawalLazy = lazy(() => import('./WithdrawalLazy'));
const CancelRecurringDepositLazy = lazy(
  () => import('./CancelRecurringDepositLazy')
);

const SelectGoalLazy = lazy(() => import('./SelectGoalLazy'));
const HouseFlowLazy = lazy(() => import('./HouseFlowLazy'));
const HouseDownpaymentLazy = lazy(() => import('./HouseDownpaymentLazy'));
const HousePurchaseYearLazy = lazy(() => import('./HousePurchaseYearLazy'));
const EducationFlowLazy = lazy(() => import('./EducationFlowLazy'));
const EducationFeesFormLazy = lazy(() => import('./EducationFeesFormLazy'));
const EducationStartYearFormLazy = lazy(
  () => import('./EducationStartYearFormLazy')
);
const GrowMyWealthFlowLazy = lazy(() => import('./GrowMyWealthFlowLazy'));
const GrowMyWealthFormLazy = lazy(() => import('./GrowMyWealthFormLazy'));
const GoalTimeframeFormLazy = lazy(() => import('./GoalTimeframeFormLazy'));
const OtherFlowLazy = lazy(() => import('./OtherFlowLazy'));
const OtherGoalNameLazy = lazy(() => import('./OtherGoalNameLazy'));
const OtherGoalAmountLazy = lazy(() => import('./OtherGoalAmountLazy'));
const OtherGoalYearLazy = lazy(() => import('./OtherGoalYearLazy'));

const RetirementFlowLazy = lazy(() => import('./RetirementFlowLazy'));
const RetirementAgeFormLazy = lazy(() => import('./RetirementAgeFormLazy'));
const RetirementMonthlyExpensesFormLazy = lazy(
  () => import('./RetirementMonthlyExpensesFormLazy')
);
const SetupContributionLazy = lazy(() => import('./SetupContributionLazy'));

const GoalInsightLazy = lazy(() => import('./GoalInsightLazy'));
const ScheduleAppointmentLazy = lazy(() => import('./ScheduleAppointmentLazy'));
const AppointmentScheduledLazy = lazy(
  () => import('./AppointmentScheduledLazy')
);

const RoboInstructionLazy = lazy(() => import('./RoboInstructionLazy'));

const GetFinancialPlanLazy = lazy(() => import('./GetFinancialPlanLazy'));
const FinancialPlanSentLazy = lazy(() => import('./FinancialPlanSentLazy'));
const VersionPageLazy = lazy(() => import('../VersionPage/VersionPage'));

export const INVESTOR_ROUTES = {
  ROOT: '/',
  INVESTMENT_STYLE: 'investment-style',
  INVESTMENT_STYLE_QUESTION_ONE: 'investment-style-question-one',
  INVESTMENT_STYLE_QUESTION_TWO: 'investment-style-question-two',
  INVESTMENT_STYLE_QUESTION_THREE: 'investment-style-question-three',
  INVESTMENT_STYLE_QUESTION_FOUR: 'investment-style-question-four',
  INVESTMENT_STYLE_RESULT: 'investment-style-result',
  LOGIN: 'login',
  CREATE_ACCOUNT: 'create-account',
  VERIFY_ACCOUNT: 'verify-account',
  DASHBOARD: 'dashboard',
  GOAL_DETAILS: 'goal-details/:goalId',
  PAYMENT_SETTINGS: 'payment-settings/:goalId',
  DIRECT_DEBIT_MANDATE_SETUP: 'direct-debit-mandate-setup',
  DIRECT_DEBIT_CONFIRM: 'direct-debit-confirm',
  DEPOSIT: 'deposit/:goalId',
  WITHDRAWAL: 'withdrawal/:goalId',
  CANCEL_RECURRING_DEPOSIT: 'cancel-recurring-deposit/:goalId',
  VERIFY_TRANSACTION: 'verify-transaction',
  OPEN_INVEST_ACCOUNT: 'open-invest-account',
  GETTING_TO_KNOW_YOU: 'getting-to-know-you',
  SELECT_GOAL: 'select-goal',
  HOUSE: 'house',
  EDUCATION: 'education',
  GROW_MY_WEALTH: 'grow-my-wealth',
  OTHER_GOAL: 'other-goal',
  RETIREMENT: 'retirement',
  GOAL_INSIGHT: 'goal-insight',
  SCHEDULE_APPOINTMENT: 'schedule-appointment',
  APPOINTMENT_SCHEDULED: 'appointment-scheduled',
  GET_FINANCIAL_PLAN: 'get-financial-plan',
  FINANCIAL_PLAN_SENT: 'financial-plan-sent',
  ROBO_INSTRUCTIONS: 'robo-instructions',
} as const;

const RiskQuestionnaireRoutes = [
  {
    path: INVESTOR_ROUTES.INVESTMENT_STYLE,
    loader: getInvestorRiskProfilesLoader(queryClient),
    element: (
      <Suspense fallback={<SkeletonLoading variant={'full'} />}>
        <InvestorInvestmentStyleLazy />
      </Suspense>
    ),
  },
  {
    path: INVESTOR_ROUTES.INVESTMENT_STYLE_QUESTION_ONE,
    loader: getInvestmentStyleQuestionnaireLoader(queryClient),
    element: (
      <Suspense fallback={<SkeletonLoading variant="full" />}>
        <InvestorInvestmentQuestionOneLazy />
      </Suspense>
    ),
  },
  {
    path: INVESTOR_ROUTES.INVESTMENT_STYLE_QUESTION_TWO,
    loader: getInvestmentStyleQuestionnaireLoader(queryClient),
    element: (
      <Suspense fallback={<SkeletonLoading variant="full" />}>
        <InvestorInvestmentQuestionTwoLazy />
      </Suspense>
    ),
  },
  {
    path: INVESTOR_ROUTES.INVESTMENT_STYLE_QUESTION_THREE,
    loader: getInvestmentStyleQuestionnaireLoader(queryClient),
    element: (
      <Suspense fallback={<SkeletonLoading variant="full" />}>
        <InvestorInvestmentQuestionThreeLazy />
      </Suspense>
    ),
  },
  {
    path: INVESTOR_ROUTES.INVESTMENT_STYLE_QUESTION_FOUR,
    loader: getInvestmentStyleQuestionnaireLoader(queryClient),
    element: (
      <Suspense fallback={<SkeletonLoading variant="full" />}>
        <InvestorInvestmentQuestionFourLazy />
      </Suspense>
    ),
  },
  {
    path: INVESTOR_ROUTES.INVESTMENT_STYLE_RESULT,
    loader: getInvestorRiskProfilesLoader(queryClient),
    element: (
      <Suspense fallback={<SkeletonLoading variant="full" />}>
        <InvestorInvestmentStyleResultLazy />
      </Suspense>
    ),
  },
];

const ROUTES: RouteObject[] = [
  {
    path: INVESTOR_ROUTES.ROOT,
    errorElement: <ErrorBoundaryFallback />,
    loader: async () =>
      defer({
        branding: getBrandingLoader(queryClient)(),
        advisorProfile: getAdvisorProfileLoader(queryClient)(),
        documents: getDocumentsLoader(queryClient)(), // defer slow loading documents
      }),
    element: (
      <RouterLoaderProvider>
        <SetupBranding />
      </RouterLoaderProvider>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<SkeletonLoading variant="full" />}>
            <IntroductionPage />
          </Suspense>
        ),
      },
      {
        path: INVESTOR_ROUTES.LOGIN,
        element: (
          <Suspense>
            <InvestorLoginPageLazy />
          </Suspense>
        ),
      },
      {
        path: INVESTOR_ROUTES.CREATE_ACCOUNT,
        errorElement: <ErrorBoundaryFallback />,
        element: (
          <Suspense>
            <InvestorCreateAccountPageLazy />
          </Suspense>
        ),
      },
      {
        path: INVESTOR_ROUTES.VERIFY_ACCOUNT,
        errorElement: <ErrorBoundaryFallback />,
        element: (
          <Suspense fallback={<SkeletonLoading variant="full" />}>
            <InvestorVerifyAccountPageLazy />
          </Suspense>
        ),
      },
      {
        path: INVESTOR_ROUTES.DASHBOARD,
        errorElement: <ErrorBoundaryFallback />,
        loader: async () =>
          defer({
            goals: getGoalsForTenantInvestorLoader(queryClient)(),
            investorProfile: getInvestorProfileLoader(queryClient)(),
            mandates: getDirectDebitMandatesLoader(queryClient)(),
            brokerageProfile:
              getBrokerageProfileForInvestorLoader(queryClient)(),
          }),
        element: (
          <InvestorAuthenticatedRoute>
            <InvestorDashboardLazy />
          </InvestorAuthenticatedRoute>
        ),
      },
      {
        path: INVESTOR_ROUTES.GOAL_DETAILS,
        errorElement: <ErrorBoundaryFallback />,
        loader: async ({ params }) =>
          defer({
            mandates: getDirectDebitMandatesLoader(queryClient)(),
            investorProfile: getInvestorProfileLoader(queryClient)(),
            riskProfiles: getInvestorRiskProfilesLoader(queryClient)(),
            modelPortfolios: getModelPortfoliosLoader(queryClient)(),
            brokerageProfile:
              getBrokerageProfileForInvestorLoader(queryClient)(),
            goalDetails: getInvestorGoalDetailsLoader(queryClient, {
              goalId: params.goalId ?? '',
            })(),
          }),
        element: (
          <InvestorAuthenticatedRoute
            fallback={<SkeletonLoading variant={'full'} />}
          >
            <GoalDetailsLazy />
          </InvestorAuthenticatedRoute>
        ),
      },
      {
        path: INVESTOR_ROUTES.PAYMENT_SETTINGS,
        loader: async () =>
          defer({
            investorProfile: getInvestorProfileLoader(queryClient)(),
            directDebitMandates: getDirectDebitMandatesLoader(queryClient)(),
          }),
        errorElement: <ErrorBoundaryFallback />,
        element: (
          <InvestorAuthenticatedRoute
            fallback={<SkeletonLoading variant="full" />}
          >
            <InvestorPaymentSettingsLazy />
          </InvestorAuthenticatedRoute>
        ),
      },
      {
        path: INVESTOR_ROUTES.DIRECT_DEBIT_MANDATE_SETUP,
        errorElement: <ErrorBoundaryFallback />,
        loader: async () =>
          defer({
            directDebitMandates: getDirectDebitMandatesLoader(queryClient)(),
          }),
        element: (
          <InvestorAuthenticatedRoute
            fallback={<SkeletonLoading variant="full" />}
          >
            <DirectDebitMandateSetupLazy />
          </InvestorAuthenticatedRoute>
        ),
      },
      {
        path: INVESTOR_ROUTES.DIRECT_DEBIT_CONFIRM,
        loader: async () =>
          defer({
            bankAccounts: getBankAccountsPagedLoader(queryClient)(),
            userProfile: getInvestorProfileLoader(queryClient)(),
            mandates: getDirectDebitMandatesLoader(queryClient)(),
          }),
        errorElement: <ErrorBoundaryFallback />,
        element: (
          <InvestorAuthenticatedRoute
            fallback={<SkeletonLoading variant="full" />}
          >
            <DirectDebitConfirmationLazy />
          </InvestorAuthenticatedRoute>
        ),
      },
      {
        path: INVESTOR_ROUTES.DEPOSIT,
        loader: async ({ params }) =>
          defer({
            mandates: getDirectDebitMandatesLoader(queryClient)(),
            goalDetails: getInvestorGoalDetailsLoader(queryClient, {
              goalId: params.goalId ?? '',
            })(),
          }),
        errorElement: <ErrorBoundaryFallback />,
        element: (
          <InvestorAuthenticatedRoute
            fallback={<SkeletonLoading variant={'full'} />}
          >
            <DepositLazy />
          </InvestorAuthenticatedRoute>
        ),
      },
      {
        path: INVESTOR_ROUTES.WITHDRAWAL,
        loader: async ({ params }) =>
          defer({
            mandates: getDirectDebitMandatesLoader(queryClient)(),
            goalDetails: getInvestorGoalDetailsLoader(queryClient, {
              goalId: params.goalId ?? '',
            })(),
          }),
        errorElement: <ErrorBoundaryFallback />,
        element: (
          <InvestorAuthenticatedRoute
            fallback={<SkeletonLoading variant={'full'} />}
          >
            <WithdrawalLazy />
          </InvestorAuthenticatedRoute>
        ),
      },
      {
        path: INVESTOR_ROUTES.CANCEL_RECURRING_DEPOSIT,
        loader: async ({ params }) =>
          defer({
            mandates: getDirectDebitMandatesLoader(queryClient)(),
            goalDetails: getInvestorGoalDetailsLoader(queryClient, {
              goalId: params.goalId ?? '',
            })(),
          }),
        errorElement: <ErrorBoundaryFallback />,
        element: (
          <InvestorAuthenticatedRoute
            fallback={<SkeletonLoading variant={'full'} />}
          >
            <CancelRecurringDepositLazy />
          </InvestorAuthenticatedRoute>
        ),
      },
      {
        path: INVESTOR_ROUTES.VERIFY_TRANSACTION,
        errorElement: <ErrorBoundaryFallback />,
        element: (
          <Suspense fallback={<SkeletonLoading variant="full" />}>
            <VerifyTransactionPageLazy />
          </Suspense>
        ),
      },

      {
        path: INVESTOR_ROUTES.OPEN_INVEST_ACCOUNT,
        errorElement: <ErrorBoundaryFallback />,
        loader: async () =>
          defer({
            investorProfile: getInvestorProfileLoader(queryClient)(),
            countries: getCountriesLoader(queryClient)(),
          }),
        element: (
          <InvestorAuthenticatedRoute
            fallback={<SkeletonLoading variant="full" />}
          >
            <OpenInvestAccountLazy />
          </InvestorAuthenticatedRoute>
        ),
      },
      {
        path: INVESTOR_ROUTES.GETTING_TO_KNOW_YOU,
        element: <LayoutWithProgress />,
        children: [
          {
            path: 'name',
            element: (
              <Suspense fallback={<SkeletonLoading variant="full" />}>
                <InvestorNameLazy />
              </Suspense>
            ),
          },
          {
            path: 'location',
            element: (
              <Suspense fallback={<SkeletonLoading variant="full" />}>
                <InvestorLocationLazy />
              </Suspense>
            ),
          },
          {
            path: 'age',
            loader: async () =>
              defer({
                investmentStyleQuestionnaire:
                  getInvestmentStyleQuestionnaireLoader(queryClient)(),
              }),
            element: (
              <Suspense fallback={<SkeletonLoading variant="full" />}>
                <InvestorAgeLazy />
              </Suspense>
            ),
          },
          {
            path: 'annual-income',
            loader: async () =>
              defer({
                investmentStyleQuestionnaire:
                  getInvestmentStyleQuestionnaireLoader(queryClient)(),
              }),
            element: (
              <Suspense fallback={<SkeletonLoading variant="full" />}>
                <InvestorAnnualIncomeLazy />
              </Suspense>
            ),
          },
          {
            path: 'cash-savings', // for i'm retired flow
            element: (
              <Suspense fallback={<SkeletonLoading variant="full" />}>
                <InvestorCashSavingsLazy />
              </Suspense>
            ),
          },
          ...RiskQuestionnaireRoutes,
        ],
      },
      {
        path: INVESTOR_ROUTES.SELECT_GOAL,
        loader: async () =>
          defer({
            goalSettings: getGoalSettingsLoader(queryClient)(),
          }),
        element: (
          <RouterLoaderProvider>
            <SelectGoalLazy />
          </RouterLoaderProvider>
        ),
      },
      {
        path: INVESTOR_ROUTES.HOUSE,
        errorElement: <ErrorBoundaryFallback />,
        element: (
          <Suspense>
            <HouseFlowLazy />
          </Suspense>
        ),
        children: [
          ...RiskQuestionnaireRoutes,
          {
            path: 'down-payment',
            element: (
              <Suspense fallback={<SkeletonLoading variant="full" />}>
                <HouseDownpaymentLazy />
              </Suspense>
            ),
          },
          {
            path: 'purchase-year',
            loader: async () =>
              defer({
                investmentStyleQuestionnaire:
                  getInvestmentStyleQuestionnaireLoader(queryClient)(),
              }),
            element: (
              <Suspense fallback={<SkeletonLoading variant="full" />}>
                <HousePurchaseYearLazy />
              </Suspense>
            ),
          },
          {
            path: 'setup-contribution',
            loader: async () => {
              return defer({
                contributionRecommendation:
                  getContributionRecommendationLader(queryClient)(),
              });
            },
            element: (
              <RouterLoaderProvider
                fallback={<SkeletonLoading variant="full" />}
              >
                <SetupContributionLazy />
              </RouterLoaderProvider>
            ),
          },
        ],
      },
      {
        path: INVESTOR_ROUTES.EDUCATION,
        errorElement: <ErrorBoundaryFallback />,
        element: (
          <Suspense>
            <EducationFlowLazy />
          </Suspense>
        ),
        children: [
          ...RiskQuestionnaireRoutes,
          {
            path: 'fee',
            element: (
              <Suspense fallback={<SkeletonLoading variant="full" />}>
                <EducationFeesFormLazy />
              </Suspense>
            ),
          },
          {
            path: 'start-year',
            element: (
              <Suspense fallback={<SkeletonLoading variant="full" />}>
                <EducationStartYearFormLazy />
              </Suspense>
            ),
          },
          {
            path: 'setup-contribution',
            loader: async () => {
              return defer({
                contributionRecommendation:
                  getContributionRecommendationLader(queryClient)(),
              });
            },
            element: (
              <RouterLoaderProvider
                fallback={<SkeletonLoading variant="full" />}
              >
                <SetupContributionLazy />
              </RouterLoaderProvider>
            ),
          },
        ],
      },
      {
        path: INVESTOR_ROUTES.GROW_MY_WEALTH,
        errorElement: <ErrorBoundaryFallback />,
        element: (
          <Suspense>
            <GrowMyWealthFlowLazy />
          </Suspense>
        ),
        children: [
          ...RiskQuestionnaireRoutes,
          {
            path: 'amount',
            element: (
              <Suspense fallback={<SkeletonLoading variant="full" />}>
                <GrowMyWealthFormLazy />
              </Suspense>
            ),
          },
          {
            path: 'timeframe',
            element: (
              <Suspense fallback={<SkeletonLoading variant="full" />}>
                <GoalTimeframeFormLazy />
              </Suspense>
            ),
          },
          {
            path: 'setup-contribution',
            element: (
              <Suspense fallback={<SkeletonLoading variant="full" />}>
                <SetupContributionLazy />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: INVESTOR_ROUTES.OTHER_GOAL,
        errorElement: <ErrorBoundaryFallback />,
        element: (
          <Suspense>
            <OtherFlowLazy />
          </Suspense>
        ),
        children: [
          ...RiskQuestionnaireRoutes,
          {
            path: 'name',
            element: (
              <Suspense fallback={<SkeletonLoading variant="full" />}>
                <OtherGoalNameLazy />
              </Suspense>
            ),
          },
          {
            path: 'amount',
            element: (
              <Suspense fallback={<SkeletonLoading variant="full" />}>
                <OtherGoalAmountLazy />
              </Suspense>
            ),
          },
          {
            path: 'year',
            element: (
              <Suspense fallback={<SkeletonLoading variant="full" />}>
                <OtherGoalYearLazy />
              </Suspense>
            ),
          },
          {
            path: 'setup-contribution',
            loader: async () => {
              return defer({
                contributionRecommendation:
                  getContributionRecommendationLader(queryClient)(),
              });
            },
            element: (
              <RouterLoaderProvider
                fallback={<SkeletonLoading variant="full" />}
              >
                <SetupContributionLazy />
              </RouterLoaderProvider>
            ),
          },
        ],
      },
      {
        path: INVESTOR_ROUTES.RETIREMENT,
        errorElement: <ErrorBoundaryFallback />,
        loader: async () =>
          defer({
            // TODO: on every subroute, e.g investment-style country rate api is being hit even though not needed, fix this
            countryRate: getCountryRateLoader(queryClient)(),
          }),
        element: (
          <RouterLoaderProvider>
            <RetirementFlowLazy />
          </RouterLoaderProvider>
        ),
        children: [
          ...RiskQuestionnaireRoutes,
          {
            path: 'age',
            loader: getInvestmentStyleQuestionnaireLoader(queryClient),
            element: (
              <Suspense fallback={<SkeletonLoading variant="full" />}>
                <RetirementAgeFormLazy />
              </Suspense>
            ),
          },
          {
            path: 'monthly-expenses',
            element: (
              <Suspense fallback={<SkeletonLoading variant="full" />}>
                <RetirementMonthlyExpensesFormLazy />
              </Suspense>
            ),
          },
          {
            path: 'setup-contribution',
            loader: async () => {
              return defer({
                contributionRecommendation:
                  getContributionRecommendationLader(queryClient)(),
              });
            },
            element: (
              <RouterLoaderProvider
                fallback={<SkeletonLoading variant="full" />}
              >
                <SetupContributionLazy />
              </RouterLoaderProvider>
            ),
          },
        ],
      },
      {
        path: INVESTOR_ROUTES.GOAL_INSIGHT,
        loader: async () => {
          return defer({
            projection: getOptimizedProjectionLoader(queryClient)(),
            advisorProfile: getAdvisorProfileLoader(queryClient)(),
          });
        },
        element: (
          <RouterLoaderProvider fallback={<InsightLoader />}>
            <GoalInsightLazy />
          </RouterLoaderProvider>
        ),
      },

      {
        path: INVESTOR_ROUTES.SCHEDULE_APPOINTMENT,
        element: (
          <Suspense>
            <ScheduleAppointmentLazy />
          </Suspense>
        ),
      },
      {
        path: INVESTOR_ROUTES.APPOINTMENT_SCHEDULED,
        element: (
          <Suspense>
            <AppointmentScheduledLazy />
          </Suspense>
        ),
      },
      {
        path: INVESTOR_ROUTES.GET_FINANCIAL_PLAN,
        element: (
          <Suspense>
            <GetFinancialPlanLazy />
          </Suspense>
        ),
      },
      {
        path: INVESTOR_ROUTES.FINANCIAL_PLAN_SENT,
        element: (
          <Suspense>
            <FinancialPlanSentLazy />
          </Suspense>
        ),
      },
      {
        path: INVESTOR_ROUTES.ROBO_INSTRUCTIONS,
        element: (
          <Suspense>
            <RoboInstructionLazy />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: 'version',
    element: (
      <Suspense>
        <VersionPageLazy />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
];

/**
 * function to create routes with its corresponding router type
 */
export const createRouter = (isMemoryRouter = false) => {
  if (isMemoryRouter) {
    return createMemoryRouter(ROUTES);
  }

  return createBrowserRouter(ROUTES);
};

export default createRouter;
