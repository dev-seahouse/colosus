import type { Meta, StoryObj } from '@storybook/react';
import { GoalSummaryCard } from './GoalSummaryCard';

const meta: Meta<typeof GoalSummaryCard> = {
  component: GoalSummaryCard,
  title: 'manage-goals/components/GoalSummaryCard',
};
export default meta;
type Story = StoryObj<typeof GoalSummaryCard>;

export const Primary = {
  args: {
    goalId: '0a9cade0-66ec-479b-b6f3-ad7c3fafb55f',
  },
};
