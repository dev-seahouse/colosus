import { createBrowserRouter, defer, redirect } from 'react-router-dom';
import { lazy } from 'react';

import {
  AuthenticatedRoute,
  getProfileDetailsLoader,
  getTenantBrandingLoader,
  getTopLevelOptionsLoader,
  getUploadedDocumentsLoader,
  selectIsUserLoggedIn,
} from '@bambu/go-advisor-core';
import {
  LayoutWithBackground,
  LazyLoader,
  LoginPage,
} from '@bambu/go-advisor-auth-feature';
import {
  getConnectPortfolioByKeyLoader,
  getConnectPortfoliosLoader,
} from '@bambu/go-advisor-portfolios-feature';
import {
  getPricesLoader,
  getSubscriptionsLoader,
} from '@bambu/go-advisor-subscription-feature';

import {
  ErrorBoundaryFallback,
  PageNotFound,
  RouterLoaderProvider,
} from '@bambu/react-ui';
import { getGoalsConfigurationLoader } from '@bambu/go-advisor-goals-feature';
import { getRiskProfilesLoader } from '@bambu/go-advisor-risk-profile-feature';

import { queryClient } from '../../queryClient';
import Suspense from '../Suspense/Suspense';
import SkeletonLoading from '../SkeletonLoading/SkeletonLoading';
import { SettingsPageLoader } from '@bambu/go-advisor-settings-feature';

const CreateAccountLazy = lazy(() => import('./CreateAccountLazy'));
const VerifyAccountLazy = lazy(() => import('./VerifyAccountLazy'));

const ResetPasswordUpdateLazy = lazy(() => import('./ResetPasswordUpdateLazy'));
const ResetPasswordInstructionLazy = lazy(
  () => import('./ResetPasswordInstructionLazy')
);
const ResetPasswordSuccessLazy = lazy(
  () => import('./ResetPasswordSuccessLazy')
);
const ResetPasswordLazy = lazy(() => import('./ResetPasswordLazy'));
const SelectSubscriptionLazy = lazy(() => import('./SelectSubscriptionLazy'));
const OnboardingLazy = lazy(() => import('./OnboardingLazy'));
const AdvisorDetailsLazy = lazy(() => import('./AdvisorDetailsLazy'));
const DashboardLazy = lazy(() => import('./DashboardLazy'));
const InAppPreviewLazy = lazy(() => import('./InAppPreviewLazy'));
const BrandingLazy = lazy(() => import('./BrandingLazy'));
const GoalsLazy = lazy(() => import('./GoalsLazy'));
const PortfoliosLazy = lazy(() => import('./PortfoliosLazy'));
const ConfigurePortfolioLazy = lazy(() => import('./ConfigurePortfolioLazy'));
const HomeLazy = lazy(() => import('./HomeLazy'));
const SetupPlatformLazy = lazy(() => import('./SetupPlatformLazy'));
const ManageProfileLazy = lazy(() => import('./ManageProfileLazy'));
const ContentLazy = lazy(() => import('./ContentLazy'));
const ProfileSummaryLazy = lazy(() => import('./ProfileSummaryLazy'));
const ManageSubscriptionLazy = lazy(() => import('./ManageSubscriptionLazy'));
const ContactMeLazy = lazy(() => import('./ContactMeLazy'));
const LegalDocumentsLazy = lazy(() => import('./LegalDocumentsLazy'));
const RiskProfileConfigLazy = lazy(() => import('./RiskProfileConfigLazy'));
const RiskQuestionnaireLazy = lazy(() => import('./RiskQuestionnaireLazy'));
const LeadsLazy = lazy(() => import('./LeadsLazy'));
const SettingsLazy = lazy(() => import('./SettingsLazy'));
const GetVerifiedLazy = lazy(() => import('./GetVerifiedLazy'));
const GetVerifiedInstructionsLazy = lazy(
  () => import('./GetVerifiedInstructionsLazy')
);
const ClientsLazy = lazy(() => import('./ClientsLazy'));

const VersionPageLazy = lazy(() => import('../VersionPage/VersionPage'));

