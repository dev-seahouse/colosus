import type { Stripe } from 'stripe';
import { NumericFormat } from 'react-number-format';

export interface SubscriptionFeeProps {
  subscriptionInterval?: Stripe.Plan.Interval;
  currency?: string;
  subscriptionFee?: number;
}

export function SubscriptionFee({
  currency = 'usd',
  subscriptionFee = 0,
  subscriptionInterval = 'month',
}: SubscriptionFeeProps) {
  return (
    <NumericFormat
      displayType="text"
      prefix={currency.toUpperCase()}
      value={subscriptionFee}
      suffix={`/${subscriptionInterval}`}
    />
  );
}

export default SubscriptionFee;
