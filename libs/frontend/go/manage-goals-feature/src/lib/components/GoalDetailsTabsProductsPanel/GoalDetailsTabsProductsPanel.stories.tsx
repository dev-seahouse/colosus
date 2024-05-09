import type { Meta, StoryObj } from '@storybook/react';
import { GoalDetailsTabsProductsPanel } from './GoalDetailsTabsProductsPanel';

const meta: Meta<typeof GoalDetailsTabsProductsPanel> = {
  component: GoalDetailsTabsProductsPanel,
  title: 'manage-goals/components/GoalDetailsTabsProductsPanel',
};
export default meta;
type Story = StoryObj<typeof GoalDetailsTabsProductsPanel>;

export const Primary = {
  args: {
    goalId: '0a9cade0-66ec-479b-b6f3-ad7c3fafb55f',
  },
};
