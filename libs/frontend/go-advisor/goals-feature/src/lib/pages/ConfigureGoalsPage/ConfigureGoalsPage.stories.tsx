import { DashboardPage } from '@bambu/go-advisor-core';
import type { Meta } from '@storybook/react';
import { ConfigureGoalsPage } from './ConfigureGoalsPage';

const Story: Meta<typeof ConfigureGoalsPage> = {
  component: DashboardPage,
  title: 'Goals/pages/ConfigureGoalsPage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <ConfigureGoalsPage />,
      routePath: '/dashboard/goals',
    },
  },
};
