import type { Meta } from '@storybook/react';
import { DashboardPage } from '@bambu/go-advisor-core';
import LeadsSettingPage from './LeadsSettingPage';

const Story: Meta<typeof LeadsSettingPage> = {
  component: DashboardPage,
  title: 'leads/pages/LeadsSettingPage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <LeadsSettingPage />,
      routePath: '/dashboard/leads/setting',
    },
  },
};
