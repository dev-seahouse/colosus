import type { Meta, StoryObj } from '@storybook/react';
import { TransactPortfolioSummary } from './TransactPortfolioSummary';
import { useCoreStore } from '@bambu/go-core';

const meta: Meta<typeof TransactPortfolioSummary> = {
  component: TransactPortfolioSummary,
  title: 'goal-settings/components/TransactPortfolioSummary',
};
export default meta;
type Story = StoryObj<typeof TransactPortfolioSummary>;

export const Primary: Story = {
  args: {},
  decorators: [
    (Story) => {
      useCoreStore.setState({
        riskProfileId: '8e6fb5fd-e8b4-4019-9d2c-6fd1ff8f6e5f',
      });

      return Story();
    },
  ],
};
