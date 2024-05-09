import type { Meta, StoryObj } from '@storybook/react';
import { TransactPortfolioSummaryTable } from './TransactPortfolioSummaryTable';

const meta: Meta<typeof TransactPortfolioSummaryTable> = {
  component: TransactPortfolioSummaryTable,
  title: 'goal-settings/components/TransactPortfolioSummaryTable',
};
export default meta;
type Story = StoryObj<typeof TransactPortfolioSummaryTable>;

export const Primary = {
  args: {
    connectPortfolioId: '3343',
  },
};
