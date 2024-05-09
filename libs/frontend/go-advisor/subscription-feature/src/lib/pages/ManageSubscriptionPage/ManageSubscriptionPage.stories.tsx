import { DashboardPage } from '@bambu/go-advisor-core';
import type { Meta } from '@storybook/react';
import { ManageSubscriptionPage } from './ManageSubscriptionPage';

const Story: Meta<typeof ManageSubscriptionPage> = {
  component: DashboardPage,
  title: 'Subscription/pages/ManageSubscriptionPage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <ManageSubscriptionPage />,
    },
  },
};
