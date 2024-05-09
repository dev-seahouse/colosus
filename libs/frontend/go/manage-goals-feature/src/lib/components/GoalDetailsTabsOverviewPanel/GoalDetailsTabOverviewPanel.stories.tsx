import type { Meta, StoryObj } from '@storybook/react';
import GoalDetailsTabsOverviewPanel from './GoalDetailsTabsOverviewPanel';

const meta: Meta<typeof GoalDetailsTabsOverviewPanel> = {
  component: GoalDetailsTabsOverviewPanel,
  title: 'manage-goals/components/GoalDetailsTabsOverviewPanel',
};
export default meta;
type Story = StoryObj<typeof GoalDetailsTabsOverviewPanel>;

export const Primary = {
  args: {
    goalId: '0a9cade0-66ec-479b-b6f3-ad7c3fafb55f',
  },
};
