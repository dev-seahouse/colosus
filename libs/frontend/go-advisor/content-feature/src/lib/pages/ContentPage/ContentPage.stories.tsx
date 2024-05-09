import type { Meta } from '@storybook/react';
import { DashboardPage } from '@bambu/go-advisor-core';
import { ContentPage } from './ContentPage';

const Story: Meta<typeof ContentPage> = {
  component: DashboardPage,
  title: 'Content/pages/ContentPage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <ContentPage />,
      routePath: '/dashboard/content',
    },
  },
};
