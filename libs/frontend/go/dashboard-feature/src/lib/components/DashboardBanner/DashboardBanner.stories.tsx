import type { Meta, StoryObj } from '@storybook/react';
import DashboardBanner from './DashboardBanner';

const meta: Meta<typeof DashboardBanner> = {
  component: DashboardBanner,
  title: 'dashboard/components/DashboardBanner',
};
export default meta;
type Story = StoryObj<typeof DashboardBanner>;

export const Primary = {
  args: {},
};
