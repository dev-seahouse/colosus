import type { Meta, StoryObj } from '@storybook/react';
import { GoalDetailsGoalCard } from './GoalDetailsGoalCard';

const meta: Meta<typeof GoalDetailsGoalCard> = {
  component: GoalDetailsGoalCard,
  title: 'manage-goals/components/GoalDetailsGoalCard',
};
export default meta;
type Story = StoryObj<typeof GoalDetailsGoalCard>;

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
