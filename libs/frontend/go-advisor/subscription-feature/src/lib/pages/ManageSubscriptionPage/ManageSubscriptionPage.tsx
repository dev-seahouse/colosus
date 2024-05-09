import { Stack } from '@bambu/react-ui';
import { Heading } from '@bambu/go-advisor-core';
import SubscriptionsList from '../../components/SubscriptionsList/SubscriptionsList';
import useGetSubscriptions from '../../hooks/useGetSubscriptions/useGetSubscriptions';
import type { GetSubscriptionsData } from '../../hooks/useGetSubscriptions/useGetSubscriptions';

export interface ManageSubscriptionPageProps {
  initialData?: {
    subscriptions: GetSubscriptionsData;
  };
}

export function ManageSubscriptionPage({
  initialData,
}: ManageSubscriptionPageProps) {
  const { isInitialLoading } = useGetSubscriptions({
    initialData: initialData?.subscriptions,
  });

  return isInitialLoading ? null : (
    <Stack spacing={4}>
      <Heading title="Subscription" />
      <SubscriptionsList />
    </Stack>
  );
}

export default ManageSubscriptionPage;
