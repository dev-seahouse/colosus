import type { Meta } from '@storybook/react';
import { SubscriptionsList } from './SubscriptionsList';

const Story: Meta<typeof SubscriptionsList> = {
  component: SubscriptionsList,
  title: 'Subscription/components/SubscriptionsList',
};
export default Story;

export const Primary = {
  args: {},
};
