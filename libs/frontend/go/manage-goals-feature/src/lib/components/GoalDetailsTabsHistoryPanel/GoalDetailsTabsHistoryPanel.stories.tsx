import type { Meta, StoryObj } from '@storybook/react';
import GoalDetailsTabsHistoryPanel from './GoalDetailsTabsHistoryPanel';

const meta: Meta<typeof GoalDetailsTabsHistoryPanel> = {
  component: GoalDetailsTabsHistoryPanel,
  title: 'manage-goals/components/HistoryPanel',
};
export default meta;
type Story = StoryObj<typeof GoalDetailsTabsHistoryPanel>;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      location: {
        pathParams: { goalId: '0a9cade0-66ec-479b-b6f3-ad7c3fafb55f' },
      },
      routing: { path: '/goalDetails/:goalId' },
    },
  },
};
