import type { Meta, StoryObj } from '@storybook/react';
import { GoalDetailsTransactionHistory } from './GoalDetailsTransactionHistory';

const meta: Meta<typeof GoalDetailsTransactionHistory> = {
  component: GoalDetailsTransactionHistory,
  title: 'manage-goals/components/GoalDetailsTransactionHistory',
};
export default meta;
type Story = StoryObj<typeof GoalDetailsTransactionHistory>;

export const Primary = {
  args: {},
};
