import type { Meta, StoryObj } from '@storybook/react';
import { DashboardBannerLayout } from './DashboardBannerLayout';
import { Button } from '@bambu/react-ui';

const meta: Meta<typeof DashboardBannerLayout> = {
  component: DashboardBannerLayout,
  title: 'dashboard/layouts/BannerLayout',
};
export default meta;
type Story = StoryObj<typeof DashboardBannerLayout>;

export const Primary = {
  args: {
    title: 'Welcome back, Wesley',
    description: "Next, let's turn your dream into a reality",
    action: <Button>Open investment account</Button>,
  },
};

export const Loading = {
  args: {
    title: 'hello',
    isLoading: true,
  },
};
