import type { Meta } from '@storybook/react';
import { DashboardPage } from '@bambu/go-advisor-core';
import { ProfileSummaryPage } from './ProfileSummaryPage';

const Story: Meta<typeof ProfileSummaryPage> = {
  component: DashboardPage,
  title: 'Content/pages/ProfileSummaryPage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <ProfileSummaryPage />,
      routePath: '/dashboard/content/profile-summary',
    },
  },
};
