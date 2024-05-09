import { useEffect } from 'react';

import {
  useProfileDetails,
  useSelectHasActiveSubscriptionQuery,
  useSelectKycStatus,
  useSelectSetUserData,
  useSelectUnfinishedTaskIndexQuery,
  useSelectUserInterestInTransactFlagQuery,
  useSelectUserSubscriptionTypeQuery,
} from '@bambu/go-advisor-core';
import { Stack } from '@bambu/react-ui';
import { SharedEnums } from '@bambu/shared';

import HomePageContent from '../../components/HomePageContent/HomePageContent';
import TransactBanner from '../../components/TransactBanner/TransactBanner';
import TransactSetupGuide from '../../components/TransactSetupGuide/TransactSetupGuide';
import UserProgressBanner from '../../components/UserProgressBanner/UserProgressBanner';
import DomainRegisteredDialogProvider from '../../Providers/DomainRegisteredDialogProvider/DomainRegisteredDialogProvider';
import PaymentDialogProvider from '../../Providers/PaymentDialogProvider/PaymentDialogProvider';

export function HomePage() {
  const { isLoading, isRefetching } = useProfileDetails();
  const { data: kycStatus } = useSelectKycStatus();

  const setUserData = useSelectSetUserData();

  const { data: userHasActiveSubscription } =
    useSelectHasActiveSubscriptionQuery();
  const { data: subscriptionType } = useSelectUserSubscriptionTypeQuery();
  const { data: isInterestedInTransact } =
    useSelectUserInterestInTransactFlagQuery();
  const hasCompletedAllTasks = useSelectUnfinishedTaskIndexQuery() === -1;

  const isTransactSubscription =
    subscriptionType === SharedEnums.BambuGoProductIdEnum.TRANSACT;
  const isConnect =
    subscriptionType === SharedEnums.BambuGoProductIdEnum.CONNECT;

  const isConfigureInProgressKyc =
    kycStatus ===
    SharedEnums.TenantTransactBrokerageStatusEnum.CONFIGURATION_IN_PROGRESS;
  const isActiveKycStatus =
    kycStatus === SharedEnums.TenantTransactBrokerageStatusEnum.ACTIVE;

  // TODO: move this into route level
  useEffect(() => {
    setUserData({
      subscriptionType:
        subscriptionType && userHasActiveSubscription ? subscriptionType : null,
      isInterestedInTransact,
      kycStatus,
    });
  }, [
    subscriptionType,
    setUserData,
    isInterestedInTransact,
    kycStatus,
    userHasActiveSubscription,
    isLoading,
  ]);

  const shouldRenderTransactBanner = () => {
    return (
      !userHasActiveSubscription ||
      !hasCompletedAllTasks ||
      (isConnect && !kycStatus) || // completed all tasks
      (isConnect && !isConfigureInProgressKyc && !isActiveKycStatus) //completed all tasks
    );
  };

  const shouldRenderTransactSetupGuide = () => {
    return (
      hasCompletedAllTasks &&
      !isTransactSubscription &&
      (isActiveKycStatus || isConfigureInProgressKyc)
    );
  };

  if (isLoading || isRefetching) {
    return null;
  }

  return (
    <>
      <Stack spacing={3}>
        <UserProgressBanner />
        {shouldRenderTransactBanner() && <TransactBanner />}
        {shouldRenderTransactSetupGuide() && <TransactSetupGuide />}
        <HomePageContent />
      </Stack>
      <PaymentDialogProvider />
      <DomainRegisteredDialogProvider />
    </>
  );
}

export default HomePage;
