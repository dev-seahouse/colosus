import type { Meta } from '@storybook/react';
import { DashboardPage } from '@bambu/go-advisor-core';
import { ManageProfilePage } from './ManageProfilePage';

const Story: Meta<typeof ManageProfilePage> = {
  component: DashboardPage,
  title: 'Profile/pages/ManageProfilePage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <ManageProfilePage />,
    },
  },
};
