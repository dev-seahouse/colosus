import { useQuery } from '@tanstack/react-query';
import { DateTime } from 'luxon';

import { useCallback } from 'react';
import { convertUnixToDate } from './useGetSubscriptions.utils';
import { getSubscriptionsQuery } from './useGetSubscriptions';
import type { GetSubscriptionsData } from './useGetSubscriptions';
import getSubscriptionAmount from '../../utils/getSubscriptionAmount/getSubscriptionAmount';

/**
 * hoook to return available subscription
 */
export const useSelectSubscriptionQuery = () => {
  return useQuery({
    ...getSubscriptionsQuery(),
    select: useCallback((data: GetSubscriptionsData) => {
      const subscription = data.subscriptions[0];
      const { currency, current_period_end, current_period_start, items } =
        subscription;

      return {
        currency,
        subscriptionPlan: items.data[0].plan.nickname,
        subscriptionFee: getSubscriptionAmount(
          items.data[0].plan.amount_decimal
        ),
        subscriptionInterval: items.data[0].plan.interval,
        startBillingDate: convertUnixToDate(current_period_start),
        nextBillingDate: convertUnixToDate(
          DateTime.fromSeconds(current_period_end).plus({ day: 1 }).toSeconds()
        ),
      };
    }, []),
  });
};
