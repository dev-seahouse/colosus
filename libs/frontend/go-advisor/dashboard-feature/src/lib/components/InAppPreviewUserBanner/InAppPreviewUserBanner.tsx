/* eslint-disable-next-line */
import {
  useSelectUnfinishedTaskIndexQuery,
  useSelectHasActiveSubscriptionQuery,
} from '@bambu/go-advisor-core';
import UnpaidBanner from './UnpaidBanner';
import SubscribedWithRoboSetupComplete from './SubscribedWithRoboSetupCompleteBanner';
import SubscribedWithRoboSetupIncomplete from './SubscribedWithRoboSetupIncomplete';

export function InAppPreviewUserBanner() {
  const { data: userHasActiveSubscription } =
    useSelectHasActiveSubscriptionQuery();

  const subscribedUserWithRoboSetupComplete =
    useSelectUnfinishedTaskIndexQuery() === -1;

  const subscribedUserWithRoboSetupIncomplete =
    userHasActiveSubscription && !subscribedUserWithRoboSetupComplete;

  if (subscribedUserWithRoboSetupComplete) {
    // user is subscribed and has completed robo setup
    return <SubscribedWithRoboSetupComplete />;
  }

  if (subscribedUserWithRoboSetupIncomplete) {
    // user is subscribed but hasn't completed setting up robo
    return <SubscribedWithRoboSetupIncomplete />;
  }

  // return unsubscribed user banner
  return <UnpaidBanner />;
}

export default InAppPreviewUserBanner;
