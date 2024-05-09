import type { Meta } from '@storybook/react';
import { LeadsPage } from './LeadsPage';
import { DashboardPage } from '@bambu/go-advisor-core';

const Story: Meta<typeof LeadsPage> = {
  component: DashboardPage,
  title: 'leads/pages/LeadsPage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <LeadsPage />,
      routePath: '/dashboard/leads',
    },
  },
};
