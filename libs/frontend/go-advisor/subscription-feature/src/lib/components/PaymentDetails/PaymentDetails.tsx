import { Stack } from '@bambu/react-ui';
import PaymentDetailsField from '../PaymentDetailsField/PaymentDetailsField';
import { useSelectSubscriptionQuery } from '../../hooks/useGetSubscriptions/useGetSubscriptions.selectors';
import SubscriptionFee from '../SubscriptionFee/SubscriptionFee';

export function PaymentDetails() {
  const { data: subscription } = useSelectSubscriptionQuery();

  if (!subscription) {
    return null;
  }

  return (
    <Stack spacing={1}>
      <PaymentDetailsField
        label="Subscription plan"
        value={subscription?.subscriptionPlan}
      />
      <PaymentDetailsField
        label="Subscription fee"
        value={
          <SubscriptionFee
            currency={subscription?.currency}
            subscriptionFee={subscription?.subscriptionFee}
            subscriptionInterval={subscription?.subscriptionInterval}
          />
        }
      />
      <PaymentDetailsField
        label="Start date"
        value={subscription?.startBillingDate}
      />
      <PaymentDetailsField
        label="Next billing date"
        value={subscription?.nextBillingDate}
      />
    </Stack>
  );
}

export default PaymentDetails;
