import {
  ErrorLoadingCard,
  getActiveMandate,
  hasActiveDirectDebitMandates,
  hasNoKycAccount,
  hasPendingDirectDebitMandates,
  isKycActive,
  isKycPending,
  LoadingCard,
  useSelectHasActiveDirectDebitSubscriptions,
  useSelectHasPendingDirectDebitSubscriptions,
} from '@bambu/go-core';
import WelcomeBackBanner from './WelcomeBackBanner';
import KycPendingBanner from './KycPendingBanner';
import KycApprovedBanner from './KycApprovedBanner';
import ReadyToInvestBanner from './ReadyToInvestBanner';
import { useDashboardData } from '../../hooks/useDashboardData';
import DirectDebitInProgressBanner from './DirectDebitInProgressBanner';
import ActiveGoalBanner from './ActiveGoalBanner';
import ReceivedTransactionRequestBanner from './ReceivedTransactionRequestBanner';

export function DashboardBanner() {
  const { isLoading, isFetching, profileData, mandatesData, platformData } =
    useDashboardData();

  const activeMandate = getActiveMandate(mandatesData);

  const { data: hasActiveDirectDebitSubscription } =
    useSelectHasActiveDirectDebitSubscriptions(
      {
        goalId: profileData?.Goals[0].id,
        mandateId: activeMandate?.id ?? '',
      },
      {
        enabled: !!activeMandate?.id && !!profileData?.Goals[0].id,
        staleTime: 1000 * 60,
      }
    );

  const { data: hasPendingDirectDebitSubscription } =
    useSelectHasPendingDirectDebitSubscriptions(
      {
        mandateId: activeMandate?.id ?? '',
        goalId: profileData?.Goals[0].id,
      },
      {
        enabled: !!activeMandate?.id && !!profileData?.Goals[0].id,
        staleTime: 1000 * 60,
      }
    );

  if (isLoading || isFetching) {
    return <LoadingCard />;
  }

  if (!profileData) {
    console.error('profile did not load successfully');
    return <ErrorLoadingCard />;
  }

  switch (true) {
    case hasNoKycAccount(profileData):
      return <WelcomeBackBanner name={profileData.name} />;
    case isKycPending(platformData):
      return <KycPendingBanner name={profileData.name} />;
    case isKycActive(platformData) &&
      !hasActiveDirectDebitMandates(mandatesData):
      return <KycApprovedBanner name={profileData.name} />;
    case isKycActive(platformData) &&
      hasPendingDirectDebitMandates(mandatesData):
      return <DirectDebitInProgressBanner />;
    case isKycActive(platformData) && hasActiveDirectDebitSubscription:
      return (
        <ActiveGoalBanner
          name={profileData.name}
          goalDescription={profileData.Goals[0].goalDescription}
        />
      );
    case isKycActive(platformData) && hasPendingDirectDebitSubscription:
      return <ReceivedTransactionRequestBanner name={profileData.name} />;
    case hasActiveDirectDebitMandates(mandatesData):
      return <ReadyToInvestBanner />;
    default:
      return null;
  }
}

export default DashboardBanner;
