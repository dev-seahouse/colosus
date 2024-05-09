import { useSelectHasActiveSubscriptionQuery } from '@bambu/go-advisor-core';
import InactiveSubscriptionDetails from './InactiveSubscriptionDetails';
import ClientExperienceAccordionDetails from '../ClientExperienceAccordionDetails';
import ActiveSubscriptionDetails from './ActiveSubscriptionDetails';
import SubscribeImg from './assets/subscribe.svg';

export const SubscriptionAccordionDetails = () => {
  const { data: userHasActiveSubscription } =
    useSelectHasActiveSubscriptionQuery();
  const subscriptionStatus = userHasActiveSubscription ? 'ACTIVE' : 'INACTIVE';

  return (
    <ClientExperienceAccordionDetails>
      {subscriptionStatus === 'ACTIVE' ? (
        <ActiveSubscriptionDetails />
      ) : (
        <InactiveSubscriptionDetails />
      )}
      <img src={SubscribeImg} alt="Subscribe" width={256} height={147} />
    </ClientExperienceAccordionDetails>
  );
};

export default SubscriptionAccordionDetails;
