import type { Meta, StoryObj } from '@storybook/react';
import GoalDetailsTransactionHistoryItem from './GoalDetailsTransactionHistoryItem';

const meta: Meta<typeof GoalDetailsTransactionHistoryItem> = {
  component: GoalDetailsTransactionHistoryItem,
  title: 'manage-goals/components/GoalDetailsTransactionHistoryItem',
};
export default meta;
type Story = StoryObj<typeof GoalDetailsTransactionHistoryItem>;

export const Primary = {
  args: {
    amount: 34343,
    isoDate: '2021-10-01T00:00:00.000Z',
  },
};
