import type { Meta } from '@storybook/react';
import { GoalCard } from './GoalCard';

const Story: Meta<typeof GoalCard> = {
  component: GoalCard,
  title: 'dashboard/components/GoalCard',
};
export default Story;

export const Primary = {
  args: {
    goalTitle: 'Retire Comfortably',
    timeLeft: '3y 4mo',
    goalValue: 1200000,
    goalTimeframe: 2025,
    goalStatus: 'Inactive',
    portfolioValue: 0,
    cumlativeReturn: 0,
    recurringDeposit: 500,
  },
};