const LeadsSettingLazy = lazy(() => import('./LeadsSettingLazy'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutWithBackground />,
    errorElement: <ErrorBoundaryFallback />,
    loader: () => {
      const isLoggedIn = selectIsUserLoggedIn();

      if (isLoggedIn) {
        return redirect('dashboard/home');
      }

      return null;
    },
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: 'create-account',
        element: (
          <Suspense fallback={<LazyLoader />}>
            <CreateAccountLazy />
          </Suspense>
        ),
      },
      {
        path: 'create-account-verify',
        element: (
          <Suspense fallback={<LazyLoader />}>
            <VerifyAccountLazy />
          </Suspense>
        ),
      },
      {
        path: 'reset-password',
        element: (
          <Suspense fallback={<LazyLoader />}>
            <ResetPasswordLazy />
          </Suspense>
        ),
      },
      {
        path: 'reset-password-update',
        element: (
          <Suspense fallback={<LazyLoader />}>
            <ResetPasswordUpdateLazy />
          </Suspense>
        ),
      },
      {
        path: 'reset-password-instruction',
        element: (
          <Suspense fallback={<LazyLoader />}>
            <ResetPasswordInstructionLazy />
          </Suspense>
        ),
      },
      {
        path: 'reset-password-success',
        element: (
          <Suspense fallback={<LazyLoader />}>
            <ResetPasswordSuccessLazy />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: (
      <RouterLoaderProvider>
        <AuthenticatedRoute />
      </RouterLoaderProvider>
    ),
    loader: async () => {
      const isLoggedIn = selectIsUserLoggedIn();

      if (!isLoggedIn) {
        return redirect('/');
      }

      return defer({
        profileDetails: await getProfileDetailsLoader(queryClient)(),
        branding: await getTenantBrandingLoader(queryClient)(),
        uploadedDocuments: await getUploadedDocumentsLoader(queryClient)(),
      });
    },
    children: [
      {
        path: 'select-subscription',
        element: (
          <RouterLoaderProvider>
            <SelectSubscriptionLazy />
          </RouterLoaderProvider>
        ),
        loader: async () =>
          defer({
            prices: getPricesLoader(queryClient)(),
          }),
      },
      {
        path: 'onboarding',
        element: (
          <Suspense>
            <OnboardingLazy />
          </Suspense>
        ),
        children: [
          {
            path: 'advisor-details',
            element: (
              <Suspense>
                <AdvisorDetailsLazy />
              </Suspense>
            ),
          },
          {
            path: 'setup-platform',
            element: (
              <Suspense>
                <SetupPlatformLazy />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'dashboard',
        element: (
          <Suspense>
            <DashboardLazy />
          </Suspense>
        ),
        children: [
          {
            path: 'home',
            element: (
              <Suspense fallback={<SkeletonLoading />}>
                <HomeLazy />
              </Suspense>
            ),
          },
          {
            path: 'preview',
            element: (
              <Suspense fallback={<SkeletonLoading />}>
                <InAppPreviewLazy />
              </Suspense>
            ),
          },
          {
            path: 'branding',
            element: (
              <Suspense fallback={<SkeletonLoading />}>
                <BrandingLazy />
              </Suspense>
            ),
          },
          {
            path: 'goals',
            loader: getGoalsConfigurationLoader(queryClient),
            element: <GoalsLazy />,
          },
          {
            path: 'portfolios',
            loader: async () =>
              defer({ portfolios: getConnectPortfoliosLoader(queryClient)() }),
            element: (
              <RouterLoaderProvider fallback={<SkeletonLoading />}>
                <PortfoliosLazy />
              </RouterLoaderProvider>
            ),
          },
          {
            path: 'risk-profile/questionnaire',
            element: (
              <Suspense fallback={<SkeletonLoading />}>
                <RiskQuestionnaireLazy />
              </Suspense>
            ),
          },
          {
            path: 'risk-profile/config',
            loader: async () =>
              defer({
                riskProfiles: getRiskProfilesLoader(queryClient)(),
              }),
            element: (
              <Suspense fallback={<SkeletonLoading />}>
                <RiskProfileConfigLazy />
              </Suspense>
            ),
          },
          {
            path: 'portfolios/:portfolioType',
            loader: async ({ params }) =>
              defer({
                portfolio: getConnectPortfolioByKeyLoader(queryClient)(
                  params.portfolioType as string
                ),
              }),
            element: (
              <RouterLoaderProvider fallback={<SkeletonLoading />}>
                <ConfigurePortfolioLazy />
              </RouterLoaderProvider>
            ),
          },
          {
            path: 'manage-profile',
            element: (
              <Suspense fallback={<SkeletonLoading />}>
                <ManageProfileLazy />
              </Suspense>
            ),
          },
          {
            path: 'content',
            element: (
              <Suspense fallback={<SkeletonLoading />}>
                <ContentLazy />
              </Suspense>
            ),
          },
          {
            path: 'clients',
            element: (
              <Suspense fallback={<SkeletonLoading />}>
                <ClientsLazy />
              </Suspense>
            ),
          },
          {
            path: 'content/my-profile-summary',
            element: (
              <Suspense fallback={<SkeletonLoading />}>
                <ProfileSummaryLazy />
              </Suspense>
            ),
          },
          {
            path: 'content/reasons-to-contact-me',
            element: (
              <Suspense fallback={<SkeletonLoading />}>
                <ContactMeLazy />
              </Suspense>
            ),
          },
          {
            path: 'content/legal-documents',
            element: (
              <Suspense fallback={<SkeletonLoading />}>
                <LegalDocumentsLazy />
              </Suspense>
            ),
          },
          {
            path: 'get-verified',
            element: (
              <Suspense fallback={<SkeletonLoading />}>
                <GetVerifiedLazy />
              </Suspense>
            ),
          },
          {
            path: 'get-verified/instructions',
            element: (
              <Suspense fallback={<SkeletonLoading />}>
                <GetVerifiedInstructionsLazy />
              </Suspense>
            ),
          },
          {
            path: 'manage-subscription',
            loader: () =>
              defer({
                subscriptions: getSubscriptionsLoader(queryClient)(),
              }),
            element: (
              <RouterLoaderProvider fallback={<SkeletonLoading />}>
                <ManageSubscriptionLazy />
              </RouterLoaderProvider>
            ),
          },
          {
            path: 'leads',
            loader: () =>
              defer({
                topLevelOptions: getTopLevelOptionsLoader(queryClient)(),
              }),
            element: (
              //!! using RouterLoaderProvider will cause data loading error due to portfolio<-leads dependency
              <Suspense fallback={<SkeletonLoading />}>
                <LeadsLazy />
              </Suspense>
            ),
          },
          {
            path: 'leads/setting',
            loader: () =>
              defer({
                topLevelOptions: getTopLevelOptionsLoader(queryClient)(),
              }),
            element: (
              <Suspense fallback={<SkeletonLoading />}>
                <LeadsSettingLazy />
              </Suspense>
            ),
          },
          {
            path: 'settings',
            loader: () =>
              defer({
                topLevelOptions: getTopLevelOptionsLoader(queryClient)(),
              }),
            element: (
              <SettingsPageLoader fallback={<SkeletonLoading />}>
                <SettingsLazy />
              </SettingsPageLoader>
            ),
          },
          {
            path: '*',
            element: <PageNotFound />,
          },
        ],
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
]);

export default router;
