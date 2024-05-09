import type { Meta, StoryObj } from '@storybook/react';

import { TransactModelPortfolioFactSheet } from './TransactModelPortfolioFactSheet';
import { hookFormDecorator } from '@bambu/storybook-utils';

const meta: Meta<typeof TransactModelPortfolioFactSheet> = {
  component: TransactModelPortfolioFactSheet,
  title: 'portfolios/components/TransactModelPortfolioFactSheet',
};
export default meta;
type Story = StoryObj<typeof TransactModelPortfolioFactSheet>;

export const Primary = {
  args: {},
  decorators: [hookFormDecorator()],
  parameters: {
    reactRouter: {
      routeParams: {
        portfolioType: 'CONSERVATIVE',
      },
    },
  },
};
